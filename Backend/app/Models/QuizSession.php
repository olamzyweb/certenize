<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizSession extends Model
{
    protected $fillable = [
        'wallet_address',
        'topic',
        'quiz_json',
        'status',
        'score',
        'mint_token'
    ];

    protected $casts = [
        'quiz_json' => 'array'
    ];
}