import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

const empty = {
    category_id: '',
    title: '',
    formula_key: 'ohm',
    difficulty: 'mudah',
    description: '',
    is_active: true,
};

export default function Index({ experiments, categories, formulas }) {
    const { flash } = usePage().props;
    const [editing, setEditing] = useState(null);
    const form = useForm(empty);

    const submit = (e) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setEditing(null);
            },
        };
        if (editing) {
            form.put(route('admin.experiments.update', editing.id), options);
        } else {
            form.post(route('admin.experiments.store'), options);
        }
    };

    const startEdit = (x) => {
        setEditing(x);
        form.setData({
            category_id: x.category_id,
            title: x.title,
            formula_key: x.formula_key,
            difficulty: x.difficulty,
            description: x.description ?? '',
            is_active: x.is_active,
        });
    };

    const cancelEdit = () => {
        setEditing(null);
        form.setData(empty);
        form.clearErrors();
    };

    const toggle = (x) =>
        router.patch(route('admin.experiments.toggle', x.id), {}, { preserveScroll: true });

    const remove = (x) => {
        if (confirm(`Hapus eksperimen "${x.title}"? Materi, soal, dan riwayat terkait ikut terhapus.`)) {
            router.delete(route('admin.experiments.destroy', x.id), { preserveScroll: true });
        }
    };

    const Err = ({ name }) =>
        form.errors[name] ? <p className="mt-1 text-sm text-red-600">{form.errors[name]}</p> : null;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Eksperimen</h2>}
        >
            <Head title="Eksperimen" />
            <div className="py-12">
                <div className="mx-auto max-w-5xl space-y-6 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="rounded bg-green-100 p-3 text-green-800">{flash.success}</div>
                    )}

                    <form onSubmit={submit} className="space-y-3 bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="font-semibold">
                            {editing ? 'Edit Eksperimen' : 'Tambah Eksperimen'}
                        </h3>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <select
                                    value={form.data.category_id}
                                    onChange={(e) => form.setData('category_id', e.target.value)}
                                    className="w-full rounded border-gray-300"
                                >
                                    <option value="">-- Pilih kategori --</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <Err name="category_id" />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Judul eksperimen"
                                    value={form.data.title}
                                    onChange={(e) => form.setData('title', e.target.value)}
                                    className="w-full rounded border-gray-300"
                                />
                                <Err name="title" />
                            </div>
                            <div>
                                <select
                                    value={form.data.formula_key}
                                    onChange={(e) => form.setData('formula_key', e.target.value)}
                                    className="w-full rounded border-gray-300"
                                >
                                    {formulas.map((f) => (
                                        <option key={f} value={f}>Rumus: {f}</option>
                                    ))}
                                </select>
                                <Err name="formula_key" />
                            </div>
                            <div>
                                <select
                                    value={form.data.difficulty}
                                    onChange={(e) => form.setData('difficulty', e.target.value)}
                                    className="w-full rounded border-gray-300"
                                >
                                    <option value="mudah">Mudah</option>
                                    <option value="sedang">Sedang</option>
                                    <option value="sulit">Sulit</option>
                                </select>
                                <Err name="difficulty" />
                            </div>
                        </div>

                        <div>
                            <textarea
                                placeholder="Deskripsi (opsional)"
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                className="w-full rounded border-gray-300"
                                rows={2}
                            />
                            <Err name="description" />
                        </div>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.data.is_active}
                                onChange={(e) => form.setData('is_active', e.target.checked)}
                                className="rounded border-gray-300"
                            />
                            Aktif (tampil untuk user)
                        </label>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="rounded bg-gray-800 px-4 py-2 text-white disabled:opacity-50"
                            >
                                {editing ? 'Simpan' : 'Tambah'}
                            </button>
                            {editing && (
                                <button type="button" onClick={cancelEdit} className="rounded border px-4 py-2">
                                    Batal
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="overflow-x-auto bg-white shadow-sm sm:rounded-lg">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-sm text-gray-600">
                                <tr>
                                    <th className="p-3">Judul</th>
                                    <th className="p-3">Kategori</th>
                                    <th className="p-3">Rumus</th>
                                    <th className="p-3">Level</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {experiments.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-gray-500">
                                            Belum ada eksperimen.
                                        </td>
                                    </tr>
                                )}
                                {experiments.map((x) => (
                                    <tr key={x.id} className="border-t">
                                        <td className="p-3">{x.title}</td>
                                        <td className="p-3">{x.category?.name}</td>
                                        <td className="p-3 text-gray-500">{x.formula_key}</td>
                                        <td className="p-3 capitalize">{x.difficulty}</td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => toggle(x)}
                                                className={
                                                    'rounded px-2 py-1 text-xs ' +
                                                    (x.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-200 text-gray-600')
                                                }
                                            >
                                                {x.is_active ? 'Aktif' : 'Nonaktif'}
                                            </button>
                                        </td>
                                        <td className="space-x-3 p-3 text-right">
                                            <button onClick={() => startEdit(x)} className="text-blue-600">Edit</button>
                                            <button onClick={() => remove(x)} className="text-red-600">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}