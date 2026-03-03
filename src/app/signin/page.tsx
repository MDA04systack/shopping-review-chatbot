'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Redirect to dashboard on success
            router.push('/dashboard');
        } catch (err: any) {
            console.error('SignIn error:', err);
            setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ background: '#fff', padding: '48px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '440px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: 48, height: 48, background: '#2563eb', borderRadius: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '28px' }}>smart_toy</span>
                    </div>
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>다시 오신 것을 환영합니다</h1>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>계정에 로그인하여 분석을 계속하세요</p>
                </div>

                {error && (
                    <div style={{ marginBottom: '20px', padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', fontSize: '14px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>이메일</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '15px', color: '#0f172a', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>비밀번호</label>
                            <Link href="/forgot-password" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>비밀번호 찾기</Link>
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '15px', color: '#0f172a', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', padding: '16px', fontSize: '16px', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '8px', transition: 'background 0.2s', opacity: isLoading ? 0.8 : 1 }}
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                        계정이 없으신가요? <Link href="/signup" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>무료 회원가입</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
