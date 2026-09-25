import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ experiment }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {experiment.title}
                    </h2>
                    <Link href={route('admin.experiments.index')} className="text-sm text-gray-500">
                        &larr; Kembali ke daftar
                    </Link>
                </div>
            }
        >
            <Head title={experiment.title} />
            <div className="py-12">
                <div className="mx-auto max-w-5xl space-y-8 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="rounded bg-green-100 p-3 text-green-800">{flash.success}</div>
                    )}

                    <ParametersPanel experiment={experiment} />
                    <DescriptionPanel experiment={experiment} />
                    <QuestionsPanel experiment={experiment} />
                    <MaterialsPanel experiment={experiment} />
                </div>
            </div>  
        </AuthenticatedLayout>
    );
}

function emptyQuestionForm() {
    return {
        question_text: '',
        explanation: '',
        options: [
            { option_text: '' },
            { option_text: '' },
            { option_text: '' },
            { option_text: '' },
        ],
        correct_index: 0,
    };
}

function QuestionsPanel({ experiment }) {
    const [editing, setEditing] = useState(null);
    const form = useForm(emptyQuestionForm());

    const submit = (e) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => { form.reset(); form.setData(emptyQuestionForm()); setEditing(null); },
        };
        if (editing) {
            form.put(route('admin.questions.update', editing.id), options);
        } else {
            form.post(route('admin.questions.store', experiment.id), options);
        }
    };

    const startEdit = (q) => {
        setEditing(q);
        form.setData({
            question_text: q.question_text,
            explanation: q.explanation ?? '',
            options: q.options.map((o) => ({ option_text: o.option_text })),
            correct_index: q.options.findIndex((o) => o.is_correct),
        });
    };

    const cancelEdit = () => { setEditing(null); form.reset(); form.setData(emptyQuestionForm()); form.clearErrors(); };

    const remove = (q) => {
        if (confirm('Hapus soal ini?')) {
            router.delete(route('admin.questions.destroy', q.id), { preserveScroll: true });
        }
    };

    const setOptionText = (i, text) => {
        const options = [...form.data.options];
        options[i] = { ...options[i], option_text: text };
        form.setData('options', options);
    };

    const labels = ['A', 'B', 'C', 'D'];

    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
            <h3 className="mb-4 font-semibold">Soal Kuis</h3>

            <div className="mb-6 space-y-3">
                {experiment.questions.length === 0 && (
                    <p className="text-sm text-gray-400">Belum ada soal.</p>
                )}
                {experiment.questions.map((q) => (
                    <div key={q.id} className="rounded border p-3">
                        <div className="flex items-start justify-between gap-4">
                            <p className="font-medium">{q.question_text}</p>
                            <div className="shrink-0 space-x-2 text-sm">
                                <button onClick={() => startEdit(q)} className="text-blue-600">Edit</button>
                                <button onClick={() => remove(q)} className="text-red-600">Hapus</button>
                            </div>
                        </div>
                        <ul className="mt-2 space-y-1 text-sm">
                            {q.options.map((o, i) => (
                                <li key={o.id} className={o.is_correct ? 'font-semibold text-green-700' : 'text-gray-600'}>
                                    {labels[i]}. {o.option_text} {o.is_correct && '✓'}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <form onSubmit={submit} className="space-y-3">
                <div>
                    <textarea
                        placeholder="Pertanyaan"
                        value={form.data.question_text}
                        onChange={(e) => form.setData('question_text', e.target.value)}
                        rows={2}
                        className="w-full rounded border-gray-300 text-sm"
                    />
                    {form.errors.question_text && <p className="text-xs text-red-600">{form.errors.question_text}</p>}
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                    {form.data.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="correct_index"
                                checked={form.data.correct_index === i}
                                onChange={() => form.setData('correct_index', i)}
                            />
                            <input
                                placeholder={`Opsi ${labels[i]}`}
                                value={opt.option_text}
                                onChange={(e) => setOptionText(i, e.target.value)}
                                className="w-full rounded border-gray-300 text-sm"
                            />
                        </div>
                    ))}
                </div>
                {form.errors['options.0.option_text'] && (
                    <p className="text-xs text-red-600">Semua 4 opsi wajib diisi.</p>
                )}

                <textarea
                    placeholder="Penjelasan jawaban (opsional)"
                    value={form.data.explanation}
                    onChange={(e) => form.setData('explanation', e.target.value)}
                    rows={2}
                    className="w-full rounded border-gray-300 text-sm"
                />

                <div className="flex gap-2">
                    <button type="submit" disabled={form.processing}
                        className="rounded bg-gray-800 px-4 py-1.5 text-sm text-white disabled:opacity-50">
                        {editing ? 'Simpan' : 'Tambah Soal'}
                    </button>
                    {editing && (
                        <button type="button" onClick={cancelEdit} className="rounded border px-4 py-1.5 text-sm">
                            Batal
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

function DescriptionPanel({ experiment }) {
    const form = useForm({ description: experiment.description ?? '' });

    const submit = (e) => {
        e.preventDefault();
        form.put(route('admin.experiments.update', experiment.id), {
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
            <h3 className="mb-4 font-semibold">Deskripsi / Instruksi Praktikum</h3>
            <form onSubmit={submit} className="space-y-2">
                <textarea
                    placeholder="Tulis instruksi untuk mode praktikum, misalnya: Gunakan hambatan 6 Ω..."
                    value={form.data.description}
                    onChange={(e) => form.setData('description', e.target.value)}
                    rows={4}
                    className="w-full rounded border-gray-300 text-sm"
                />
                {form.errors.description && (
                    <p className="text-xs text-red-600">{form.errors.description}</p>
                )}
                <button
                    type="submit"
                    disabled={form.processing}
                    className="rounded bg-gray-800 px-4 py-1.5 text-sm text-white disabled:opacity-50"
                >
                    Simpan Deskripsi
                </button>
            </form>
        </div>
    );
}

function ParametersPanel({ experiment }) {
    const [editing, setEditing] = useState(null);
    const form = useForm({
        symbol: '', label: '', unit: '', type: 'input',
        min_value: '', max_value: '', step: '', default_value: '',
    });

    const submit = (e) => {
        e.preventDefault();
        const options = { preserveScroll: true, onSuccess: () => { form.reset(); setEditing(null); } };
        if (editing) {
            form.put(route('admin.parameters.update', editing.id), options);
        } else {
            form.post(route('admin.parameters.store', experiment.id), options);
        }
    };

    const startEdit = (p) => {
        setEditing(p);
        form.setData({
            symbol: p.symbol, label: p.label, unit: p.unit, type: p.type,
            min_value: p.min_value ?? '', max_value: p.max_value ?? '',
            step: p.step ?? '', default_value: p.default_value ?? '',
        });
    };

    const cancelEdit = () => { setEditing(null); form.reset(); form.clearErrors(); };

    const remove = (p) => {
        if (confirm(`Hapus parameter "${p.label}"?`)) {
            router.delete(route('admin.parameters.destroy', p.id), { preserveScroll: true });
        }
    };

    const Err = ({ name }) =>
        form.errors[name] ? <p className="mt-1 text-xs text-red-600">{form.errors[name]}</p> : null;

    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
            <h3 className="mb-4 font-semibold">Parameter</h3>

            <table className="mb-4 w-full text-left text-sm">
                <thead className="text-gray-500">
                    <tr>
                        <th className="pb-2">Simbol</th>
                        <th className="pb-2">Label</th>
                        <th className="pb-2">Satuan</th>
                        <th className="pb-2">Tipe</th>
                        <th className="pb-2">Min</th>
                        <th className="pb-2">Max</th>
                        <th className="pb-2">Step</th>
                        <th className="pb-2 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {experiment.parameters.length === 0 && (
                        <tr><td colSpan={8} className="py-3 text-center text-gray-400">Belum ada parameter.</td></tr>
                    )}
                    {experiment.parameters.map((p) => (
                        <tr key={p.id} className="border-t">
                            <td className="py-2 font-medium">{p.symbol}</td>
                            <td className="py-2">{p.label}</td>
                            <td className="py-2">{p.unit}</td>
                            <td className="py-2">{p.type}</td>
                            <td className="py-2">{p.min_value ?? '-'}</td>
                            <td className="py-2">{p.max_value ?? '-'}</td>
                            <td className="py-2">{p.step ?? '-'}</td>
                            <td className="space-x-2 py-2 text-right">
                                <button onClick={() => startEdit(p)} className="text-blue-600">Edit</button>
                                <button onClick={() => remove(p)} className="text-red-600">Hapus</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <form onSubmit={submit} className="grid gap-3 sm:grid-cols-4">
                <div>
                    <input placeholder="Simbol (V)" value={form.data.symbol}
                        onChange={(e) => form.setData('symbol', e.target.value)}
                        className="w-full rounded border-gray-300 text-sm" />
                    <Err name="symbol" />
                </div>
                <div>
                    <input placeholder="Label (Tegangan)" value={form.data.label}
                        onChange={(e) => form.setData('label', e.target.value)}
                        className="w-full rounded border-gray-300 text-sm" />
                    <Err name="label" />
                </div>
                <div>
                    <input placeholder="Satuan (V)" value={form.data.unit}
                        onChange={(e) => form.setData('unit', e.target.value)}
                        className="w-full rounded border-gray-300 text-sm" />
                    <Err name="unit" />
                </div>
                <div>
                    <select value={form.data.type} onChange={(e) => form.setData('type', e.target.value)}
                        className="w-full rounded border-gray-300 text-sm">
                        <option value="input">input</option>
                        <option value="output">output</option>
                    </select>
                </div>
                <div>
                    <input type="number" step="any" placeholder="Min" value={form.data.min_value}
                        onChange={(e) => form.setData('min_value', e.target.value)}
                        className="w-full rounded border-gray-300 text-sm" />
                </div>
                <div>
                    <input type="number" step="any" placeholder="Max" value={form.data.max_value}
                        onChange={(e) => form.setData('max_value', e.target.value)}
                        className="w-full rounded border-gray-300 text-sm" />
                    <Err name="max_value" />
                </div>
                <div>
                    <input type="number" step="any" placeholder="Step" value={form.data.step}
                        onChange={(e) => form.setData('step', e.target.value)}
                        className="w-full rounded border-gray-300 text-sm" />
                </div>
                <div>
                    <input type="number" step="any" placeholder="Default" value={form.data.default_value}
                        onChange={(e) => form.setData('default_value', e.target.value)}
                        className="w-full rounded border-gray-300 text-sm" />
                </div>
                <div className="col-span-4 flex gap-2">
                    <button type="submit" disabled={form.processing}
                        className="rounded bg-gray-800 px-4 py-1.5 text-sm text-white disabled:opacity-50">
                        {editing ? 'Simpan' : 'Tambah Parameter'}
                    </button>
                    {editing && (
                        <button type="button" onClick={cancelEdit} className="rounded border px-4 py-1.5 text-sm">
                            Batal
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

function MaterialsPanel({ experiment }) {
    const [editing, setEditing] = useState(null);
    const form = useForm({ title: '', content: '' });

    const submit = (e) => {
        e.preventDefault();
        const options = { preserveScroll: true, onSuccess: () => { form.reset(); setEditing(null); } };
        if (editing) {
            form.put(route('admin.materials.update', editing.id), options);
        } else {
            form.post(route('admin.materials.store', experiment.id), options);
        }
    };

    const startEdit = (m) => {
        setEditing(m);
        form.setData({ title: m.title, content: m.content });
    };

    const cancelEdit = () => { setEditing(null); form.reset(); form.clearErrors(); };

    const remove = (m) => {
        if (confirm(`Hapus materi "${m.title}"?`)) {
            router.delete(route('admin.materials.destroy', m.id), { preserveScroll: true });
        }
    };

    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
            <h3 className="mb-4 font-semibold">Materi</h3>

            <div className="mb-4 space-y-2">
                {experiment.materials.length === 0 && (
                    <p className="text-sm text-gray-400">Belum ada materi.</p>
                )}
                {experiment.materials.map((m) => (
                    <div key={m.id} className="rounded border p-3">
                        <div className="flex items-start justify-between">
                            <h4 className="font-medium">{m.title}</h4>
                            <div className="space-x-2 text-sm">
                                <button onClick={() => startEdit(m)} className="text-blue-600">Edit</button>
                                <button onClick={() => remove(m)} className="text-red-600">Hapus</button>
                            </div>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">{m.content}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={submit} className="space-y-2">
                <input
                    placeholder="Judul materi"
                    value={form.data.title}
                    onChange={(e) => form.setData('title', e.target.value)}
                    className="w-full rounded border-gray-300 text-sm"
                />
                {form.errors.title && <p className="text-xs text-red-600">{form.errors.title}</p>}
                <textarea
                    placeholder="Isi materi"
                    value={form.data.content}
                    onChange={(e) => form.setData('content', e.target.value)}
                    rows={4}
                    className="w-full rounded border-gray-300 text-sm"
                />
                {form.errors.content && <p className="text-xs text-red-600">{form.errors.content}</p>}
                <div className="flex gap-2">
                    <button type="submit" disabled={form.processing}
                        className="rounded bg-gray-800 px-4 py-1.5 text-sm text-white disabled:opacity-50">
                        {editing ? 'Simpan' : 'Tambah Materi'}
                    </button>
                    {editing && (
                        <button type="button" onClick={cancelEdit} className="rounded border px-4 py-1.5 text-sm">
                            Batal
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}