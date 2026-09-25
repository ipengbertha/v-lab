<?php

namespace App\Http\Controllers;

use App\Models\Attempt;
use App\Models\Experiment;
use App\Models\QuestionOption;
use App\Services\CalculationEngine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttemptController extends Controller
{
    public const MIN_TRIALS = 4;

    public function store(Experiment $experiment)
    {
        abort_unless($experiment->is_active, 404);

        $attempt = Attempt::create([
            'user_id' => Auth::id(),
            'experiment_id' => $experiment->id,
            'mode' => 'practical',
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        return response()->json([
            'attempt' => $attempt,
            'results' => [],
            'min_trials' => self::MIN_TRIALS,
        ]);
    }

    public function storeResult(Request $request, Attempt $attempt, CalculationEngine $engine)
    {
        abort_if($attempt->user_id !== Auth::id(), 403);
        abort_if($attempt->status !== 'in_progress', 422, 'Percobaan sudah selesai.');

        $inputs = $request->validate(['inputs' => 'required|array'])['inputs'];
        $outputs = $engine->calculate($attempt->experiment->formula_key, $inputs);
        $trialNumber = $attempt->results()->max('trial_number') + 1;

        $attempt->results()->create([
            'trial_number' => $trialNumber,
            'inputs' => $inputs,
            'outputs' => $outputs,
        ]);

        $results = $attempt->results()->orderBy('trial_number')->get();

        return response()->json([
            'results' => $results,
            'can_finish' => $results->count() >= self::MIN_TRIALS,
        ]);
    }

    public function quiz(Attempt $attempt)
    {
        abort_if($attempt->user_id !== Auth::id(), 403);

        $questions = $attempt->experiment->questions()
            ->with(['options:id,question_id,option_text'])
            ->get(['id', 'experiment_id', 'question_text']);

        return response()->json(['questions' => $questions]);
    }

    public function submitQuiz(Request $request, Attempt $attempt)
    {
        abort_if($attempt->user_id !== Auth::id(), 403);
        abort_if($attempt->status !== 'in_progress', 422, 'Percobaan sudah selesai.');

        $data = $request->validate([
            'answers' => 'required|array|min:1',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.question_option_id' => 'required|exists:question_options,id',
        ]);

        $attempt->answers()->delete();

        $correct = 0;
        foreach ($data['answers'] as $ans) {
            $option = QuestionOption::find($ans['question_option_id']);
            $isCorrect = (bool) ($option?->is_correct);
            if ($isCorrect) {
                $correct++;
            }

            $attempt->answers()->create([
                'question_id' => $ans['question_id'],
                'question_option_id' => $ans['question_option_id'],
                'is_correct' => $isCorrect,
            ]);
        }

        $total = count($data['answers']);
        $scoreQuiz = $total > 0 ? (int) round($correct / $total * 100) : 0;

        $attempt->update(['score_quiz' => $scoreQuiz]);

        return response()->json([
            'score_quiz' => $scoreQuiz,
            'correct' => $correct,
            'total' => $total,
        ]);
    }

    public function finish(Request $request, Attempt $attempt)
    {
        abort_if($attempt->user_id !== Auth::id(), 403);

        $trialCount = $attempt->results()->count();
        if ($trialCount < self::MIN_TRIALS) {
            return response()->json([
                'message' => 'Minimal ' . self::MIN_TRIALS . ' percobaan diperlukan. Baru ada ' . $trialCount . '.',
            ], 422);
        }

        if (is_null($attempt->score_quiz)) {
            return response()->json(['message' => 'Selesaikan kuis terlebih dahulu.'], 422);
        }

        $data = $request->validate(['conclusion' => 'required|string|min:5']);

        $scorePractice = 100;
        $scoreAccuracy = 100;
        $scoreConclusion = strlen(trim($data['conclusion'])) >= 20 ? 100 : 50;

        $finalScore = (int) round(
            $scorePractice * 0.30
            + $scoreAccuracy * 0.25
            + $attempt->score_quiz * 0.30
            + $scoreConclusion * 0.15
        );

        $attempt->update([
            'status' => 'completed',
            'finished_at' => now(),
            'conclusion' => $data['conclusion'],
            'score_practice' => $scorePractice,
            'score_accuracy' => $scoreAccuracy,
            'score_conclusion' => $scoreConclusion,
            'final_score' => $finalScore,
        ]);

        return response()->json([
            'message' => 'Praktikum selesai!',
            'final_score' => $finalScore,
            'breakdown' => [
                'practice' => $scorePractice,
                'accuracy' => $scoreAccuracy,
                'quiz' => $attempt->score_quiz,
                'conclusion' => $scoreConclusion,
            ],
        ]);
    }
}