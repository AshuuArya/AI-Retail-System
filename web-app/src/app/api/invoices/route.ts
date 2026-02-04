import { NextRequest, NextResponse } from 'next/server';
import { AppwriteInvoiceRepository } from '@/infrastructure/appwrite/AppwriteInvoiceRepository';
import { AppwriteProductRepository } from '@/infrastructure/appwrite/AppwriteProductRepository';
import { AppwriteCustomerRepository } from '@/infrastructure/appwrite/AppwriteCustomerRepository';
import { ManageInvoicesUseCase } from '@/core/use-cases/ManageInvoicesUseCase';
import { CreateInvoiceDTO } from '@/core/repositories/IInvoiceRepository';

// Initialize dependencies
const invoiceRepository = new AppwriteInvoiceRepository();
const productRepository = new AppwriteProductRepository();
const customerRepository = new AppwriteCustomerRepository();
const manageInvoicesUseCase = new ManageInvoicesUseCase(invoiceRepository, productRepository, customerRepository);

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

        const invoices = await manageInvoicesUseCase.getInvoices(sellerId);

        return NextResponse.json({ invoices });
    } catch (error: any) {
        console.error('Error fetching invoices:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch invoices' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            sellerId,
            customerId,
            items,
            subtotal,
            discount,
            total,
            paymentMethod,
            notes,
            status = 'paid'
        } = body;

        if (!sellerId || !customerId || !items || items.length === 0) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const invoiceData: CreateInvoiceDTO = {
            sellerId,
            customerId,
            items,
            subtotal,
            discount,
            total,
            paymentMethod,
            notes: notes || '',
            status
        };

        const invoice = await manageInvoicesUseCase.createInvoice(invoiceData);

        return NextResponse.json({ invoice }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating invoice:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to create invoice' },
            { status: 500 }
        );
    }
}
