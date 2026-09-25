import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

const FEATURES = [
    { icon: '🔬', title: 'Eksperimen Virtual', desc: 'Lakukan percobaan secara digital tanpa memerlukan peralatan laboratorium fisik. Ubah variabel, lihat reaksinya secara langsung.' },
    { icon: '📚', title: 'Pelajari Materi', desc: 'Setiap eksperimen dilengkapi materi ringkas supaya kamu paham konsepnya sebelum praktik.' },
    { icon: '📊', title: 'Analisis Hasil', desc: 'Data dari setiap percobaan otomatis dicatat, ditampilkan dalam grafik, dan siap kamu analisis.' },
    { icon: '🧠', title: 'Uji Pemahaman', desc: 'Setelah praktikum, kerjakan kuis singkat untuk mengukur seberapa paham kamu terhadap materinya.' },
];

const EXPERIMENTS = [
    { icon: '⚡', title: 'Hukum Ohm', tag: 'Fisika • Kelistrikan', desc: 'Selidiki hubungan antara tegangan, arus, dan hambatan melalui rangkaian listrik virtual.' },
    { icon: '🔌', title: 'Rangkaian Seri & Paralel', tag: 'Fisika • Kelistrikan', desc: 'Pelajari karakteristik rangkaian seri dan paralel melalui simulasi interaktif.' },
    { icon: '🧪', title: 'Asam dan Basa', tag: 'Kimia • Larutan', desc: 'Amati perubahan indikator dan tentukan sifat suatu larutan melalui eksperimen virtual.' },
];

const STEPS = [
    { n: '01', t: 'Pilih', d: 'Pilih eksperimen yang ingin kamu lakukan dari daftar yang tersedia.' },
    { n: '02', t: 'Pelajari', d: 'Baca materi singkat dan pahami konsep dasarnya dulu.' },
    { n: '03', t: 'Eksperimen', d: 'Masuk ke simulator, ubah variabel, dan jalankan percobaannya.' },
    { n: '04', t: 'Analisis', d: 'Amati hasilnya, jawab pertanyaan, lalu buat kesimpulanmu sendiri.' },
];

const SUBJECTS = [
    { icon: '⚡', title: 'Fisika', desc: 'Kelistrikan, mekanika, gelombang, optik, kalor.', detail: 'Mulai dari Hukum Ohm sampai rangkaian seri-paralel — pahami kelistrikan lewat simulasi rangkaian yang bisa kamu utak-atik sendiri.' },
    { icon: '🧪', title: 'Kimia', desc: 'Larutan, asam-basa, reaksi kimia, konsentrasi.', detail: 'Coba reaksi dan perubahan indikator asam-basa secara virtual tanpa risiko bahan kimia sungguhan.' },
    { icon: '🧬', title: 'Biologi', desc: 'Sel, genetika, sistem organ, ekosistem.', detail: 'Jelajahi struktur sel dan sistem tubuh lewat visualisasi interaktif — segera hadir.' },
    { icon: '🌎', title: 'Ilmu Bumi', desc: 'Atmosfer, lingkungan, geologi, dan fenomena alam.', detail: 'Pahami fenomena alam dan proses geologi lewat simulasi berbasis data — segera hadir.' },
];

const FAQS = [
    { q: 'Apa itu V-Lab?', a: 'V-Lab adalah laboratorium virtual tempat kamu bisa melakukan eksperimen sains secara digital — mulai dari fisika, kimia, sampai biologi — tanpa perlu alat laboratorium fisik.' },
    { q: 'Apakah gratis digunakan?', a: 'Kamu bisa membuat akun dan mulai mencoba eksperimen yang tersedia. Ikuti materi, jalankan simulasi, dan kerjakan kuis penilaiannya langsung dari akunmu.' },
    { q: 'Apakah hasil eksperimen tersimpan?', a: 'Ya. Setiap percobaan yang kamu jalankan tercatat di riwayatmu, jadi kamu bisa membandingkan hasil dari beberapa kali percobaan.' },
    { q: 'Perangkat apa yang dibutuhkan?', a: 'Cukup browser di laptop, tablet, atau HP dengan koneksi internet. Tidak perlu instalasi aplikasi tambahan.' },
];

