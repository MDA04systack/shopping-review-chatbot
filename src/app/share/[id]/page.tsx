'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, MessageSquare } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function SharedChatPage({ params }: { params: { id: string } }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/chats/${params.id}`);
                if (!res.ok) throw new Error('채팅 내역을 불러오지 못했습니다.');
                const data = await res.json();
                setMessages(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [params.id]);

    return (
        <div className="min-h-screen bg-[#f5f7f8] font-sans text-[#0f172a]">
            {/* Header */}
            <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-[#e2e8f0] bg-white/90 px-6 backdrop-blur-md md:px-12">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563eb] shadow-lg shadow-blue-200">
                        <span className="material-symbols-outlined text-white text-2xl">smart_toy</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">쇼핑 리뷰 분석 결과</h1>
                        <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Shared via Shopping Review Bot</p>
                    </div>
                </div>
                <Link
                    href="/signup"
                    className="flex h-10 items-center justify-center rounded-lg bg-[#2563eb] px-5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition-all"
                >
                    나도 직접 질문하기
                </Link>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-12 md:px-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-20">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                        <p className="text-[#64748b] font-medium">채팅 내역을 불러오는 중...</p>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center shadow-sm">
                        <p className="text-red-600 font-semibold">{error}</p>
                        <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">홈으로 돌아가기</Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {messages.length === 0 ? (
                            <p className="text-center text-[#94a3b8] py-20">대화 내용이 없습니다.</p>
                        ) : (
                            messages.map((msg, i) => (
                                <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'assistant' && (
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563eb] shadow-md shadow-blue-100">
                                            <span className="material-symbols-outlined text-white text-xl">smart_toy</span>
                                        </div>
                                    )}
                                    <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed whitespace-pre-wrap
                                        ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-white border border-[#e2e8f0] text-[#0f172a] rounded-tl-none'
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200">
                                            <User size={16} className="text-slate-500" />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}

                        <div className="mt-12 text-center">
                            <hr className="border-[#e2e8f0] mb-8" />
                            <p className="text-sm text-[#64748b] mb-4">이 분석 결과가 도움이 되었나요? 지금 바로 직접 이용해보세요.</p>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
                            >
                                쇼핑 리뷰 분석 봇 더 알아보기 <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
