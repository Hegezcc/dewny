<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

class SPAController extends Controller
{
    public function index(Request $request)
    {
        // Get user with related models, or null if not exist
        if (Auth::check()) {
            $user = User::where('id', Auth::id())->with(['keys.messages'])->first();
        } else {
            $user = null;
        }

        // Generate route map for application, include named routes, exclude empty and temporary routes
        $routes = [];
        $base = url('/');

        foreach (Route::getRoutes()->get() as $v) {
            $key = $v->action['as'] ?? null;

            if (!empty($key) && !Str::startsWith($key, 'generated::') && !Str::startsWith($v->uri, '_')) {
                $val = "$base/{$v->uri}";
                $val = preg_replace('#{[^}]*?\?}#', '', $val);
                $val = rtrim($val, '/');
                $routes[$key] = $val;
            }
        }

        // Add Node.js app url as a route
        $routes['node'] = config('app.node_url');

        if ($user !== null) {
            \DebugBar::info('User: ', $user->toArray());
        } else {
            \DebugBar::info('User not authenticated');
        }

        // Insert bot id so users can invite bot to their servers easily
        $bot_client_id = config('app.discord_client_id');

        // Check if debug mode
        $debug = config('app.debug');

        // Redirect to SPAController with data, so it does not need to be loaded in the first requests
        return view('master')->with(['data' => compact('user', 'routes', 'bot_client_id', 'debug')]);
    }
}
