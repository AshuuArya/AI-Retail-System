/**
 * API Route: AI product enrichment
 */
import { NextRequest, NextResponse } from 'next/server';
import { OpenAIService } from '@/infrastructure/ai/OpenAIService';

export async function POST(request: NextRequest) {
    try {
        const { name, description } = await request.json();

        const aiService = new OpenAIService();
        const enrichment = await aiService.enrichProduct({
            name,
            existingDescription: description,
        });

        return NextResponse.json(enrichment);
    } catch (error: any) {
        console.error('Error enriching product:', error);
        return NextResponse.json(
            { error: error.message || 'AI enrichment failed' },
            { status: 500 }
        );
    }
}
