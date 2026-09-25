<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experiment;
use App\Models\ExperimentParameter;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ExperimentParameterController extends Controller
{
    public function store(Request $request, Experiment $experiment)
    {
        $data = $this->validated($request);
        $data['sort_order'] = $experiment->parameters()->max('sort_order') + 1;

        $experiment->parameters()->create($data);

        return back()->with('success', 'Parameter ditambahkan.');
    }

    public function update(Request $request, ExperimentParameter $parameter)
    {
        $parameter->update($this->validated($request));

        return back()->with('success', 'Parameter diperbarui.');
    }

    public function destroy(ExperimentParameter $parameter)
    {
        $parameter->delete();

        return back()->with('success', 'Parameter dihapus.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'symbol' => 'required|string|max:10',
            'label' => 'required|string|max:100',
            'unit' => 'required|string|max:20',
            'type' => ['required', Rule::in(['input', 'output'])],
            'min_value' => 'nullable|numeric',
            'max_value' => 'nullable|numeric|gte:min_value',
            'step' => 'nullable|numeric|min:0.0001',
            'default_value' => 'nullable|numeric',
        ]);
    }
}