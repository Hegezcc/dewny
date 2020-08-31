<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    public function getUser(Request $request, $id = null)
    {
        if (empty($id)) {
            $id = Auth::id();
        }

        $user = User::where('id', Auth::id())->with(['keys.messages'])->first();

        Gate::authorize('access', $user);

        return $user;
    }

    public function logout()
    {
        Auth::logout();

        return redirect()->route('index');
    }
}
