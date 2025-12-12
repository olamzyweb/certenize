<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QuizSession;
use Illuminate\Support\Str;
use Http;



    //
    class QuizController extends Controller
{
    public function generate(Request $req)
    {
        $req->validate([
            'wallet' => 'required|string',
            'topic'  => 'required|string',
            'content' => 'required|string'
        ]);

        // Call AI API
       $response = Http::withToken(env('GROQ_API_KEY'))
    ->post('https://api.groq.com/openai/v1/chat/completions', [ // Changed endpoint
        'model' => 'llama-3.3-70b-versatile', // Changed model
        'messages' => [
            [
                'role' => 'system',
                'content' => 'Generate 5 difficult multiple choice questions on the topic. Return ONLY a JSON array of 5 objects, each with keys: "question" (string), "options" (array of 4 strings), "answer_index" (integer 0-3).'
            ],
            [
                'role' => 'user',
                'content' => $req->content
            ]
        ]
    ]);

        if (!$response->successful()) {
            return response()->json(['error' => 'Failed to call AI API', 'details' => $response->body()], 500);
        }

        $content = $response['choices'][0]['message']['content'];
        $quiz = json_decode($content, true);

        if ($quiz === null) {
            return response()->json(['error' => 'Invalid JSON from AI', 'content' => $content], 500);
        }

        $session = QuizSession::create([
            'wallet_address' => $req->wallet,
            'topic' => $req->topic,
            'quiz_json' => $quiz,
            'status' => 'pending',
            'score' => 0,
        ]);

        return response()->json([
            'session_id' => $session->id,
            'quiz' => $quiz
        ]);
    }

    public function submit(Request $req)
    {
        $req->validate([
            'session_id' => 'required|integer',
            'answers' => 'required|array'
        ]);

        $session = QuizSession::findOrFail($req->session_id);
        $quiz = $session->quiz_json;

        $correct = 0;

        foreach ($quiz as $index => $q) {
            if (isset($req->answers[$index]) &&
                $req->answers[$index] == $q['answer_index']) {
                $correct++;
            }
        }

        $score = round(($correct / count($quiz)) * 100);
        $pass = $score >= 80;

        $session->score = $score;
        $session->status = $pass ? 'passed' : 'failed';

        if ($pass) {
            $session->mint_token = Str::uuid();
        }

        $session->save();

        return response()->json([
            'score' => $score,
            'passed' => $pass,
            'mint_token' => $session->mint_token
        ]);
    }
}

