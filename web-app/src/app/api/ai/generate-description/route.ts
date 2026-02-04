import { NextRequest, NextResponse } from 'next/server';
import { generateProductDescription, improveDescription } from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productName, tone, currentDescription, improve } = body;

        if (!productName && !currentDescription) {
            return NextResponse.json(
                { message: 'Product name or current description is required' },
                { status: 400 }
            );
        }

        let description: string;

        if (improve && currentDescription) {
            // Improve existing description
            description = await improveDescription(currentDescription, productName);
        } else {
            // Generate new description
            description = await generateProductDescription(productName, tone || 'professional');
        }

        return NextResponse.json({
            description,
            success: true
        });
    } catch (error: any) {
        console.error('Error in AI description API:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to generate description' },
            { status: 500 }
        );
    }
}
