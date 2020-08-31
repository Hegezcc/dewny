<?php

namespace App\Http\Controllers;

use App\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class MessageController extends Controller
{
    public function removeMessage($id)
    {
        $msg = Message::find($id);

        Gate::authorize('access', $msg);

        $msg->delete();

        return response()->json(['status' => 'ok']);
    }
}
