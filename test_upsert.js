const fs = require('fs');
const envText = fs.readFileSync('.env', 'utf-8');
envText.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
});

const { Pinecone } = require('@pinecone-database/pinecone');
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index('review-chatbot');

async function main() {
    try {
        await index.upsert([]);
        console.log('empty array OK');
    } catch (e) {
        console.log('empty array ERROR:', e.message);
    }

    try {
        await index.upsert([{ id: 'test', values: [] }]); // empty values?
        console.log('empty values OK');
    } catch (e) {
        console.log('empty values ERROR:', e.message);
    }

    try {
        const vectors = []; // Let's simulate what vectors might be
        console.log('vectors.length > 0 check:', vectors.length > 0);
    } catch (e) { }
}
main();
