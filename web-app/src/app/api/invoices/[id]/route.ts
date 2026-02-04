import { NextRequest, NextResponse } from 'next/server';
import { AppwriteInvoiceRepository } from '@/infrastructure/appwrite/AppwriteInvoiceRepository';
import { AppwriteProductRepository } from '@/infrastructure/appwrite/AppwriteProductRepository';
import { AppwriteCustomerRepository } from '@/infrastructure/appwrite/AppwriteCustomerRepository';
import { ManageInvoicesUseCase } from '@/core/use-cases/ManageInvoicesUseCase';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const invoiceRepo = new AppwriteInvoiceRepository();
        const productRepo = new AppwriteProductRepository();
        const customerRepo = new AppwriteCustomerRepository();
        const useCase = new ManageInvoicesUseCase(invoiceRepo, productRepo, customerRepo);

        const invoice = await useCase.getInvoiceById(params.id);

        if (!invoice) {
            return NextResponse.json(
                { message: 'Invoice not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ invoice });
    } catch (error: any) {
        console.error('Error fetching invoice:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch invoice' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json(
                { message: 'Status is required' },
                { status: 400 }
            );
        }

        const invoiceRepo = new AppwriteInvoiceRepository();
        const invoice = await invoiceRepo.updateStatus(params.id, status);

        return NextResponse.json({ invoice });
    } catch (error: any) {
        console.error('Error updating invoice:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to update invoice' },
            { status: 500 }
        );
    }
}
