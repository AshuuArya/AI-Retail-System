/**
 * OpenAI Configuration and Utilities
 */
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface GenerateDescriptionParams {
    productName: string;
    category?: string;
    brand?: string;
    features?: string[];
    tone?: 'professional' | 'casual' | 'technical' | 'marketing';
}

export interface PriceSuggestionParams {
    productName: string;
    category?: string;
    costPrice?: number;
    competitors?: Array<{ name: string; price: number }>;
}

/**
 * Generate AI-powered product description
 */
export async function generateProductDescription(params: GenerateDescriptionParams): Promise<string> {
    const { productName, category, brand, features, tone = 'professional' } = params;

    const prompt = `Generate a compelling product description for an e-commerce listing.

Product Name: ${productName}
${category ? `Category: ${category}` : ''}
${brand ? `Brand: ${brand}` : ''}
${features && features.length > 0 ? `Key Features: ${features.join(', ')}` : ''}

Tone: ${tone}

Requirements:
- Write a ${tone} description (2-3 sentences)
- Highlight key benefits and features
- Make it engaging and persuasive
- Focus on value proposition
- Keep it concise and scannable

Description:`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert e-commerce copywriter who creates compelling product descriptions that drive sales.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 200,
        });

        return completion.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
        console.error('Error generating description:', error);
        throw new Error('Failed to generate product description');
    }
}

/**
 * Improve existing product description
 */
export async function improveProductDescription(currentDescription: string, tone?: string): Promise<string> {
    const prompt = `Improve this product description to make it more compelling and professional:

Current Description:
${currentDescription}

${tone ? `Desired Tone: ${tone}` : ''}

Requirements:
- Keep the same key information
- Make it more engaging and persuasive
- Improve clarity and readability
- Maintain similar length
- Fix any grammar or style issues

Improved Description:`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert copywriter who improves product descriptions.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 250,
        });

        return completion.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
        console.error('Error improving description:', error);
        throw new Error('Failed to improve product description');
    }
}

/**
 * Suggest optimal pricing based on various factors
 */
export async function suggestProductPrice(params: PriceSuggestionParams): Promise<{
    suggestedPrice: number;
    reasoning: string;
    priceRange: { min: number; max: number };
}> {
    const { productName, category, costPrice, competitors } = params;

    const prompt = `Suggest an optimal retail price for this product:

Product: ${productName}
${category ? `Category: ${category}` : ''}
${costPrice ? `Cost Price: ₹${costPrice}` : ''}
${competitors && competitors.length > 0 ? `
Competitor Prices:
${competitors.map(c => `- ${c.name}: ₹${c.price}`).join('\n')}
` : ''}

Provide:
1. Suggested retail price in INR (₹)
2. Price range (min-max)
3. Brief reasoning (1-2 sentences)

Consider:
- Standard retail markup (30-50%)
- Competitive positioning
- Market standards for this category
- Profit margin optimization

Response format (JSON):
{
  "suggestedPrice": <number>,
  "priceRange": { "min": <number>, "max": <number> },
  "reasoning": "<string>"
}`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gemini-3-flash-preview',
            messages: [
                {
                    role: 'system',
                    content: 'You are a pricing strategist who helps retailers optimize their product pricing.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.5,
            max_tokens: 300,
            response_format: { type: 'json_object' }
        });

        const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
        return {
            suggestedPrice: result.suggestedPrice || 0,
            reasoning: result.reasoning || '',
            priceRange: result.priceRange || { min: 0, max: 0 }
        };
    } catch (error) {
        console.error('Error suggesting price:', error);
        throw new Error('Failed to suggest product price');
    }
}

/**
 * Generate product tags/keywords
 */
export async function generateProductTags(productName: string, description?: string): Promise<string[]> {
    const prompt = `Generate 5-8 relevant tags/keywords for this product:

Product: ${productName}
${description ? `Description: ${description}` : ''}

Requirements:
- Single words or short phrases
- Relevant for search and categorization
- Mix of general and specific terms
- Lowercase

Return only the tags as a comma-separated list.`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.6,
            max_tokens: 100,
        });

        const tagsString = completion.choices[0]?.message?.content?.trim() || '';
        return tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
    } catch (error) {
        console.error('Error generating tags:', error);
        return [];
    }
}

/**
 * COMPREHENSIVE: Generate ALL product details from just a product name
 * This is the ULTIMATE AI feature - auto-fills everything!
 */
export interface CompleteProductData {
    name: string;
    description: string;
    category: string;
    brand: string;
    tags: string[];
    unit: string;
    lowStockThreshold: number;
    sku: string;
    suggestedPrice: number;
    estimatedCostPrice: number;
}

export async function generateCompleteProductData(productName: string): Promise<CompleteProductData> {
    const prompt = `You are a retail product expert. Given a product name, provide COMPLETE product information for inventory management.

Product Name: "${productName}"

Analyze this product and provide comprehensive details in JSON format:

{
  "name": "<cleaned/formatted product name>",
  "description": "<compelling 2-3 sentence product description>",
  "category": "<appropriate category like 'Electronics', 'Beverages', 'Clothing', etc>",
  "brand": "<likely brand name, or 'Generic' if unknown>",
  "suggestedPrice": <retail price in INR (₹)>,
  "estimatedCostPrice": <estimated wholesale/cost price in INR>,
  "tags": ["<tag1>", "<tag2>", "<tag3>", ...],
  "unit": "<piece/kg/g/l/ml/box/pack>",
  "lowStockThreshold": <recommended minimum stock level>,
  "sku": "<generated SKU code>"
}

Guidelines:
- Be realistic with Indian market pricing
- Description should be marketing-ready
- Tags should be searchable keywords
- SKU should be alphanumeric (e.g., PROD-001, COFFEE-123)
- Low stock threshold based on product type (perishable=20, durable=10, etc)
- Unit should match product type

Return ONLY valid JSON, no additional text.`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gemini-3-flash-preview',
            messages: [
                {
                    role: 'system',
                    content: 'You are a retail product data expert who provides accurate, comprehensive product information in JSON format.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 500,
            response_format: { type: 'json_object' }
        });

        const result = JSON.parse(completion.choices[0]?.message?.content || '{}');

        return {
            name: result.name || productName,
            description: result.description || '',
            category: result.category || '',
            brand: result.brand || '',
            suggestedPrice: result.suggestedPrice || 0,
            estimatedCostPrice: result.estimatedCostPrice || 0,
            tags: result.tags || [],
            unit: result.unit || 'piece',
            lowStockThreshold: result.lowStockThreshold || 10,
            sku: result.sku || ''
        };
    } catch (error) {
        console.error('Error generating complete product data:', error);
        throw new Error('Failed to generate product data');
    }
}

/**
 * Smart search suggestions - AI-powered product search
 */
export async function getSearchSuggestions(query: string, existingProducts: string[]): Promise<string[]> {
    const prompt = `Given this search query: "${query}"

Existing products in inventory: ${existingProducts.slice(0, 10).join(', ')}

Provide 5 smart search suggestions that would help the user find products. Consider:
- Similar products
- Related categories
- Common variations
- Spelling corrections

Return as comma-separated list.`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gemini-3-flash-preview',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.5,
            max_tokens: 100,
        });

        const suggestions = completion.choices[0]?.message?.content?.trim() || '';
        return suggestions.split(',').map(s => s.trim()).filter(Boolean);
    } catch (error) {
        console.error('Error getting search suggestions:', error);
        return [];
    }
}

export default openai;
