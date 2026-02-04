/**
 * Gemini AI Service Implementation
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAIService } from '@/core/repositories/IAIService';
import { AIQuery, AIProductEnrichment, AIEnrichmentResult } from '@/core/entities/AIQuery';
import { Product } from '@/core/entities/Product';
import { config } from '../config/env';

export class GeminiService implements IAIService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        const apiKey = config.ai.gemini.apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('Gemini API key is required');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: config.ai.gemini.model || 'gemini-1.5-flash' });
    }

    async semanticSearch(query: AIQuery, products: Product[]): Promise<Product[]> {
        if (products.length === 0) return [];

        const productList = products
            .map((p, i) => `${i}. ${p.itemName} - ${p.userEditedDescription || p.aiGeneratedDescription || ''} (Category: ${p.category})`)
            .join('\n');

        const prompt = `Given this search query: "${query.query}"
Find the most relevant products from this list:
${productList}

Return ONLY the numbers (indices) of relevant products, separated by commas. 
Be semantic and understand intent. If query is about "cold drinks", match sodas, juices, etc.
Return format: 0,3,5 (just numbers, no explanation)`;

        try {
            const result = await this.model.generateContent(prompt);
            const text = result.response.text().trim();
            const indices = text
                .split(',')
                .map((s: string) => parseInt(s.trim()))
                .filter((n: number) => !isNaN(n) && n >= 0 && n < products.length);

            return indices.map((i: number) => products[i]);
        } catch (error) {
            console.error('Gemini semantic search failed:', error);
            return products.filter(p =>
                p.itemName.toLowerCase().includes(query.query.toLowerCase()) ||
                p.category.toLowerCase().includes(query.query.toLowerCase())
            );
        }
    }

    async enrichProduct(data: AIProductEnrichment): Promise<AIEnrichmentResult> {
        const prompt = `Generate product information for: "${data.name}"
${data.existingDescription ? `Existing description: ${data.existingDescription}` : ''}

Provide a compelling product description (2-3 sentences), the most appropriate category, and a suggested price in USD.
Respond in this EXACT JSON format:
{
  "description": "...",
  "category": "...",
  "suggestedPrice": 0.00
}`;

        try {
            const result = await this.model.generateContent(prompt);
            let text = result.response.text().trim();
            // Clean markdown if present
            text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            const parsed = JSON.parse(text);
            return {
                description: parsed.description || '',
                category: parsed.category || 'Other',
                suggestedPrice: parsed.suggestedPrice
            };
        } catch (error) {
            console.error('Gemini enrichment failed:', error);
            return {
                description: data.existingDescription || '',
                category: data.category || 'Other'
            };
        }
    }

    async generateDescription(productName: string): Promise<string> {
        const prompt = `Write a professional 2-3 sentence product description for: "${productName}"`;
        try {
            const result = await this.model.generateContent(prompt);
            return result.response.text().trim();
        } catch (error) {
            console.error('Gemini description generation failed:', error);
            return '';
        }
    }

    async categorizeProduct(productName: string, description?: string): Promise<string> {
        const prompt = `Categorize this product into ONE word: "${productName}"
${description ? `Description: ${description}` : ''}
Common categories: Electronics, Clothing, Food, Beauty, Home, Sports, Books, Toys.`;

        try {
            const result = await this.model.generateContent(prompt);
            return result.response.text().trim();
        } catch (error) {
            console.error('Gemini categorization failed:', error);
            return 'Other';
        }
    }
}
