<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Credential extends Model
{
    protected $fillable = [
        'wallet_address',
        'quiz_session_id',
        'token_id',
        'transaction_hash',
        'skill',
        'score',
        'minted_at'
    ];

    public function session()
    {
        return $this->belongsTo(QuizSession::class, 'quiz_session_id');
    }
}