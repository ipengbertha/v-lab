<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Experiment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ExperimentController extends Controller
{
    public const FORMULAS = ['ohm', 'series', 'parallel', 'power', 'energy'];

    public function index()
    {
        return Inertia::render('Admin/Experiments/Index', [
            'experiments' => Experiment::with('category:id,name')->latest()->get(),
            'categories'  => Category::orderBy('name')->get(['id', 'name']),
            'formulas'    => self::FORMULAS,
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = $this->uniqueSlug($data['title']);

        Experiment::create($data);

        return back()->with('success', 'Eksperimen ditambahkan.');
    }

    public function update(Request $request, Experiment $experiment)
    {
        $experiment->update($this->validated($request));

        return back()->with('success', 'Eksperimen diperbarui.');
    }

    public function toggle(Experiment $experiment)
    {
        $experiment->update(['is_active' => ! $experiment->is_active]);

        return back()->with('success', $experiment->is_active
            ? 'Eksperimen diaktifkan.'
            : 'Eksperimen dinonaktifkan.');
    }

    public function destroy(Experiment $experiment)
    {
        $experiment->delete();

        return back()->with('success', 'Eksperimen dihapus.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title'       => 'required|string|max:150',
            'formula_key' => ['required', Rule::in(self::FORMULAS)],
            'difficulty'  => ['required', Rule::in(['mudah', 'sedang', 'sulit'])],
            'description' => 'nullable|string|max:1000',
            'is_active'   => 'boolean',
        ]);
    }

    private function uniqueSlug(string $title): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i = 2;
        while (Experiment::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $i++;
        }
        return $slug;
    }
}