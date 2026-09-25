import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ experiments }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Eksperimen</h2>}
        >
            <Head title="Eksperimen" />
            <div className="py-12">
                <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 sm:px-6 lg:px-8">
                    {experiments.length === 0 && (
                        <p className="text-gray-500">Belum ada eksperimen tersedia.</p>
                    )}
                    {experiments.map((x) => (
                        <Link
                            key={x.id}
                            href={route('experiments.show', x.slug)}
                            className="block rounded-lg bg-white p-6 shadow-sm transition hover:shadow-md"
                        >
                            <span className="text-xs font-medium uppercase text-indigo-600">
                                {x.category?.name}
                            </span>
                            <h3 className="mt-1 text-lg font-semibold text-gray-800">{x.title}</h3>
                            <p className="mt-2 text-sm capitalize text-gray-500">
                                Level: {x.difficulty}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}