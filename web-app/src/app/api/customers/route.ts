import { NextRequest, NextResponse } from 'next/server';
import { AppwriteCustomerRepository } from '@/infrastructure/appwrite/AppwriteCustomerRepository';
import { ManageCustomersUseCase } from '@/core/use-cases/ManageCustomersUseCase';
import { CreateCustomerDTO } from '@/core/repositories/ICustomerRepository';

// Initialize dependencies
const customerRepository = new AppwriteCustomerRepository();
const manageCustomersUseCase = new ManageCustomersUseCase(customerRepository);

// GET - List all customers for a seller
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

        const customers = await manageCustomersUseCase.getCustomers(sellerId);

        return NextResponse.json({
            customers,
            total: customers.length
        });
    } catch (error: any) {
        console.error('Error fetching customers:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch customers' },
            { status: 500 }
        );
    }
}

// POST - Create a new customer
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            sellerId,
            name,
            email,
            phone,
            address
        } = body;

        if (!sellerId || !name) {
            return NextResponse.json(
                { message: 'Seller ID and name are required' },
                { status: 400 }
            );
        }

        const customerData: CreateCustomerDTO = {
            sellerId,
            name,
            email: email || '',
            phone: phone || '',
            address: address || ''
        };

        const customer = await manageCustomersUseCase.createCustomer(customerData);

        return NextResponse.json({
            message: 'Customer created successfully',
            customer
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating customer:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to create customer' },
            { status: 500 }
        );
    }
}
