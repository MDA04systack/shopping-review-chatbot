'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, Send, Share2, SlidersHorizontal, HelpCircle, User, Settings, MessageSquare, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface Chat {
    id: string;
    product_name: string;
    created_at: string;
}

const PRODUCTS = [
    { id: '1', name: '무선 이어폰 A (샘플 데이터)' },
    { id: '2', name: '블루투스 스피커 B' },
    { id: '3', name: '스마트워치 C' },
    { id: '4', name: '노이즈 캔슬링 헤드폰 D' }
];

export default function Dashboard() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: '안녕하세요! 쇼핑 리뷰 분석 봇입니다. 어떤 상품의 리뷰가 궁금하신가요?\n\n먼저 왼쪽의 [샘플 데이터 인덱싱] 버튼을 눌러 리뷰 데이터를 준비한 후 질문해 주세요.' }
    ]);
    const [input, setInput] = useState('');
    const [isIndexing, setIsIndexing] = useState(false);
    const [indexStatus, setIndexStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
    const [isSending, setIsSending] = useState(false);
    const [chatId, setChatId] = useState<string | null>(null);
    const [chatList, setChatList] = useState<Chat[]>([]);
    const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0].name);
    const [isListLoading, setIsListLoading] = useState(false);
    const [sessionUser, setSessionUser] = useState<any>(null);
    const router = useRouter();

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/signin');
            } else {
                setSessionUser(session.user);
            }
        };
        checkUser();
    }, [router]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        loadChatList();
    }, []);

    const loadChatList = async () => {
        setIsListLoading(true);
        try {
            const res = await fetch('/api/chats');
            const data = await res.json();
            if (Array.isArray(data)) setChatList(data);
        } catch (err) {
            console.error('Failed to load chat list:', err);
        } finally {
            setIsListLoading(false);
        }
    };

    const loadChatMessages = async (id: string) => {
        setChatId(id);
        setMessages([{ role: 'assistant', content: '대화 내용을 불러오는 중...' }]);
        try {
            const res = await fetch(`/api/chats/${id}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setMessages(data.map(m => ({ role: m.role, content: m.content })));
            }
        } catch (err) {
            console.error('Failed to load messages:', err);
            setMessages([{ role: 'assistant', content: '대화 내용을 불러오는데 실패했습니다.' }]);
        }
    };

    const handleNewChat = () => {
        setChatId(null);
        setMessages([
            { role: 'assistant', content: `새로운 대화를 시작합니다. [${selectedProduct}] 상품 리뷰에 대해 궁금한 점을 물어보세요!` }
        ]);
        setInput('');
    };

    const handleIndexData = async () => {
        setIsIndexing(true);
        setIndexStatus('loading');
        try {
            const res = await fetch('/api/index-data', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                setIndexStatus('done');
                setMessages(prev => [...prev, { role: 'assistant', content: '✅ 샘플 데이터 100개를 Pinecone에 인덱싱했습니다! 이제 리뷰에 대해 질문해 보세요.' }]);
            } else {
                setIndexStatus('error');
                setMessages(prev => [...prev, { role: 'assistant', content: '❌ 인덱싱 실패: ' + data.error }]);
            }
        } catch (error) {
            setIndexStatus('error');
        } finally {
            setIsIndexing(false);
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isSending) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsSending(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    chatId: chatId,
                    productName: selectedProduct
                }),
            });
            const data = await res.json();

            if (data.chatId && !chatId) {
                setChatId(data.chatId);
                loadChatList(); // Refresh list to show the new chat
            }

            setMessages(prev => [...prev, { role: 'assistant', content: data.response ?? '응답을 받지 못했습니다.' }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: '죄송합니다. 오류가 발생했습니다.' }]);
        } finally {
            setIsSending(false);
        }
    };

    const indexBtnStyle = isIndexing
        ? { background: '#94a3b8' }
        : indexStatus === 'done'
            ? { background: '#10b981' }
            : { background: '#22c55e' };

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, sans-serif', background: '#f5f7f8', color: '#0f172a' }}>

            {/* Sidebar */}
            <aside style={{ width: '288px', display: 'flex', flexDirection: 'column', background: '#fff', borderRight: '1px solid #e2e8f0', flexShrink: 0 }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ width: 40, height: 40, background: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '24px' }}>smart_toy</span>
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>쇼핑 리뷰 분석 챗봇</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
                                <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Connected</span>
                            </div>
                        </div>
                    </Link>

                    <button
                        onClick={handleIndexData}
                        disabled={isIndexing}
                        style={{ ...indexBtnStyle, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 16px', fontWeight: 600, fontSize: '13px', cursor: isIndexing ? 'not-allowed' : 'pointer', marginBottom: '8px', transition: 'background 0.2s' }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>database</span>
                        {isIndexing ? '인덱싱 중...' : indexStatus === 'done' ? '✓ 인덱싱 완료' : '샘플 데이터 인덱싱'}
                    </button>

                    <button
                        onClick={handleNewChat}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 16px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'filter 0.2s' }}
                    >
                        <Plus size={16} /> 새로운 채팅
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px', paddingLeft: '8px' }}>분석 대상 상품</label>
                    <div style={{ position: 'relative', marginBottom: '24px' }}>
                        <select
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                            style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', boxSizing: 'border-box', outline: 'none', appearance: 'none', cursor: 'pointer' }}
                        >
                            {PRODUCTS.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                        </select>
                        <SlidersHorizontal style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} size={14} />
                    </div>

                    <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px', paddingLeft: '8px' }}>최근 대화</label>
                        {isListLoading ? (
                            <p style={{ fontSize: '12px', color: '#94a3b8', padding: '0 8px' }}>불러오는 중...</p>
                        ) : chatList.length === 0 ? (
                            <p style={{ fontSize: '12px', color: '#94a3b8', padding: '0 8px' }}>대화 기록이 없습니다.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {chatList.map(chat => (
                                    <div
                                        key={chat.id}
                                        onClick={() => loadChatMessages(chat.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '10px 12px',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            background: chatId === chat.id ? '#eff6ff' : 'transparent',
                                            color: chatId === chat.id ? '#2563eb' : '#64748b',
                                            fontSize: '13px',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <MessageSquare size={16} />
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: chatId === chat.id ? 600 : 400 }}>
                                            {chat.product_name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <User size={16} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {sessionUser?.user_metadata?.full_name || '사용자'}
                            </p>
                            <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {sessionUser?.email || '로딩 중...'}
                            </p>
                        </div>
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                router.push('/signin');
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}
                            title="로그아웃"
                        >
                            <LogOut size={16} style={{ color: '#94a3b8' }} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f5f7f8' }}>
                <header style={{ height: '64px', borderBottom: '1px solid #e2e8f0', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h2 style={{ margin: 0, fontWeight: 700, fontSize: '15px' }}>{selectedProduct}</h2>
                        <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', border: '1px solid #bbf7d0', textTransform: 'uppercase' }}>실시간 분석</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Share2 size={18} style={{ color: '#94a3b8', cursor: 'pointer' }} />
                        <div style={{ width: 1, height: 20, background: '#e2e8f0' }} />
                        <HelpCircle size={18} style={{ color: '#94a3b8', cursor: 'pointer' }} />
                    </div>
                </header>

                {/* Chat messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{ display: 'flex', gap: '16px', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                            {msg.role === 'assistant' && (
                                <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '20px' }}>smart_toy</span>
                                </div>
                            )}
                            <div style={{ maxWidth: '600px' }}>
                                <div style={{
                                    padding: '14px 18px',
                                    borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                                    background: msg.role === 'user' ? '#3b82f6' : '#fff',
                                    color: msg.role === 'user' ? '#fff' : '#0f172a',
                                    border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    whiteSpace: 'pre-wrap',
                                }}>
                                    {msg.content}
                                </div>
                            </div>
                            {msg.role === 'user' && (
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <User size={16} style={{ color: '#fff' }} />
                                </div>
                            )}
                        </div>
                    ))}
                    {isSending && (
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '20px' }}>smart_toy</span>
                            </div>
                            <div style={{ padding: '14px 18px', borderRadius: '4px 18px 18px 18px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: '6px', alignItems: 'center' }}>
                                {[0, 1, 2].map(i => (
                                    <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8', display: 'inline-block', animation: `bounce 1s ${i * 0.2}s infinite` }} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input area */}
                <div style={{ padding: '20px 32px', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
                    <form onSubmit={handleSendMessage} style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            disabled={isSending}
                            style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px 56px 16px 20px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
                            placeholder="상품 리뷰에 대해 질문해보세요..."
                        />
                        <button
                            type="submit"
                            disabled={isSending || !input.trim()}
                            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: input.trim() && !isSending ? '#3b82f6' : '#cbd5e1', border: 'none', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !isSending ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}
                        >
                            <Send size={16} style={{ color: '#fff' }} />
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', margin: '10px 0 0' }}>
                        쇼핑 리뷰 분석 봇은 실수를 할 수 있습니다. 중요한 정보는 반드시 확인해주시기 바랍니다.
                    </p>
                </div>
            </main>
        </div>
    );
}
