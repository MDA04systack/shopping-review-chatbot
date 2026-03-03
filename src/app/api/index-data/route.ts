import { NextResponse } from 'next/server';
import { getPinecone, indexName, embeddingModel } from '@/lib/rag';
import Papa from 'papaparse';
import path from 'path';
import fs from 'fs';

export async function POST() {
    try {
        const csvPath = path.join(process.cwd(), 'samples', 'review.csv');
        const csvText = fs.readFileSync(csvPath, 'utf-8');

        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        // Filter out rows that don't have an ID or content
        const rows = (parsed.data as Record<string, string>[]).filter(r => r.id && r.content);

        if (!rows.length) {
            return NextResponse.json({ success: false, error: 'CSV에서 데이터를 찾을 수 없습니다.' }, { status: 400 });
        }

        const pinecone = getPinecone();
        const index = pinecone.index(indexName);

        const batchSize = 20;
        let totalUpserted = 0;

        for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);

            const texts = batch.map(row =>
                `제목: ${row.title}\n내용: ${row.content}\n평점: ${row.rating}`
            );

            const embeddingResponse = await pinecone.inference.embed({
                model: embeddingModel,
                inputs: texts,
                parameters: { inputType: 'passage', truncate: 'END' },
            });

            const vectors = batch.map((row, j) => ({
                id: `review-${row.id ?? (i + j)}`,
                values: embeddingResponse.data[j].values as number[],
                metadata: {
                    title: row.title ?? '',
                    content: row.content ?? '',
                    author: row.author ?? '',
                    date: row.date ?? '',
                    rating: row.rating ?? '',
                    helpful_votes: row.helpful_votes ?? '',
                    verified_purchase: row.verified_purchase ?? '',
                },
            }));

            // In Pinecone SDK v3+ / v7, upsert expects an object: { records: vectors }
            if (vectors.length > 0) {
                await index.upsert({ records: vectors });
                totalUpserted += vectors.length;
            }
        }

        return NextResponse.json({ success: true, message: `${totalUpserted}개 데이터를 인덱싱했습니다.` });
    } catch (error: any) {
        console.error('Indexing error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
