import { GoogleGenerativeAI } from '@google/generative-ai';

// Check multiple possible environment variable names
const apiKey = process.env.GEMINI_API_KEY
    || process.env.NEXT_PUBLIC_GEMINI_API_KEY
    || process.env.GOOGLE_AI_API_KEY
    || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;

if (!apiKey) {
    console.warn('⚠️ Gemini API key not found. AI features will be disabled.');
    console.warn('Please add GEMINI_API_KEY or GOOGLE_AI_API_KEY to your .env.local file');
} else {
    console.log('✅ Gemini API key found and configured');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface AIProductData {
    name?: string;
    description?: string;
    category?: string;
    brand?: string;
    suggestedPrice?: number;
    estimatedCostPrice?: number;
    tags?: string[];
    unit?: string;
    lowStockThreshold?: number;
    sku?: string;
}

export async function generateProductDescription(productName: string, tone: 'professional' | 'casual' | 'technical' = 'professional'): Promise<string> {
    if (!genAI) {
        throw new Error('Gemini API is not configured');
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

        const toneInstructions = {
            professional: 'Write a professional, business-focused product description.',
            casual: 'Write a friendly, conversational product description.',
            technical: 'Write a detailed, technical product description with specifications.'
        };

        const prompt = `${toneInstructions[tone]} Product name: "${productName}". 
    Write a compelling 2-3 sentence description that highlights key features and benefits. 
    Keep it concise and engaging.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error: any) {
        console.error('Gemini API error:', error);
        throw new Error(`Failed to generate description: ${error.message}`);
    }
}

export async function suggestProductPrice(productName: string, category?: string, costPrice?: number): Promise<number> {
    if (!genAI) {
        throw new Error('Gemini API is not configured');
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

        const prompt = `As a retail pricing expert, suggest a competitive retail price for this product:
    Product: "${productName}"
    ${category ? `Category: ${category}` : ''}
    ${costPrice ? `Cost Price: $${costPrice}` : ''}
    
    Consider market standards and typical markup ratios. 
    Respond with ONLY a number (the suggested price in dollars), nothing else.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const priceText = response.text().trim();

        // Extract number from response
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

        if (isNaN(price) || price <= 0) {
            throw new Error('Invalid price suggestion received');
        }

        return price;
    } catch (error: any) {
        console.error('Gemini API error:', error);
        throw new Error(`Failed to suggest price: ${error.message}`);
    }
}

export async function categorizeProduct(productName: string, description?: string): Promise<string> {
    if (!genAI) {
        throw new Error('Gemini API is not configured');
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

        const prompt = `Categorize this product into ONE of these categories: Electronics, Clothing, Food & Beverage, Home & Garden, Sports & Outdoors, Books & Media, Toys & Games, Health & Beauty, Automotive, Office Supplies, or Other.
    
    Product: "${productName}"
    ${description ? `Description: ${description}` : ''}
    
    Respond with ONLY the category name, nothing else.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error: any) {
        console.error('Gemini API error:', error);
        throw new Error(`Failed to categorize product: ${error.message}`);
    }
}

export async function generateProductTags(productName: string, category?: string, description?: string): Promise<string[]> {
    if (!genAI) {
        throw new Error('Gemini API is not configured');
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

        const prompt = `Generate 3-5 relevant product tags/keywords for:
    Product: "${productName}"
    ${category ? `Category: ${category}` : ''}
    ${description ? `Description: ${description}` : ''}
    
    Respond with ONLY comma-separated tags, nothing else. Example: tag1, tag2, tag3`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const tagsText = response.text().trim();

        return tagsText.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    } catch (error: any) {
        console.error('Gemini API error:', error);
        throw new Error(`Failed to generate tags: ${error.message}`);
    }
}

export async function autoFillProductData(productName: string): Promise<AIProductData> {
    if (!genAI) {
        throw new Error('Gemini API is not configured');
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

        const prompt = `As a retail product expert, provide complete product information for: "${productName}"

    Respond in this EXACT JSON format (no markdown, no code blocks, just pure JSON):
    {
      "name": "cleaned product name",
      "description": "2-3 sentence professional description",
      "category": "one of: Electronics, Clothing, Food & Beverage, Home & Garden, Sports & Outdoors, Books & Media, Toys & Games, Health & Beauty, Automotive, Office Supplies, Other",
      "brand": "likely brand name or 'Generic'",
      "suggestedPrice": number (retail price in dollars),
      "estimatedCostPrice": number (wholesale/cost price, typically 40-60% of retail),
      "tags": ["tag1", "tag2", "tag3"],
      "unit": "piece, kg, liter, box, etc.",
      "lowStockThreshold": number (reasonable minimum stock level),
      "sku": "auto-generated SKU code"
    }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let jsonText = response.text().trim();

        // Remove markdown code blocks if present
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const data = JSON.parse(jsonText);
        return data;
    } catch (error: any) {
        console.error('Gemini API error:', error);
        throw new Error(`Failed to auto-fill product data: ${error.message}`);
    }
}

export async function improveDescription(currentDescription: string, productName: string): Promise<string> {
    if (!genAI) {
        throw new Error('Gemini API is not configured');
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

        const prompt = `Improve this product description to be more compelling and professional:
    
    Product: "${productName}"
    Current Description: "${currentDescription}"
    
    Write an improved 2-3 sentence description that is more engaging and highlights key benefits.
    Respond with ONLY the improved description, nothing else.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error: any) {
        console.error('Gemini API error:', error);
        throw new Error(`Failed to improve description: ${error.message}`);
    }
}

