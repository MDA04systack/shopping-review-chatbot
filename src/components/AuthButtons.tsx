'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function AuthButtons() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex h-10 w-24 items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (session) {
        return (
            <Link
                href="/dashboard"
                className="flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-all"
            >
                대시보드로 가기
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <Link
                href="/signin"
                className="hidden h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:flex transition-colors"
            >
                로그인
            </Link>
            <Link
                href="/signup"
                className="flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-all"
            >
                무료로 시작하기
            </Link>
        </div>
    );
}
