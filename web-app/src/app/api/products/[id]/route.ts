import { NextRequest, NextResponse } from 'next/server';
import { databases } from '@/infrastructure/appwrite/server-client';
import { Query } from 'node-appwrite';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const PRODUCTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;

// GET single product
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: productId } = await params;

        if (!DATABASE_ID || !PRODUCTS_COLLECTION_ID) {
            return Response.json(
                { error: 'Database configuration missing' },
                { status: 500 }
            );
        }

        const product = await databases.getDocument(
            DATABASE_ID,
            PRODUCTS_COLLECTION_ID,
            productId
        );

        return NextResponse.json(product);
    } catch (error: any) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch product' },
            { status: error.code || 500 }
        );
    }
}

// PUT (update) product
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: productId } = await params;

        if (!DATABASE_ID || !PRODUCTS_COLLECTION_ID) {
            return Response.json(
                { error: 'Database configuration missing' },
                { status: 500 }
            );
        }
        const body = await request.json();

        // Remove fields that shouldn't be updated
        const { $id, $createdAt, $updatedAt, $permissions, $collectionId, $databaseId, ...updateData } = body;

        const updatedProduct = await databases.updateDocument(
            DATABASE_ID,
            PRODUCTS_COLLECTION_ID,
            productId,
            updateData
        );

        return NextResponse.json(updatedProduct);
    } catch (error: any) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update product' },
            { status: error.code || 500 }
        );
    }
}

// DELETE product
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: productId } = await params;

        if (!DATABASE_ID || !PRODUCTS_COLLECTION_ID) {
            return Response.json(
                { error: 'Database configuration missing' },
                { status: 500 }
            );
        }

        await databases.deleteDocument(
            DATABASE_ID,
            PRODUCTS_COLLECTION_ID,
            productId
        );

        return NextResponse.json({ success: true, message: 'Product deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete product' },
            { status: error.code || 500 }
        );
    }
}
