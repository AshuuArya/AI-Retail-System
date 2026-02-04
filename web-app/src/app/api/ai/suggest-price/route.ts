import { NextRequest, NextResponse } from 'next/server';
import { suggestProductPrice } from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productName, category, costPrice } = body;

        if (!productName) {
            return NextResponse.json(
                { message: 'Product name is required' },
                { status: 400 }
            );
        }

        const suggestedPrice = await suggestProductPrice(productName, category, costPrice);

        return NextResponse.json({
            suggestedPrice,
            success: true
        });
    } catch (error: any) {
        console.error('Error in AI pricing API:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to suggest price' },
            { status: 500 }
        );
    }
}
