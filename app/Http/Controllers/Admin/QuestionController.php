<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experiment;
use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function store(Request $request, Experiment $experiment)
    {
        $data = $this->validated($request);

        $question = $experiment->questions()->create([
            'question_text' => $data['question_text'],
            'explanation' => $data['explanation'] ?? null,
        ]);

        foreach ($data['options'] as $i => $opt) {
            $question->options()->create([
                'option_text' => $opt['option_text'],
                'is_correct' => $i === (int) $data['correct_index'],
            ]);
        }

        return back()->with('success', 'Soal ditambahkan.');
    }

    public function update(Request $request, Question $question)
    {
        $data = $this->validated($request);

        $question->update([
            'question_text' => $data['question_text'],
            'explanation' => $data['explanation'] ?? null,
        ]);

        $options = $question->options()->orderBy('id')->get();
        foreach ($data['options'] as $i => $opt) {
            $options[$i]->update([
                'option_text' => $opt['option_text'],
                'is_correct' => $i === (int) $data['correct_index'],
            ]);
        }

        return back()->with('success', 'Soal diperbarui.');
    }

    public function destroy(Question $question)
    {
        $question->delete();

        return back()->with('success', 'Soal dihapus.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'question_text' => 'required|string',
            'explanation' => 'nullable|string',
            'options' => 'required|array|size:4',
            'options.*.option_text' => 'required|string|max:255',
            'correct_index' => 'required|integer|min:0|max:3',
        ]);
    }
}