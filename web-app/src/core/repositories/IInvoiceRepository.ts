/**
 * Invoice Repository Interface
 */
export interface InvoiceItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface Invoice {
    id: string;
    sellerId: string;
    customerId: string;
    customerName: string;
    invoiceNumber: string;
    invoiceDate: string;
    items: InvoiceItem[];
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: string;
    notes?: string;
    status: 'paid' | 'pending' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateInvoiceDTO {
    sellerId: string;
    customerId: string;
    items: InvoiceItem[];
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: string;
    notes?: string;
    status: 'paid' | 'pending' | 'cancelled';
}

export interface IInvoiceRepository {
    findAll(sellerId: string): Promise<Invoice[]>;
    findById(id: string): Promise<Invoice | null>;
    create(data: CreateInvoiceDTO): Promise<Invoice>;
    updateStatus(id: string, status: string): Promise<Invoice>;
}
