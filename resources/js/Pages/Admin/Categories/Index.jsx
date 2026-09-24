import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ categories }) {
    const { flash } = usePage().props;
    const [editing, setEditing] = useState(null);

    const form = useForm({ name: '', description: '' });

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
            form.put(route('admin.categories.update', editing.id), options);
        } else {
            form.post(route('admin.categories.store'), options);
        }
    };

    const startEdit = (c) => {
        setEditing(c);
        form.setData({ name: c.name, description: c.description ?? '' });
    };

    const cancelEdit = () => {
        setEditing(null);
        form.reset();
        form.clearErrors();
    };

    const remove = (c) => {
        if (confirm(`Hapus kategori "${c.name}"? Eksperimen di dalamnya ikut terhapus.`)) {
            router.delete(route('admin.categories.destroy', c.id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Kategori</h2>}
        >
            <Head title="Kategori" />
            <div className="py-12">
                <div className="mx-auto max-w-4xl space-y-6 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="rounded bg-green-100 p-3 text-green-800">
                            {flash.success}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-3 bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="font-semibold">
                            {editing ? 'Edit Kategori' : 'Tambah Kategori'}
                        </h3>
                        <div>
                            <input
                                type="text"
                                placeholder="Nama kategori"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                className="w-full rounded border-gray-300"
                            />
                            {form.errors.name && (
                                <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>
                            )}
                        </div>
                        <div>
                            <textarea
                                placeholder="Deskripsi (opsional)"
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                className="w-full rounded border-gray-300"
                                rows={2}
                            />
                            {form.errors.description && (
                                <p className="mt-1 text-sm text-red-600">{form.errors.description}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="rounded bg-gray-800 px-4 py-2 text-white disabled:opacity-50"
                            >
                                {editing ? 'Simpan' : 'Tambah'}
                            </button>
                            {editing && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="rounded border px-4 py-2"
                                >
                                    Batal
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-sm text-gray-600">
                                <tr>
                                    <th className="p-3">Nama</th>
                                    <th className="p-3">Slug</th>
                                    <th className="p-3">Eksperimen</th>
                                    <th className="p-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-4 text-center text-gray-500">
                                            Belum ada kategori.
                                        </td>
                                    </tr>
                                )}
                                {categories.map((c) => (
                                    <tr key={c.id} className="border-t">
                                        <td className="p-3">{c.name}</td>
                                        <td className="p-3 text-gray-500">{c.slug}</td>
                                        <td className="p-3">{c.experiments_count}</td>
                                        <td className="space-x-3 p-3 text-right">
                                            <button onClick={() => startEdit(c)} className="text-blue-600">
                                                Edit
                                            </button>
                                            <button onClick={() => remove(c)} className="text-red-600">
                                                Hapus
                                            </button>
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