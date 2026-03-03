import { NextResponse } from 'next/server';
import { getPinecone, indexName, embeddingModel } from '@/lib/rag';
import { supabase } from '@/lib/supabase';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

export async function POST(req: Request) {
    try {
        const { message, chatId, productName } = await req.json();

        const pinecone = getPinecone();
        const index = pinecone.index(indexName);

        // Generate query embedding
        const embeddingResponse = await pinecone.inference.embed({
            model: embeddingModel,
            inputs: [message],
            parameters: { inputType: 'query', truncate: 'END' },
        });

        const queryVector = embeddingResponse.data[0].values as number[];

        // Vector similarity search
        const searchResult = await index.query({
            vector: queryVector,
            topK: 3,
            includeMetadata: true,
        });

        const context = searchResult.matches
            .map(match => {
                const m = match.metadata as any;
                return `[평점 ${m.rating}★] 제목: ${m.title}\n${m.content}`;
            })
            .join('\n\n---\n\n');

        let botResponse = '';

        if (!context) {
            botResponse = '관련 리뷰를 찾지 못했습니다. 먼저 [샘플 데이터 인덱싱] 버튼을 눌러 데이터를 준비해 주세요.';
        } else {
            const llm = new ChatOpenAI({
                modelName: 'gpt-5-nano',
                openAIApiKey: process.env.OPENAI_API_KEY,
            });

            const prompt = PromptTemplate.fromTemplate(`
당신은 쇼핑몰 리뷰를 분석해주는 친절한 AI 어시스턴트입니다.
사용자의 질문에 대해 아래 제공된 '관련 리뷰'를 바탕으로 답변해 주세요.
주어진 리뷰 내용 외의 사실을 지어내지 말고, 리뷰에 있는 내용을 종합하여 친절하게 설명해 주세요.

[관련 리뷰 요약 본문]
{context}

사용자 질문: {question}
답변:`);

            const chain = prompt.pipe(llm).pipe(new StringOutputParser());
            botResponse = await chain.invoke({
                context: context,
                question: message,
            });
        }

        let currentChatId = chatId;

        // Create a new chat session if missing
        if (!currentChatId) {
            const { data: newChat, error: chatError } = await supabase
                .from('chats')
                .insert([{ product_name: productName || '무선 이어폰 A (샘플)' }])
                .select()
                .single();

            if (chatError) throw chatError;
            currentChatId = newChat.id;
        }

        // Save messages
        await supabase.from('messages').insert([
            { chat_id: currentChatId, role: 'user', content: message },
            { chat_id: currentChatId, role: 'assistant', content: botResponse },
        ]);

        return NextResponse.json({
            response: botResponse,
            chatId: currentChatId
        });
    } catch (error: any) {
        console.error('Chat error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
