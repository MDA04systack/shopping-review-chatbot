'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function UpdatePassword() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    // Verify if auth session is active due to the recovery link
    useEffect(() => {
        supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                // User clicked the recovery link, so they can set a new password
            }
        });
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: '비밀번호가 일치하지 않습니다.' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setMessage({
                type: 'success',
                text: '성공적으로 변경되었습니다. 잠시 후 대시보드로 이동합니다.',
            });

            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);

        } catch (err: any) {
            console.error('Update password error:', err);
            setMessage({
                type: 'error',
                text: err.message || '비밀번호 변경 중 오류가 발생했습니다.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ background: '#fff', padding: '48px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '440px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: 48, height: 48, background: '#10b981', borderRadius: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '28px' }}>key</span>
                    </div>
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>새 비밀번호 설정</h1>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>사용할 새로운 비밀번호를 입력해 주세요.</p>
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

                <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>새 비밀번호</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="최소 8자 이상"
                            style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '15px', color: '#0f172a', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>새 비밀번호 확인</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="다시 한번 입력해 주세요"
                            style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '15px', color: '#0f172a', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', padding: '16px', fontSize: '16px', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '8px', transition: 'opacity 0.2s', opacity: isLoading ? 0.8 : 1 }}
                    >
                        {isLoading ? '변경 중...' : '비밀번호 변경하기'}
                    </button>
                </form>
            </div>
        </div>
    );
}
