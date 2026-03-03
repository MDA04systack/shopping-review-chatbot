'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (error) throw error;

            setMessage({
                type: 'success',
                text: '비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일함을 확인해 주세요.',
            });
        } catch (err: any) {
            console.error('Reset password error:', err);
            setMessage({
                type: 'error',
                text: err.message || '이메일 전송 중 오류가 발생했습니다.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ background: '#fff', padding: '48px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '440px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: 48, height: 48, background: '#2563eb', borderRadius: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '28px' }}>lock_reset</span>
                    </div>
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>비밀번호 찾기</h1>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>가입 시 사용한 이메일 주소를 입력해 주시면, <br />비밀번호 재설정 링크를 보내드립니다.</p>
                </div>

                {message && (
                    <div style={{
                        marginBottom: '20px',
                        padding: '12px',
                        background: message.type === 'error' ? '#fee2e2' : '#dcfce7',
                        color: message.type === 'error' ? '#b91c1c' : '#15803d',
                        borderRadius: '12px',
                        fontSize: '14px',
                        textAlign: 'center',
                        lineHeight: '1.5'
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', padding: '16px', fontSize: '16px', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '8px', transition: 'background 0.2s', opacity: isLoading ? 0.8 : 1 }}
                    >
                        {isLoading ? '전송 중...' : '재설정 링크 받기'}
                    </button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                        <Link href="/signin" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>로그인으로 돌아가기</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
