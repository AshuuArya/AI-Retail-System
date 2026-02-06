import { NextRequest, NextResponse } from 'next/server';
import { AppwriteCustomerRepository } from '@/infrastructure/appwrite/AppwriteCustomerRepository';
import { ManageCustomersUseCase } from '@/core/use-cases/ManageCustomersUseCase';
import { CreateCustomerDTO } from '@/core/repositories/ICustomerRepository';

// Initialize dependencies
const customerRepository = new AppwriteCustomerRepository();
const manageCustomersUseCase = new ManageCustomersUseCase(customerRepository);

// GET single customer
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const customer = await customerRepository.findById(id);

        if (!customer) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(customer);
    } catch (error: any) {
        console.error('Error fetching customer:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch customer' },
            { status: 500 }
        );
    }
}

// PUT (update) customer
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Use repository to update
        const updatedCustomer = await customerRepository.update(id, body as Partial<CreateCustomerDTO>);

        return NextResponse.json(updatedCustomer);
    } catch (error: any) {
        console.error('Error updating customer:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update customer' },
            { status: 500 }
        );
    }
}

// DELETE customer
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await customerRepository.delete(id);

        return NextResponse.json({ success: true, message: 'Customer deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting customer:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete customer' },
            { status: 500 }
        );
    }
}
