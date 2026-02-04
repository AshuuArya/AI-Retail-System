import { NextRequest, NextResponse } from 'next/server';
import { databases } from '@/infrastructure/appwrite/server-client';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const CUSTOMERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID!;

// GET single customer
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: customerId } = await params;

        if (!DATABASE_ID || !CUSTOMERS_COLLECTION_ID) {
            return Response.json(
                { error: 'Database configuration missing' },
                { status: 500 }
            );
        }

        const customer = await databases.getDocument(
            DATABASE_ID,
            CUSTOMERS_COLLECTION_ID,
            customerId
        );

        return NextResponse.json(customer);
    } catch (error: any) {
        console.error('Error fetching customer:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch customer' },
            { status: error.code || 500 }
        );
    }
}

// PUT (update) customer
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: customerId } = await params;

        if (!DATABASE_ID || !CUSTOMERS_COLLECTION_ID) {
            return Response.json(
                { error: 'Database configuration missing' },
                { status: 500 }
            );
        }
        const body = await request.json();

        // Remove fields that shouldn't be updated
        const { $id, $createdAt, $updatedAt, $permissions, $collectionId, $databaseId, ...updateData } = body;

        const updatedCustomer = await databases.updateDocument(
            DATABASE_ID,
            CUSTOMERS_COLLECTION_ID,
            customerId,
            updateData
        );

        return NextResponse.json(updatedCustomer);
    } catch (error: any) {
        console.error('Error updating customer:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update customer' },
            { status: error.code || 500 }
        );
    }
}

// DELETE customer
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: customerId } = await params;

        if (!DATABASE_ID || !CUSTOMERS_COLLECTION_ID) {
            return Response.json(
                { error: 'Database configuration missing' },
                { status: 500 }
            );
        }

        await databases.deleteDocument(
            DATABASE_ID,
            CUSTOMERS_COLLECTION_ID,
            customerId
        );

        return NextResponse.json({ success: true, message: 'Customer deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting customer:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete customer' },
            { status: error.code || 500 }
        );
    }
}
