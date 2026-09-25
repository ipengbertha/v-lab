import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

function scoreBadge(score) {
    if (score === null || score === undefined) return 'bg-gray-100 text-gray-500';
    if (score >= 85) return 'bg-green-100 text-green-700';
    if (score >= 70) return 'bg-indigo-100 text-indigo-700';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
}

export default function Index({ attempts }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Riwayat Praktikum</h2>}
        >
            <Head title="Riwayat Praktikum" />
            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    {attempts.length === 0 ? (
                        <div className="rounded-lg bg-white p-10 text-center shadow-sm">
                            <p className="text-gray-500">Belum ada riwayat praktikum.</p>
                            <Link
                                href={route('experiments.index')}
                                className="mt-4 inline-block rounded bg-indigo-600 px-4 py-2 text-sm text-white"
                            >
                                Mulai Eksperimen
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {attempts.map((a) => (
                                <Link
                                    key={a.id}
                                    href={route('history.show', a.id)}
                                    className="flex items-center justify-between rounded-lg bg-white p-5 shadow-sm transition hover:shadow-md"
                                >
                                    <div>
                                        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                                            {a.experiment.category?.name}
                                        </div>
                                        <h3 className="font-semibold text-gray-800">{a.experiment.title}</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Diselesaikan {formatDate(a.finished_at)}
                                        </p>
                                    </div>
                                    <div className={`rounded-full px-4 py-2 text-lg font-bold ${scoreBadge(a.final_score)}`}>
                                        {a.final_score}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}