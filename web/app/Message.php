<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'data',
        'key_id',
    ];

    public function key()
    {
        return $this->belongsTo('App\Key');
    }

    public function user()
    {
        return $this->key->belongsTo('App\User');
    }
}
