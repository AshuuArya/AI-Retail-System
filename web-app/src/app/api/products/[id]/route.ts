import { NextResponse } from 'next/server';
import { AppwriteProductRepository } from '@/infrastructure/appwrite/AppwriteProductRepository';
import { UpdateProductDTO } from '@/core/entities/Product';

// Initialize dependencies
const productRepository = new AppwriteProductRepository();

// GET single product
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await productRepository.findById(id);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error: any) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

// PUT (update) product
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Use repository to update - it handles filtering allowed fields
        const updatedProduct = await productRepository.update(id, body as UpdateProductDTO);

        return NextResponse.json(updatedProduct);
    } catch (error: any) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to update product' },
            { status: 500 }
        );
    }
}

// DELETE product
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await productRepository.delete(id);

        return NextResponse.json({ success: true, message: 'Product deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to delete product' },
            { status: 500 }
        );
    }
}
