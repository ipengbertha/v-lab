<?php

namespace App\Http\Controllers;

use App\Models\Attempt;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HistoryController extends Controller
{
    public function index()
    {
        $attempts = Attempt::with(['experiment:id,title,slug,category_id', 'experiment.category:id,name'])
            ->where('user_id', Auth::id())
            ->where('status', 'completed')
            ->latest('finished_at')
            ->get([
                'id', 'experiment_id', 'final_score', 'score_practice',
                'score_accuracy', 'score_quiz', 'score_conclusion', 'finished_at',
            ]);

        return Inertia::render('History/Index', [
            'attempts' => $attempts,
        ]);
    }

    public function show(Attempt $attempt)
    {
        abort_if($attempt->user_id !== Auth::id(), 403);
        abort_if($attempt->status !== 'completed', 404);

        $attempt->load([
            'experiment:id,title,slug,category_id',
            'experiment.category:id,name',
            'results' => fn ($q) => $q->orderBy('trial_number'),
            'answers.question.options',
            'answers.option',
        ]);

        return Inertia::render('History/Show', [
            'attempt' => $attempt,
        ]);
    }
}