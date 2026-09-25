import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

function scoreColor(score) {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-indigo-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
}

function barColor(score) {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-indigo-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
}

function ScoreBar({ label, weight, score }) {
    return (
        <div>
            <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-600">{label} <span className="text-gray-400">({weight}%)</span></span>
                <span className="font-medium">{score}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
                <div className={`h-2 rounded-full ${barColor(score)}`} style={{ width: `${score}%` }} />
            </div>
        </div>
    );
}

export default function Show({ attempt }) {
    const e = attempt.experiment;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">{e.title}</h2>
                    <Link href={route('history.index')} className="text-sm text-gray-500">
                        &larr; Riwayat
                    </Link>
                </div>
            }
        >
            <Head title={`Riwayat - ${e.title}`} />
            <div className="py-12">
                <div className="mx-auto max-w-3xl space-y-6 sm:px-6 lg:px-8">

                    <div className="rounded-lg bg-white p-6 text-center shadow-sm">
                        <p className="text-sm text-gray-500">Diselesaikan {formatDate(attempt.finished_at)}</p>
                        <div className={`mt-2 text-5xl font-bold ${scoreColor(attempt.final_score)}`}>
                            {attempt.final_score}
                        </div>
                        <p className="text-sm text-gray-400">Nilai Akhir</p>
                    </div>

                    <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
                        <h3 className="font-semibold">Rincian Nilai</h3>
                        <ScoreBar label="Praktikum" weight={30} score={attempt.score_practice} />
                        <ScoreBar label="Akurasi" weight={25} score={attempt.score_accuracy} />
                        <ScoreBar label="Kuis" weight={30} score={attempt.score_quiz} />
                        <ScoreBar label="Kesimpulan" weight={15} score={attempt.score_conclusion} />
                    </div>

                    {attempt.results.length > 0 && (
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold">Data Percobaan</h3>
                            <table className="w-full text-left text-sm">
                                <thead className="text-gray-500">
                                    <tr>
                                        <th className="pb-2">#</th>
                                        {Object.keys(attempt.results[0].inputs).map((k) => (
                                            <th key={k} className="pb-2">{k}</th>
                                        ))}
                                        {Object.keys(attempt.results[0].outputs).map((k) => (
                                            <th key={k} className="pb-2">{k}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {attempt.results.map((r) => (
                                        <tr key={r.id} className="border-t">
                                            <td className="py-2">{r.trial_number}</td>
                                            {Object.values(r.inputs).map((v, i) => (
                                                <td key={i} className="py-2">{v}</td>
                                            ))}
                                            {Object.values(r.outputs).map((v, i) => (
                                                <td key={i} className="py-2">{v}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {attempt.answers.length > 0 && (
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold">Review Kuis</h3>
                            <div className="space-y-4">
                                {attempt.answers.map((ans, i) => {
                                    const correctOption = ans.question.options.find((o) => o.is_correct);
                                    return (
                                        <div key={ans.id} className="rounded border p-3">
                                            <p className="mb-2 font-medium">{i + 1}. {ans.question.question_text}</p>
                                            <p className={ans.is_correct ? 'text-sm text-green-700' : 'text-sm text-red-700'}>
                                                Jawabanmu: {ans.option?.option_text} {ans.is_correct ? '✓ Benar' : '✗ Salah'}
                                            </p>
                                            {!ans.is_correct && correctOption && (
                                                <p className="text-sm text-green-700">
                                                    Jawaban benar: {correctOption.option_text}
                                                </p>
                                            )}
                                            {ans.question.explanation && (
                                                <p className="mt-1 text-sm text-gray-500">{ans.question.explanation}</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {attempt.conclusion && (
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-2 font-semibold">Kesimpulan</h3>
                            <p className="whitespace-pre-wrap text-sm text-gray-600">{attempt.conclusion}</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}