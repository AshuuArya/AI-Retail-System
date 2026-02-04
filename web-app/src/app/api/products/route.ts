import { NextRequest, NextResponse } from 'next/server';
import { AppwriteProductRepository } from '@/infrastructure/appwrite/AppwriteProductRepository';
import { GeminiService } from '@/infrastructure/ai/GeminiService';
import { AddProductUseCase } from '@/core/use-cases/AddProductUseCase';
import { GetProductsUseCase } from '@/core/use-cases/GetProductsUseCase';
import { CreateProductDTO } from '@/core/entities/Product';

// Initialize dependencies
const productRepository = new AppwriteProductRepository();
const aiService = new GeminiService();
const addProductUseCase = new AddProductUseCase(productRepository, aiService);
const getProductsUseCase = new GetProductsUseCase(productRepository);

// GET - List all products for a seller
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const sellerId = searchParams.get('sellerId');

        if (!sellerId) {
            return NextResponse.json(
                { message: 'Seller ID is required' },
                { status: 400 }
            );
        }

        const products = await getProductsUseCase.execute(sellerId);

        return NextResponse.json({
            products,
            total: products.length
        });
    } catch (error: any) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            sellerId,
            itemId,
            itemName,
            category,
            quantity,
            costPrice,
            sellPrice,
            additionalFields,
            customImageUrl,
            userEditedDescription,
            useAI,
            sku
        } = body;

        if (!sellerId || !itemName || sellPrice === undefined || quantity === undefined) {
            return NextResponse.json(
                { message: 'Missing required fields: Seller ID, Name, Price, and Stock are mandatory' },
                { status: 400 }
            );
        }

        const productData: CreateProductDTO = {
            sellerId,
            itemId: itemId || sku || `ITEM-${Date.now()}`,
            itemName,
            category: category || 'Other',
            quantity: parseInt(quantity),
            costPrice: parseFloat(costPrice || 0),
            sellPrice: parseFloat(sellPrice),
            additionalFields: additionalFields || {},
            customImageUrl: customImageUrl || '',
            userEditedDescription: userEditedDescription || ''
        };

        const product = await addProductUseCase.execute(productData, useAI !== false);

        return NextResponse.json({
            message: 'Product created successfully',
            product
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to create product' },
            { status: 500 }
        );
    }
}
