<?php

namespace App\Http\Controllers;

use App\User;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class OAuthController extends Controller
{
    public function startFlow(Request $request)
    {
        // Using a state variable to make sure a single OAuth flow can be used only once
        $state = Str::random();
        session(compact('state'));

        $url = 'https://discord.com/api/oauth2/authorize';
        $parts = http_build_query([
            'response_type' => 'code',
            'client_id' => config('app.discord_client_id'),
            'scope' => 'identify',
            'state' => $state,
            'redirect_uri' => route('oauth.return'),
            'prompt' => 'none',
        ]);

        return redirect()->away("$url?$parts");
    }

    public function exchangeAccessCode(Request $request)
    {
        // Note: this endpoint blocks for duration of up to two requests. This is the intended behaviour and couldn't
        // be done faster with other frameworks/languages. (Well, we could return a placeholder waiting page and do the
        // "heavy lifting" while user waits on that page, but for demonstration purposes this is acceptable.)

        // Request authorized by state (single use)
        if ($request->state !== session()->pull('state')) {
            return static::redirectError('Invalid state used. Please start authorization flow again.');
        }

        if (!$request->has('code')) {
            return static::redirectError('Discord API authorization code was not specified when accessing this page.');
        }

        // Start conversation with Discord API
        $client = new Client();

        // First request: exchange user-sent authorization code to access token
        $token_response = $client->post('https://discord.com/api/v6/oauth2/token', [
            'form_params' => [
                'client_id' => config('app.discord_client_id'),
                'client_secret' => config('app.discord_client_secret'),
                'grant_type' => 'authorization_code',
                'code' => $request->code,
                'redirect_uri' => route('oauth.return'),
                'scope' => 'identify',
            ],
            'http_errors' => false,
        ]);

        $status = $token_response->getStatusCode();

        if ($status !== 200) {
            return static::redirectError(["Discord API returned error code $status while fetching access token.", $token_response->getBody()]);
        }

        // Extract access token and craft authorization headers
        $token_data = json_decode((string)$token_response->getBody(), true);
        $auth = [
            'headers' => [
                'Accept' => 'application/json',
                'Authorization' => "${token_data['token_type']} ${token_data['access_token']}"
            ],
            'http_errors' => false,
        ];

        // Create DM channel with user (so bot can send DMs), no response handling needed on this one
        $client->postAsync('https://discord.com/api/v6/users/@me/channels', $auth);

        // Get user data
        $user_response = $client->get('https://discord.com/api/v6/users/@me', $auth);

        $status = $user_response->getStatusCode();

        if ($status !== 200) {
            return static::redirectError(["Discord API returned error $status while fetching user data.", $token_response->getBody()]);
        }

        $user_data = json_decode((string)$user_response->getBody(), true);

        if (empty($user_data)) {
            return static::redirectError(["Discord API returned empty response for user data."]);
        }

        // Now we have a user object, save it to database (or update existing model) and persist it as user session
        $user = User::updateOrCreate([
            'discord_id' => $user_data['id'],
        ], [
            'username' => "${user_data['username']}#${user_data['discriminator']}",
            'avatar_url' => $user_data['avatar'],
            'last_ip_address' => $_SERVER['REMOTE_ADDR'],
        ]);

        Auth::login($user, true);

        return redirect('/user');
    }
}
