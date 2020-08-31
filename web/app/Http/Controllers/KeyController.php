<?php

namespace App\Http\Controllers;

use App\Key;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class KeyController extends Controller
{
    public function newKey(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // With simple knowledge we cannot guarantee 64-bit integer serialized to 10-base always having at least
            // 15 digits, but we can guesstimate it based on how Discord produces its snowflakes. If we assume all
            // user and channels are created at least one day after Discord epoch, the length of digit field is
            // between 15 and 20, inclusive.
            'discord_id' => 'required|bail|exists:App\User,discord_id|numeric|digits_between:15,20',
            'secret' => [
                'required',
                'string',
                function ($attr, $val, $fail) use ($request) {
                    // Fail if user is already using this secret, no duplicates allowed
                    $count = Key::join('users', 'users.id', '=', 'keys.user_id')
                        ->where('discord_id', $request->input('discord_id'))
                        ->where('secret', $request->input('secret'))
                        ->count();

                    if ($count !== 0) {
                        $fail('The ' . $attr . ' must be unique for the user.');
                    }
                }
            ],
            'description' => 'nullable|string',
            'channel_id' => 'nullable|string|numeric|digits_between:15,20',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'data' => $validator->errors()], 400);
        }

        $user = User::where('discord_id', $request->input('discord_id'))->first();

        Gate::authorize('access', $user);

        $data = $validator->validated();
        $data['user_id'] = $user->id;

        Key::create($data);

        return response()->json(['status' => 'ok']);
    }

    public function removeKey($id)
    {
        $key = Key::find($id);

        Gate::authorize('access', $key);

        $key->delete();

        return response()->json(['status' => 'ok']);
    }
}
