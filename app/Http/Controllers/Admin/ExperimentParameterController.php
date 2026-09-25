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
            'category_id' => 'sometimes|required|exists:categories,id',
            'title'       => 'sometimes|required|string|max:150',
            'formula_key' => ['sometimes', 'required', Rule::in(self::FORMULAS)],
            'difficulty'  => ['sometimes', 'required', Rule::in(['mudah', 'sedang', 'sulit'])],
            'description' => 'nullable|string|max:1000',
            'is_active'   => 'boolean',
        ]);
    }
}