function SubjectTabs() {
    const [active, setActive] = useState(0);
    return (
        <div className="grid md:grid-cols-[220px_1fr] gap-6 mt-12">
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                {SUBJECTS.map((s, i) => (
                    <button
                        key={s.title}
                        onClick={() => setActive(i)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left whitespace-nowrap transition ${
                            active === i
                                ? 'bg-vlab-primary text-white'
                                : 'bg-white text-vlab-ink hover:bg-vlab-soft/40'
                        }`}
                    >
                        <span className="text-xl">{s.icon}</span>
                        <span className="font-display text-sm">{s.title}</span>
                    </button>
                ))}
            </div>
            <div className="bg-white rounded-2xl p-8 border border-vlab-ink/10">
                <span className="text-4xl">{SUBJECTS[active].icon}</span>
                <h3 className="font-display text-xl mt-4 text-vlab-primary">{SUBJECTS[active].title}</h3>
                <p className="mt-1 text-sm text-vlab-accent font-semibold">{SUBJECTS[active].desc}</p>
                <p className="mt-4 text-vlab-ink/70">{SUBJECTS[active].detail}</p>
                <a href="#" className="inline-block mt-5 text-sm font-semibold text-vlab-primary hover:text-vlab-accent transition">
                    Lihat Materi →
                </a>
            </div>
        </div>
    );
}

function FaqAccordion() {
    const [open, setOpen] = useState(0);
    return (
        <div className="grid md:grid-cols-2 gap-4 mt-12">
            {FAQS.map((f, i) => {
                const isOpen = open === i;
                return (
                    <div
                        key={f.q}
                        className={`rounded-[1.5rem] border-l-4 overflow-hidden transition-all h-fit ${
                            isOpen
                                ? 'bg-vlab-primary border-vlab-accent shadow-lg -rotate-1'
                                : `border-vlab-soft shadow-sm hover:-translate-y-0.5 ${
                                      i % 2 === 0 ? 'bg-white rotate-0' : 'bg-vlab-soft/25 rotate-0'
                                  }`
                        }`}
                    >
                        <button
                            onClick={() => setOpen(isOpen ? -1 : i)}
                            className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                        >
                            <span className={`font-display ${isOpen ? 'text-white' : 'text-vlab-primary'}`}>
                                {f.q}
                            </span>
                            <span
                                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg font-display transition-transform ${
                                    isOpen ? 'bg-vlab-accent text-white rotate-45' : 'bg-vlab-primary/10 text-vlab-primary'
                                }`}
                            >
                                +
                            </span>
                        </button>
                        {isOpen && (
                            <div className="px-6 pb-6 text-sm text-white/80 -mt-1">{f.a}</div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="V-Lab — Virtual Laboratory" />
            <div className="min-h-screen bg-vlab-bg text-vlab-ink font-sans overflow-x-hidden">

                {/* Navbar — floating pill, bukan full-width block */}
                <header className="sticky top-4 z-30 px-4">
                    <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3 rounded-full bg-vlab-primary text-white shadow-lg shadow-vlab-primary/20">
                        <span className="font-display text-lg tracking-wide">V-LAB</span>
                        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-white/80">
                            <a href="#apa-itu" className="hover:text-vlab-soft transition">Beranda</a>
                            <a href="#eksperimen" className="hover:text-vlab-soft transition">Eksperimen</a>
                            <a href="#materi" className="hover:text-vlab-soft transition">Materi</a>
                            <a href="#faq" className="hover:text-vlab-soft transition">FAQ</a>
                        </div>
                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-4 py-2 rounded-full bg-vlab-accent text-white text-sm font-semibold hover:brightness-110 transition"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="hidden sm:inline text-sm font-medium text-white/80 hover:text-white transition">
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 rounded-full bg-vlab-accent text-white text-sm font-semibold hover:brightness-110 transition"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero */}
                <section className="relative overflow-hidden">
                    {/* blob organik, bukan lingkaran polos */}
                    <div
                        className="pointer-events-none absolute -top-16 -left-20 w-96 h-96 bg-vlab-soft/60 blur-3xl"
                        style={{ borderRadius: '58% 42% 65% 35% / 45% 55% 45% 55%' }}
                    ></div>
                    <div
                        className="pointer-events-none absolute top-16 -right-24 w-[26rem] h-[26rem] bg-vlab-accent/25 blur-3xl"
                        style={{ borderRadius: '42% 58% 35% 65% / 55% 45% 55% 45%' }}
                    ></div>

                    {/* foto alat lab, background dekoratif transparan */}
                    <img
                        src="/images/lab-glassware.png"
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-luminosity"
                    />

                    <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-24 md:pt-20 md:pb-32 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vlab-primary text-white text-sm -rotate-2 shadow-md">
                                🔬 Laboratorium Virtual untuk Pembelajaran
                            </span>
                            <h1 className="font-display text-4xl md:text-5xl leading-tight mt-6 text-vlab-primary">
                                Belajar. Bereksperimen.{' '}
                                <span className="text-vlab-accent inline-block -rotate-1">Menemukan.</span>
                            </h1>
                            <p className="mt-5 text-vlab-ink/70 text-lg max-w-md">
                                V-Lab adalah laboratorium sains virtual: kamu pilih eksperimen, pelajari
                                konsepnya, lalu jalankan simulasinya sendiri dan lihat hasilnya secara langsung.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link
                                    href={route('register')}
                                    className="px-6 py-3 rounded-full bg-vlab-accent text-white font-semibold hover:-rotate-1 hover:scale-105 transition shadow-lg shadow-vlab-accent/30"
                                >
                                    Mulai Eksperimen →
                                </Link>
                                <a
                                    href="#apa-itu"
                                    className="px-6 py-3 rounded-full border-2 border-vlab-primary text-vlab-primary font-semibold hover:bg-vlab-primary hover:text-white hover:rotate-1 transition"
                                >
                                    Pelajari Lebih Lanjut
                                </a>
                            </div>
                        </div>

                        <div className="relative">
                            {/* sticker mengambang di sudut, overlap keluar kartu */}
                            <div className="absolute -top-5 -right-5 z-10 bg-vlab-accent text-white text-xs font-display px-3 py-2 rounded-2xl rotate-6 shadow-lg">
                                ⚡ Real-time
                            </div>
                            <div className="relative bg-white rounded-[2rem] border border-vlab-ink/10 shadow-xl p-8 flex flex-col items-center justify-center rotate-1 hover:rotate-0 transition">
                                <svg viewBox="0 0 400 180" className="w-full max-w-sm">
                                    <path d="M40 90 H120 M280 90 H360 M360 90 V150 H40 V90" fill="none" stroke="#023436" strokeWidth="3"></path>
                                    <g transform="translate(20,70)">
                                        <rect x="0" y="0" width="10" height="40" fill="#023436"></rect>
                                        <rect x="14" y="8" width="6" height="24" fill="#023436"></rect>
                                    </g>
                                    <polyline
                                        points="120,90 135,70 150,110 165,70 180,110 195,70 210,90"
                                        fill="none" stroke="#023436" strokeWidth="3" strokeLinejoin="round"
                                    ></polyline>
                                    <circle cx="280" cy="90" r="26" fill="#F76F8E" fillOpacity="0.15" stroke="#F76F8E" strokeWidth="3"></circle>
                                    <path d="M270 80 L290 100 M290 80 L270 100" stroke="#F76F8E" strokeWidth="2"></path>
                                    <path d="M40 90 H120 M210 90 H280" fill="none" stroke="#F76F8E" strokeWidth="3" strokeDasharray="6 6">
                                        <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1s" repeatCount="indefinite"></animate>
                                    </path>
                                </svg>
                                <div className="mt-6 flex gap-6 font-display text-lg">
                                    <span className="text-vlab-primary">12 V</span>
                                    <span className="text-vlab-accent">2.00 A</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* wave divider, bukan garis lurus */}
                    <svg className="block w-full text-vlab-primary" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: '60px' }}>
                        <path fill="currentColor" d="M0,32 C240,80 480,0 720,24 C960,48 1200,72 1440,32 L1440,80 L0,80 Z"></path>
                    </svg>
                </section>

                {/* Apa itu V-Lab — penjelasan jelas */}
                <section id="apa-itu" className="bg-vlab-primary text-white">
                    <div className="max-w-6xl mx-auto px-6 py-20">
                        <div className="max-w-2xl">
                            <h2 className="font-display text-2xl md:text-3xl">Apa itu V-Lab?</h2>
                            <p className="mt-4 text-white/70">
                                V-Lab menggantikan peralatan laboratorium fisik dengan simulasi digital.
                                Kamu tetap melakukan eksperimen sungguhan — mengubah variabel, mengamati
                                reaksi, mencatat data — hanya saja semuanya terjadi di layar, kapan pun
                                dan di mana pun kamu berada.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-4 gap-6 mt-12">
                            {FEATURES.map((f, i) => (
                                <div
                                    key={f.title}
                                    className={`rounded-[1.5rem] bg-white/5 border border-white/10 p-6 hover:bg-white/10 hover:-translate-y-1 transition ${
                                        i % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1'
                                    }`}
                                >
                                    <span className="text-3xl">{f.icon}</span>
                                    <h3 className="font-display text-lg mt-4">{f.title}</h3>
                                    <p className="mt-2 text-sm text-white/60">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Jelajahi Eksperimen */}
                <section id="eksperimen" className="max-w-6xl mx-auto px-6 py-20">
                    <div className="text-center max-w-xl mx-auto">
                        <h2 className="font-display text-2xl md:text-3xl text-vlab-primary">Eksperimen yang Bisa Kamu Jelajahi</h2>
                        <p className="mt-3 text-vlab-ink/60">
                            Pilih eksperimen, pahami konsepnya, lakukan simulasi, dan temukan hasilnya sendiri.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                        {EXPERIMENTS.map((e, i) => (
                            <div
                                key={e.title}
                                className={`group rounded-[1.5rem] bg-white border border-vlab-ink/10 p-6 flex flex-col hover:border-vlab-accent hover:shadow-xl hover:-translate-y-1 transition ${
                                    i % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1'
                                }`}
                            >
                                <span className="text-3xl">{e.icon}</span>
                                <h3 className="font-display text-lg mt-4 text-vlab-primary">{e.title}</h3>
                                <span className="text-xs font-semibold text-vlab-accent mt-1">{e.tag}</span>
                                <p className="mt-3 text-sm text-vlab-ink/70 flex-1">{e.desc}</p>
                                <Link
                                    href={route('login')}
                                    className="mt-5 text-sm font-semibold text-vlab-primary group-hover:text-vlab-accent transition flex items-center gap-1"
                                >
                                    Mulai Eksperimen
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Cara Kerja */}
                <section className="bg-vlab-soft/30 border-y border-vlab-ink/5">
                    <div className="max-w-6xl mx-auto px-6 py-20">
                        <h2 className="font-display text-2xl md:text-3xl text-center text-vlab-primary">Bagaimana Cara Kerjanya?</h2>
                        <div className="grid md:grid-cols-4 gap-6 mt-12 relative">
                            {STEPS.map((s) => (
                                <div key={s.n} className="text-center relative z-10">
                                    <div className="w-14 h-14 mx-auto rounded-full bg-vlab-primary text-white flex items-center justify-center font-display">
                                        {s.n}
                                    </div>
                                    <h3 className="font-display mt-4 text-vlab-primary">{s.t}</h3>
                                    <p className="mt-1 text-sm text-vlab-ink/60">{s.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Materi Pembelajaran — interaktif tab */}
                <section id="materi" className="max-w-6xl mx-auto px-6 py-20">
                    <h2 className="font-display text-2xl md:text-3xl text-center text-vlab-primary">Materi Pembelajaran</h2>
                    <p className="mt-3 text-center text-vlab-ink/60">Klik salah satu bidang untuk lihat cakupannya.</p>
                    <SubjectTabs />
                </section>

                {/* Keunggulan */}
                <section className="relative overflow-hidden bg-vlab-primary text-white">
                    {/* wave transisi masuk */}
                    <svg className="block w-full text-vlab-soft/30 rotate-180" viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: '50px' }}>
                        <path fill="currentColor" d="M0,20 C240,60 480,0 720,18 C960,36 1200,54 1440,20 L1440,0 L0,0 Z"></path>
                    </svg>

                    {/* blob dekorasi, biar background nggak flat */}
                    <div
                        className="pointer-events-none absolute top-10 -left-20 w-80 h-80 bg-vlab-accent/15 blur-3xl"
                        style={{ borderRadius: '60% 40% 55% 45% / 40% 60% 40% 60%' }}
                    ></div>
                    <div
                        className="pointer-events-none absolute bottom-0 -right-16 w-72 h-72 bg-vlab-soft/15 blur-3xl"
                        style={{ borderRadius: '45% 55% 40% 60% / 60% 40% 60% 40%' }}
                    ></div>

                    <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-24">
                        <div className="text-center">
                            <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-vlab-soft text-xs font-display -rotate-1">
                                KENAPA V-LAB?
                            </span>
                            <h2 className="font-display text-2xl md:text-3xl mt-4">Mengapa Menggunakan V-Lab?</h2>
                        </div>
                        <div className="grid md:grid-cols-4 gap-6 mt-12">
                            {[
                                { icon: '🖥️', title: 'Interaktif', desc: 'Tidak hanya membaca, tapi ikut melakukan eksperimen.' },
                                { icon: '🌐', title: 'Fleksibel', desc: 'Dapat digunakan kapan saja dan di mana saja.' },
                                { icon: '🔄', title: 'Bisa Diulang', desc: 'Eksperimen dapat dilakukan berkali-kali tanpa menghabiskan bahan.' },
                                { icon: '📊', title: 'Berbasis Data', desc: 'Hasil percobaan dapat diamati dan dianalisis.' },
                            ].map((a, i) => (
                                <div
                                    key={a.title}
                                    className={`text-center bg-white/5 border border-white/10 rounded-[1.5rem] p-6 hover:bg-white/10 hover:-translate-y-1 transition ${
                                        i % 2 === 0 ? 'md:rotate-1 hover:rotate-0' : 'md:-rotate-1 hover:rotate-0'
                                    }`}
                                >
                                    <span className="w-14 h-14 mx-auto rounded-full bg-vlab-accent/20 flex items-center justify-center text-2xl">
                                        {a.icon}
                                    </span>
                                    <h3 className="font-display mt-4">{a.title}</h3>
                                    <p className="mt-1 text-sm text-white/60">{a.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* wave transisi keluar, ke warna section FAQ selanjutnya */}
                    <svg className="block w-full text-vlab-bg" viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: '50px' }}>
                        <path fill="currentColor" d="M0,20 C240,60 480,0 720,18 C960,36 1200,54 1440,20 L1440,60 L0,60 Z"></path>
                    </svg>
                </section>

                {/* FAQ */}
                <section id="faq" className="max-w-6xl mx-auto px-6 py-20">
                    <div className="text-center">
                        <span className="inline-block px-4 py-1 rounded-full bg-vlab-soft/50 text-vlab-primary text-xs font-display rotate-1">
                            MASIH ADA PERTANYAAN?
                        </span>
                        <h2 className="font-display text-2xl md:text-3xl text-vlab-primary mt-4">Pertanyaan yang Sering Diajukan</h2>
                    </div>
                    <FaqAccordion />
                </section>

                {/* CTA besar */}
                <section className="relative overflow-hidden bg-vlab-soft/40">
                    <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
                        <h2 className="font-display text-3xl md:text-4xl text-vlab-primary">Siap Menjelajahi Dunia Sains?</h2>
                        <p className="mt-4 text-vlab-ink/70">
                            Pilih eksperimenmu, lakukan percobaan, dan temukan jawabannya sendiri.
                        </p>
                        <Link
                            href={route('register')}
                            className="inline-block mt-8 px-8 py-3.5 rounded-xl bg-vlab-accent text-white font-semibold hover:brightness-110 transition shadow-lg shadow-vlab-accent/30"
                        >
                            🚀 Mulai Eksperimen
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-vlab-ink/10 bg-vlab-primary text-white">
                    <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
                        <div>
                            <span className="font-display text-lg">VIRTUAL LABORATORY</span>
                            <p className="mt-2 text-white/50">Eksplorasi • Eksperimen • Temukan</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white/80 mb-3">Navigasi</h4>
                            <ul className="space-y-2 text-white/50">
                                <li><a href="#apa-itu" className="hover:text-vlab-soft transition">Beranda</a></li>
                                <li><a href="#eksperimen" className="hover:text-vlab-soft transition">Eksperimen</a></li>
                                <li><a href="#materi" className="hover:text-vlab-soft transition">Materi</a></li>
                                <li><a href="#faq" className="hover:text-vlab-soft transition">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white/80 mb-3">Kategori</h4>
                            <ul className="space-y-2 text-white/50">
                                <li>Fisika</li>
                                <li>Kimia</li>
                                <li>Biologi</li>
                            </ul>
                        </div>
                        <div className="text-white/40 md:text-right self-end">
                            © 2026 Virtual Laboratory
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}