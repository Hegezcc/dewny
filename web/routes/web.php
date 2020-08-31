<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// API routes

Route::prefix('api')->group(function() {
    Route::get('user/{id?}', 'UserController@getUser')->name('user.get');

    Route::post('key', 'KeyController@newKey')->name('key.new');
    Route::delete('key/{id}', 'KeyController@removeKey')->name('key.delete');

    Route::delete('message/{id}', 'MessageController@removeMessage')->name('message.delete');
});



// Web routes

Route::get('/', 'SPAController@index')->name('index');

Route::get('/oauth/start', 'OAuthController@startFlow')->name('oauth.start');
Route::get('/oauth/return', 'OAuthController@exchangeAccessCode')->name('oauth.return');

Route::get('/logout', 'UserController@logout')->name('logout');

Route::get('/{any}', 'SPAController@index')->where('any', '.*');

