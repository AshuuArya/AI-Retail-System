import { NextRequest, NextResponse } from 'next/server';
import { autoFillProductData } from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productName } = body;

        if (!productName) {
            return NextResponse.json(
                { message: 'Product name is required' },
                { status: 400 }
            );
        }

        const data = await autoFillProductData(productName);

        return NextResponse.json({
            ...data,
            success: true
        });
    } catch (error: any) {
        console.error('Error in AI auto-fill API:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to generate product data' },
            { status: 500 }
        );
    }
}
