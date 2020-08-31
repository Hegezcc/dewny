<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\MessageBag;
use Illuminate\Support\ViewErrorBag;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected static function redirectError($err)
    {
        $bag = new MessageBag();

        if (is_iterable($err)) {
            $i = 1;
            foreach ($err as $msg) {
                $bag->add("token-$i", (string) $msg);
                $i++;
            }
        } else {
            $bag->add('token', (string) $err);
        }

        return redirect('/error')->with('errors', (new ViewErrorBag)->put('default', $bag));
    }
}
