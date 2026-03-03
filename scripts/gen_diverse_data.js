import fs from 'fs';
import path from 'path';

const products = [
    { id: '1', name: '무선 이어폰 A (샘플 데이터)', category: 'Audio' },
    { id: '2', name: '블루투스 스피커 B', category: 'Audio' },
    { id: '3', name: '스마트워치 C', category: 'Wearable' },
    { id: '4', name: '노이즈 캔슬링 헤드폰 D', category: 'Audio' }
];

const reviewTemplates = [
    { rating: 5, title: '대만족입니다!', content: '디자인도 깔끔하고 {feature} 성능이 기대 이상이에요. 정말 추천합니다.' },
    { rating: 4, title: '좋아요 근데 조금 아쉽네요', content: '전반적으로 만족하지만 {feature} 부분이 살짝 아쉽습니다. 그래도 가성비 좋네요.' },
    { rating: 5, title: '최고의 선택', content: '배송도 빠르고 {feature} 기능이 너무 편리해요. {product_name} 사길 잘했네요.' },
    { rating: 3, title: '그냥 그래요', content: '가격만큼 하는 것 같습니다. {feature}가 좀 더 개선되면 좋겠어요.' },
    { rating: 5, title: '사용하기 너무 편해요', content: '조작법도 쉽고 {feature}가 직관적이라 부모님 선물로도 좋을 것 같아요.' },
    { rating: 2, title: '비추천합니다', content: '생각보다 {feature}가 별로예요. 다른 제품 알아보시는게 좋을 듯.' },
    { rating: 4, title: '튼튼하고 실용적임', content: '마감이 좋고 {feature}가 아주 탄탄하네요. 오래 쓸 수 있을 것 같아요.' }
];

const productFeatures = {
    'Audio': ['음질', '베이스', '연결성', '배터리 시간', '착용감'],
    'Wearable': ['디스플레이', '심박수 측정', '스트랩 촉감', '배터리', '수면 분석']
};

const rows = [['id', 'product_name', 'rating', 'title', 'content']];

let reviewId = 1;
products.forEach(product => {
    const features = productFeatures[product.category] || ['성능'];

    // Generate 50 reviews per product
    for (let i = 0; i < 50; i++) {
        const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
        const feature = features[Math.floor(Math.random() * features.length)];

        const content = template.content
            .replace('{feature}', feature)
            .replace('{product_name}', product.name);

        rows.push([
            `REV_${reviewId++}`,
            product.name,
            template.rating.toString(),
            template.title,
            `"${content}"` // Wrap in quotes for CSV
        ]);
    }
});

const csvContent = rows.map(row => row.join(',')).join('\n');
const filePath = path.join(process.cwd(), 'samples', 'review.csv');

// Create directory if not exists
const dir = path.dirname(filePath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(filePath, csvContent, 'utf8');

console.log(`Successfully generated ${rows.length - 1} reviews for ${products.length} products.`);
console.log(`Path: ${filePath}`);
