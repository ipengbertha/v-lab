<?php

namespace App\Http\Controllers;

use App\Models\Attempt;
use App\Models\Experiment;
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

        // Hitung ulang di server, jangan percaya angka dari client
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

    public function finish(Attempt $attempt)
    {
        abort_if($attempt->user_id !== Auth::id(), 403);

        $count = $attempt->results()->count();
        if ($count < self::MIN_TRIALS) {
            return response()->json([
                'message' => 'Minimal ' . self::MIN_TRIALS . ' percobaan diperlukan. Baru ada ' . $count . '.',
            ], 422);
        }

        $attempt->update([
            'status' => 'completed',
            'finished_at' => now(),
        ]);

        return response()->json([
            'message' => 'Praktikum selesai! Fitur soal akan hadir di tahap berikutnya.',
        ]);
    }
}