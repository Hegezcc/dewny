<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Key extends Model
{
    protected $fillable = [
        'secret',
        'description',
        'user_id',
        'channel_id',
    ];

    protected $casts = ['channel_id' => 'string'];

    protected $dates = ['last_used_at'];

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function messages()
    {
        return $this->hasMany('App\Message');
    }
}
