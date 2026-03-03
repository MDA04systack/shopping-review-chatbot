import { Pinecone } from '@pinecone-database/pinecone';
import { createClient } from '@supabase/supabase-js';

export const indexName = 'review-chatbot';
export const embeddingModel = 'llama-text-embed-v2';

export function getPinecone() {
    return new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
}

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);
