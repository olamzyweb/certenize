<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\CredentialController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/generate-quiz', [QuizController::class, 'generate']);
Route::post('/submit-quiz', [QuizController::class, 'submit']);
Route::post('/mint-credential', [CredentialController::class, 'mint']);
Route::get('/credentials/{wallet}', [CredentialController::class, 'walletCredentials']);