<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QuizSession;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;

class QuizController extends Controller
{
    public function generate(Request $req)
    {
        $req->validate([
            'wallet' => 'required|string',
            'topic'  => 'required|string',
            // either content or pdfContent should be provided
            'content' => 'nullable|string',
            'pdfContent' => 'nullable|string'
        ]);

        $contentPrompt = $req->content ?? $req->pdfContent ?? "Generate 5 questions on {$req->topic}";

        // Call AI API (existing)
        $response = Http::withToken(env('GROQ_API_KEY'))
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => env('AI_MODEL', 'llama-3.3-70b-versatile'),
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Generate 5 difficult multiple choice questions on the topic. Return ONLY a JSON array of objects: {"question": "...", "options": ["..", "..", "..", ".."], "answer_index": 0 }.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $contentPrompt
                    ]
                ]
            ]);

        if (!$response->successful()) {
            return response()->json(['success' => false, 'error' => 'Failed to call AI API', 'details' => $response->body()], 500);
        }

        $content = $response['choices'][0]['message']['content'] ?? $response->body();
        $quiz = json_decode($content, true);

        if ($quiz === null || !is_array($quiz)) {
            return response()->json(['success' => false, 'error' => 'Invalid JSON from AI', 'content' => $content], 500);
        }

        // Save session
        $session = QuizSession::create([
            'wallet_address' => $req->wallet,
            'topic' => $req->topic,
            'quiz_json' => $quiz,
            'status' => 'pending',
            'score' => 0,
        ]);

        // Map backend quiz into frontend Quiz type
        $questions = [];
        foreach ($quiz as $i => $q) {
            $questions[] = [
                'id' => 'q'.($i+1),
                'question' => $q['question'] ?? '',
                'options' => $q['options'] ?? [],
                'correctAnswer' => isset($q['answer_index']) ? (int)$q['answer_index'] : null
            ];
        }

        $quizPayload = [
            'id' => (string)$session->id,
            'title' => "{$req->topic} Quiz",
            'topic' => $req->topic,
            'description' => "AI-generated quiz on {$req->topic}",
            'questions' => $questions,
            'timeLimit' => (int)env('QUIZ_TIME_LIMIT', 600),
            'passingScore' => (int)env('QUIZ_PASSING_SCORE', 80)
        ];

        return response()->json(['success' => true, 'data' => $quizPayload]);
    }

    public function submit(Request $req)
    {
        // Accept both quizId and session_id for safety
        $req->validate([
            'quizId' => 'nullable|integer',
            'session_id' => 'nullable|integer',
            'answers' => 'required|array',
            'walletAddress' => 'nullable|string',
            'timeTaken' => 'nullable|integer'
        ]);

        $sessionId = $req->quizId ?? $req->session_id;
        if (!$sessionId) {
            return response()->json(['success' => false, 'error' => 'quizId or session_id required'], 400);
        }

        $session = QuizSession::findOrFail($sessionId);
        $quiz = $session->quiz_json;

        $correct = 0;
        foreach ($quiz as $index => $q) {
            if (isset($req->answers[$index]) && isset($q['answer_index']) && $req->answers[$index] == $q['answer_index']) {
                $correct++;
            }
        }

        $total = count($quiz);
        $percentage = $total > 0 ? round(($correct / $total) * 100) : 0;
        $pass = $percentage >= (int)env('QUIZ_PASSING_SCORE', 80);

        $session->score = $percentage;
        $session->status = $pass ? 'passed' : 'failed';

        if ($pass && empty($session->mint_token)) {
            $session->mint_token = Str::uuid();
        }

        $session->save();

        $result = [
            'quizId' => (string)$session->id,
            'score' => $percentage,
            'totalQuestions' => $total,
            'percentage' => $percentage,
            'passed' => $pass,
            'answers' => $req->answers,
            'completedAt' => now()->toIso8601String(),
            'mintToken' => $session->mint_token ?? null
        ];

        return response()->json(['success' => true, 'data' => $result]);
    }
}
