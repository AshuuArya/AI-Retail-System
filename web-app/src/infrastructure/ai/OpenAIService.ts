/**
 * OpenAI Service Implementation
 * Implements IAIService using OpenAI GPT models
 */
import OpenAI from 'openai';
import { IAIService } from '@/core/repositories/IAIService';
import { AIQuery, AIProductEnrichment, AIEnrichmentResult } from '@/core/entities/AIQuery';
import { Product } from '@/core/entities/Product';
import { config } from '../config/env';

export class OpenAIService implements IAIService {
    private client: OpenAI;
    private model: string;

    constructor() {
        if (!config.ai.openai.apiKey) {
            throw new Error('OpenAI API key is required. Set OPENAI_API_KEY in .env.local');
        }

        this.client = new OpenAI({
            apiKey: config.ai.openai.apiKey,
        });
        this.model = config.ai.openai.model;
    }

    async semanticSearch(query: AIQuery, products: Product[]): Promise<Product[]> {
        if (products.length === 0) return [];

        // Create a prompt for semantic matching
        const productList = products
            .map((p, i) => `${i}. ${p.itemName} - ${p.userEditedDescription || p.aiGeneratedDescription || ''} (Category: ${p.category})`)
            .join('\n');

        const prompt = `Given this search query: "${query.query}"

Find the most relevant products from this list:
${productList}

Return ONLY the numbers (indices) of relevant products, separated by commas. 
If the query is about smell/fragrance, match perfumes, colognes, etc.
If the query is about drinks, match beverages.
Be semantic and understand intent.

Example: If query is "good smell", return indices of perfumes.
Return format: 0,3,5 (just numbers, no explanation)`;

        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3,
                max_tokens: 100,
            });

            const result = response.choices[0]?.message?.content?.trim() || '';
            const indices = result
                .split(',')
                .map((s) => parseInt(s.trim()))
                .filter((n) => !isNaN(n) && n >= 0 && n < products.length);

            return indices.map((i) => products[i]);
        } catch (error) {
            console.error('OpenAI semantic search failed:', error);
            // Fallback to simple text search
            return products.filter(
                (p) =>
                    p.name.toLowerCase().includes(query.query.toLowerCase()) ||
                    p.description.toLowerCase().includes(query.query.toLowerCase())
            );
        }
    }

    async enrichProduct(data: AIProductEnrichment): Promise<AIEnrichmentResult> {
        const prompt = `Generate product information for: "${data.name}"

${data.existingDescription ? `Existing description: ${data.existingDescription}` : ''}

Provide:
1. A compelling product description (2-3 sentences)
2. The most appropriate category
3. A suggested price range (in USD)

Format your response as JSON:
{
  "description": "...",
  "category": "...",
  "suggestedPrice": 0.00
}`;

        const response = await this.client.chat.completions.create({
            model: this.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            response_format: { type: 'json_object' },
        });

        const result = JSON.parse(response.choices[0]?.message?.content || '{}');

        return {
            description: result.description || data.existingDescription || '',
            category: result.category || 'General',
            suggestedPrice: result.suggestedPrice,
        };
    }

    async generateDescription(productName: string): Promise<string> {
        const response = await this.client.chat.completions.create({
            model: this.model,
            messages: [
                {
                    role: 'user',
                    content: `Write a compelling 2-3 sentence product description for: "${productName}"`,
                },
            ],
            temperature: 0.7,
            max_tokens: 150,
        });

        return response.choices[0]?.message?.content?.trim() || '';
    }

    async categorizeProduct(productName: string, description?: string): Promise<string> {
        const prompt = `Categorize this product into ONE category: "${productName}"
${description ? `Description: ${description}` : ''}

Choose from: Electronics, Clothing, Food & Beverage, Health & Beauty, Home & Garden, Sports & Outdoors, Books, Toys, Other

Return ONLY the category name, nothing else.`;

        const response = await this.client.chat.completions.create({
            model: this.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 20,
        });

        return response.choices[0]?.message?.content?.trim() || 'Other';
    }
}
