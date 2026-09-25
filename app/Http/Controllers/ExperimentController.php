<?php

namespace App\Http\Controllers;

use App\Models\Experiment;
use App\Services\CalculationEngine;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExperimentController extends Controller
{
    public function index()
    {
        return Inertia::render('Experiments/Index', [
            'experiments' => Experiment::with('category:id,name')
                ->where('is_active', true)
                ->latest()
                ->get(),
        ]);
    }

    public function show(Experiment $experiment)
    {
        abort_unless($experiment->is_active, 404);

        return Inertia::render('Experiments/Show', [
            'experiment' => $experiment->load(['category:id,name', 'materials', 'parameters']),
        ]);
    }

    public function simulate(Request $request, Experiment $experiment, CalculationEngine $engine)
    {
        abort_unless($experiment->is_active, 404);

        $inputs = $request->validate(['inputs' => 'required|array'])['inputs'];

        $outputs = $engine->calculate($experiment->formula_key, $inputs);

        return response()->json(['outputs' => $outputs]);
    }
}