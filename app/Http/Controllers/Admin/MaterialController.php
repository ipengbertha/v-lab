<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experiment;
use App\Models\Material;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    public function store(Request $request, Experiment $experiment)
    {
        $data = $request->validate([
            'title' => 'required|string|max:150',
            'content' => 'required|string',
        ]);
        $data['sort_order'] = $experiment->materials()->max('sort_order') + 1;

        $experiment->materials()->create($data);

        return back()->with('success', 'Materi ditambahkan.');
    }

    public function update(Request $request, Material $material)
    {
        $material->update($request->validate([
            'title' => 'required|string|max:150',
            'content' => 'required|string',
        ]));

        return back()->with('success', 'Materi diperbarui.');
    }

    public function destroy(Material $material)
    {
        $material->delete();

        return back()->with('success', 'Materi dihapus.');
    }
}