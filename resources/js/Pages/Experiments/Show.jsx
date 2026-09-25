import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function Show({ experiment }) {
    const [tab, setTab] = useState('simulation'); // 'simulation' | 'practical'

    const inputParams = experiment.parameters.filter((p) => p.type === 'input');
    const outputParams = experiment.parameters.filter((p) => p.type === 'output');

    const initialValues = useMemo(() => {
        const v = {};
        inputParams.forEach((p) => {
            v[p.symbol] = p.default_value !== null ? Number(p.default_value) : 0;
        });
        return v;
    }, [experiment.id]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">{experiment.title}</h2>
                    <Link href={route('experiments.index')} className="text-sm text-gray-500">
                        &larr; Kembali
                    </Link>
                </div>
            }
        >
            <Head title={experiment.title} />
            <div className="py-12">
                <div className="mx-auto max-w-3xl space-y-6 sm:px-6 lg:px-8">

                    <div className="flex gap-2 border-b">
                        <button
                            onClick={() => setTab('simulation')}
                            className={
                                'px-4 py-2 text-sm font-medium ' +
                                (tab === 'simulation'
                                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                                    : 'text-gray-500')
                            }
                        >
                            Mode Simulasi
                        </button>
                        <button
                            onClick={() => setTab('practical')}
                            className={
                                'px-4 py-2 text-sm font-medium ' +
                                (tab === 'practical'
                                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                                    : 'text-gray-500')
                            }
                        >
                            Mode Praktikum
                        </button>
                    </div>

                    {tab === 'simulation' && (
                        <SimulationPanel
                            experiment={experiment}
                            inputParams={inputParams}
                            outputParams={outputParams}
                            initialValues={initialValues}
                        />
                    )}

                    {tab === 'practical' && (
                        <PracticalPanel
                            experiment={experiment}
                            inputParams={inputParams}
                            outputParams={outputParams}
                            initialValues={initialValues}
                        />
                    )}

                    {experiment.materials.length > 0 && (
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold">Materi</h3>
                            <div className="space-y-4">
                                {experiment.materials.map((m) => (
                                    <div key={m.id}>
                                        <h4 className="font-medium">{m.title}</h4>
                                        <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                                            {m.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function SliderInputs({ inputParams, values, onChange }) {
    return (
        <div className="space-y-5">
            {inputParams.map((p) => (
                <div key={p.id}>
                    <div className="mb-1 flex justify-between text-sm">
                        <label className="font-medium">{p.label}</label>
                        <span className="text-gray-600">
                            {values[p.symbol]} {p.unit}
                        </span>
                    </div>
                    <input
                        type="range"
                        min={p.min_value ?? 0}
                        max={p.max_value ?? 100}
                        step={p.step ?? 1}
                        value={values[p.symbol] ?? 0}
                        onChange={(e) => onChange(p.symbol, e.target.value)}
                        className="w-full accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>{p.min_value ?? 0}</span>
                        <span>{p.max_value ?? 100}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function OutputDisplay({ outputParams, outputs, loading }) {
    return (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {outputParams.map((p) => (
                <div key={p.id} className="rounded-lg bg-gray-800 p-4 text-center text-white">
                    <div className="text-xs uppercase text-gray-300">{p.label}</div>
                    <div className="mt-1 text-2xl font-bold">
                        {loading ? '...' : (outputs[p.symbol] ?? '-')}
                        <span className="ml-1 text-sm font-normal">{p.unit}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function SimulationPanel({ experiment, inputParams, outputParams, initialValues }) {
    const [values, setValues] = useState(initialValues);
    const [outputs, setOutputs] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const timer = setTimeout(() => {
            axios
                .post(route('experiments.simulate', experiment.slug), { inputs: values })
                .then((res) => setOutputs(res.data.outputs))
                .catch((err) => {
                    setError(err.response?.data?.message ?? 'Terjadi kesalahan.');
                    setOutputs({});
                })
                .finally(() => setLoading(false));
        }, 150);
        return () => clearTimeout(timer);
    }, [values, experiment.slug]);

    const handleChange = (symbol, value) => {
        setValues((prev) => ({ ...prev, [symbol]: Number(value) }));
    };

    return (
        <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-1 font-semibold">Simulator Bebas</h3>
            <p className="mb-4 text-sm text-gray-500">
                Coba ubah nilai sesukamu, lihat bagaimana hasilnya berubah.
            </p>

            {error && (
                <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>
            )}

            <OutputDisplay outputParams={outputParams} outputs={outputs} loading={loading} />
            <SliderInputs inputParams={inputParams} values={values} onChange={handleChange} />
        </div>
    );
}

function PracticalPanel({ experiment, inputParams, outputParams, initialValues }) {
    const [attempt, setAttempt] = useState(null);
    const [values, setValues] = useState(initialValues);
    const [previewOutputs, setPreviewOutputs] = useState({});
    const [results, setResults] = useState([]);
    const [canFinish, setCanFinish] = useState(false);
    const [status, setStatus] = useState('idle'); // idle | starting | ready
    const [stage, setStage] = useState('trials'); // trials | quiz | conclusion | done
    const [error, setError] = useState(null);
    const minTrials = 4;

    // kuis
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [quizResult, setQuizResult] = useState(null);

    // kesimpulan & hasil akhir
    const [conclusion, setConclusion] = useState('');
    const [finishResult, setFinishResult] = useState(null);

    const startAttempt = () => {
        setStatus('starting');
        setError(null);
        axios
            .post(route('attempts.store', experiment.slug))
            .then((res) => {
                setAttempt(res.data.attempt);
                setResults(res.data.results);
                setStatus('ready');
            })
            .catch(() => {
                setError('Gagal memulai praktikum. Coba lagi.');
                setStatus('idle');
            });
    };

    useEffect(() => {
        if (status !== 'ready' || stage !== 'trials') return;
        const timer = setTimeout(() => {
            axios
                .post(route('experiments.simulate', experiment.slug), { inputs: values })
                .then((res) => setPreviewOutputs(res.data.outputs))
                .catch(() => setPreviewOutputs({}));
        }, 150);
        return () => clearTimeout(timer);
    }, [values, status, stage]);

    const handleChange = (symbol, value) => {
        setValues((prev) => ({ ...prev, [symbol]: Number(value) }));
    };

    const recordTrial = () => {
        setError(null);
        axios
            .post(route('attempts.results.store', attempt.id), { inputs: values })
            .then((res) => {
                setResults(res.data.results);
                setCanFinish(res.data.can_finish);
            })
            .catch((err) => {
                setError(err.response?.data?.message ?? 'Gagal mencatat percobaan.');
            });
    };

    const startQuiz = () => {
        setError(null);
        axios
            .get(route('attempts.quiz', attempt.id))
            .then((res) => {
                setQuestions(res.data.questions);
                setStage('quiz');
            })
            .catch(() => setError('Gagal memuat soal.'));
    };

    const selectAnswer = (questionId, optionId) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    };

    const submitQuizAnswers = () => {
        setError(null);
        if (Object.keys(answers).length < questions.length) {
            setError('Jawab semua soal terlebih dahulu.');
            return;
        }
        const payload = Object.entries(answers).map(([qid, oid]) => ({
            question_id: Number(qid),
            question_option_id: oid,
        }));
        axios
            .post(route('attempts.quiz.store', attempt.id), { answers: payload })
            .then((res) => {
                setQuizResult(res.data);
                setStage('conclusion');
            })
            .catch((err) => setError(err.response?.data?.message ?? 'Gagal mengirim jawaban.'));
    };

    const finishAttempt = () => {
        setError(null);
        if (conclusion.trim().length < 5) {
            setError('Tulis kesimpulan terlebih dahulu.');
            return;
        }
        axios
            .patch(route('attempts.finish', attempt.id), { conclusion })
            .then((res) => {
                setFinishResult(res.data);
                setStage('done');
            })
            .catch((err) => setError(err.response?.data?.message ?? 'Gagal menyelesaikan praktikum.'));
    };

    if (status === 'idle') {
        return (
            <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-1 font-semibold">Mode Praktikum</h3>
                <p className="mb-4 text-sm text-gray-600 whitespace-pre-wrap">
                    {experiment.description ?? 'Ikuti instruksi dari pengajar untuk eksperimen ini.'}
                </p>
                {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
                <button
                    onClick={startAttempt}
                    className="rounded bg-indigo-600 px-4 py-2 text-sm text-white"
                >
                    Mulai Praktikum
                </button>
            </div>
        );
    }

    if (status === 'starting') {
        return (
            <div className="rounded-lg bg-white p-6 text-sm text-gray-500 shadow-sm">
                Memulai praktikum...
            </div>
        );
    }

    if (stage === 'done') {
        const b = finishResult?.breakdown;
        return (
            <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-1 font-semibold">Praktikum Selesai</h3>
                <div className="mb-4 rounded bg-green-100 p-4 text-green-800">
                    Nilai Akhir: <span className="text-xl font-bold">{finishResult?.final_score}</span>
                </div>
                {b && (
                    <table className="w-full text-left text-sm">
                        <tbody>
                            <tr className="border-t"><td className="py-2">Praktikum (30%)</td><td className="py-2 text-right">{b.practice}</td></tr>
                            <tr className="border-t"><td className="py-2">Akurasi (25%)</td><td className="py-2 text-right">{b.accuracy}</td></tr>
                            <tr className="border-t"><td className="py-2">Kuis (30%)</td><td className="py-2 text-right">{b.quiz}</td></tr>
                            <tr className="border-t"><td className="py-2">Kesimpulan (15%)</td><td className="py-2 text-right">{b.conclusion}</td></tr>
                        </tbody>
                    </table>
                )}
            </div>
        );
    }

    if (stage === 'quiz') {
        return (
            <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold">Kuis</h3>
                {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}
                <div className="space-y-6">
                    {questions.map((q, qi) => (
                        <div key={q.id}>
                            <p className="mb-2 font-medium">{qi + 1}. {q.question_text}</p>
                            <div className="space-y-1">
                                {q.options.map((o) => (
                                    <label key={o.id} className="flex items-center gap-2 text-sm">
                                        <input
                                            type="radio"
                                            name={`q-${q.id}`}
                                            checked={answers[q.id] === o.id}
                                            onChange={() => selectAnswer(q.id, o.id)}
                                        />
                                        {o.option_text}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={submitQuizAnswers}
                    className="mt-6 rounded bg-indigo-600 px-4 py-2 text-sm text-white"
                >
                    Kirim Jawaban
                </button>
            </div>
        );
    }

    if (stage === 'conclusion') {
        return (
            <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-1 font-semibold">Kesimpulan</h3>
                {quizResult && (
                    <p className="mb-4 text-sm text-gray-500">
                        Kuis: {quizResult.correct}/{quizResult.total} jawaban benar.
                    </p>
                )}
                {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}
                <textarea
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    rows={5}
                    placeholder="Tulis kesimpulan dari praktikum ini..."
                    className="w-full rounded border-gray-300 text-sm"
                />
                <button
                    onClick={finishAttempt}
                    className="mt-4 rounded bg-green-600 px-4 py-2 text-sm text-white"
                >
                    Selesai
                </button>
            </div>
        );
    }

    // stage === 'trials'
    return (
        <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-1 font-semibold">Mode Praktikum</h3>
            <p className="mb-4 text-sm text-gray-600 whitespace-pre-wrap">
                {experiment.description}
            </p>

            {error && (
                <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>
            )}

            <OutputDisplay outputParams={outputParams} outputs={previewOutputs} loading={false} />
            <SliderInputs inputParams={inputParams} values={values} onChange={handleChange} />

            <div className="mt-4 flex items-center gap-3">
                <button
                    onClick={recordTrial}
                    className="rounded bg-gray-800 px-4 py-2 text-sm text-white"
                >
                    Catat Percobaan
                </button>
                <span className="text-sm text-gray-500">
                    {results.length}/{minTrials} percobaan tercatat
                </span>
            </div>

            {results.length > 0 && (
                <table className="mt-6 w-full text-left text-sm">
                    <thead className="text-gray-500">
                        <tr>
                            <th className="pb-2">#</th>
                            {inputParams.map((p) => (
                                <th key={p.id} className="pb-2">{p.label} ({p.unit})</th>
                            ))}
                            {outputParams.map((p) => (
                                <th key={p.id} className="pb-2">{p.label} ({p.unit})</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((r) => (
                            <tr key={r.id} className="border-t">
                                <td className="py-2">{r.trial_number}</td>
                                {inputParams.map((p) => (
                                    <td key={p.id} className="py-2">{r.inputs[p.symbol]}</td>
                                ))}
                                {outputParams.map((p) => (
                                    <td key={p.id} className="py-2">{r.outputs[p.symbol]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {canFinish && (
                <button
                    onClick={startQuiz}
                    className="mt-6 rounded bg-green-600 px-4 py-2 text-sm text-white"
                >
                    Lanjut ke Soal
                </button>
            )}
        </div>
    );
}