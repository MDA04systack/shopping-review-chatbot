import Link from 'next/link';
import AuthButtons from '@/components/AuthButtons';

export default function LandingPage() {
    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                            <span className="material-symbols-outlined">smart_toy</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">쇼핑 리뷰 분석 봇</span>
                    </div>
                    <nav className="hidden items-center gap-8 md:flex">
                    </nav>
                    <div className="flex items-center gap-3">
                        <AuthButtons />
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                        <div className="flex flex-col gap-8">
                            <div className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary dark:bg-primary/20">
                                AI 쇼핑 어시스턴트
                            </div>
                            <div className="flex flex-col gap-4">
                                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                                    진짜 리뷰를 <span className="text-primary">한눈에</span> 확인하세요
                                </h1>
                                <p className="max-w-xl text-lg text-slate-600 dark:text-slate-400">
                                    수천 개의 리뷰를 AI가 요약하고 분석하여 당신의 궁금증을 즉시 해결해 드립니다. 광고성 리뷰는 거르고 핵심만 확인하세요.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                                <Link href="/signup" className="flex h-12 md:h-14 items-center justify-center gap-2 rounded-xl bg-primary px-6 md:px-8 text-sm md:text-base font-bold text-white shadow-xl shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all w-full sm:w-auto">
                                    무료로 시작하기
                                </Link>
                            </div>
                        </div>
                        {/* ... Other sections would follow similar pattern ... */}
                        <div className="relative">
                            <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                                    <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                                    <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white"><span className="material-symbols-outlined text-sm">smart_toy</span></div>
                                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-sm">이 모델의 가장 큰 단점이 뭔가요?</div>
                                    </div>
                                    <div className="flex items-start gap-3 flex-row-reverse">
                                        <div className="w-8 h-8 rounded bg-slate-200"></div>
                                        <div className="bg-primary text-white p-3 rounded-lg text-sm">실제 구매자들은 배터리 수명이 광고보다 짧다는 점을 가장 많이 지적했습니다.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-900 py-12 md:py-24">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-white">지금 바로 시작하세요</h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                        <AuthButtons />
                    </div>
                </div>
            </footer>
        </div>
    );
}
