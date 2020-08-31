<?php

namespace App;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class User extends Model implements Authenticatable
{
    use \Illuminate\Auth\Authenticatable;

    protected $fillable = [
        'discord_id',
        'username',
        'avatar_url',
        'last_ip_address',
    ];

    protected $hidden = ['last_ip_address', 'id', 'remember_token'];
    protected $casts = ['discord_id' => 'string'];

    /**
     * Return the URL for the avatar of user. It may be set, set and animated, or unset, and they all will return a real
     * avatar url.
     *
     * @param $val
     * @return string
     */
    public function getAvatarUrlAttribute($val)
    {
        // If user has not set their avatar, it is specially defined as their username discriminator modulo five.
        if (empty($val)) {
            $mod = ((int)Str::after($this->username, '#')) % 5;
            return "https://cdn.discordapp.com/embed/avatars/$mod.png";
        }

        // The Discord way to say if avatar is animated is to check if the value starts with "a_"
        $isGif = Str::startsWith($val, 'a_');

        $ext = $isGif ? 'gif' : 'png';

        return "https://cdn.discordapp.com/avatars/$this->discord_id/$val.$ext";
    }

    public static function booted()
    {
        static::updating(function (User $user) {
            // Update last IP address if session user is the accessor of this user
            // (we do not want to update the IP address e.g. in case when admin loads list of users)
            // Note: we have last_ip_address for keys too, but that's for actually using the key, not just accessing it

            if (Auth::id() === $user->id && isset($_SERVER['REMOTE_ADDR'])) {
                $user->last_ip_address = $_SERVER['REMOTE_ADDR'];
            }
        });
    }

    public function keys()
    {
        return $this->hasMany('App\Key');
    }

    public function messages()
    {
        return $this->hasManyThrough('App\Message', 'App\Key');
    }

    public function getAuthPassword()
    {
        return null;
    }
}
