/**
 * Appwrite Invoice Repository Implementation
 */
import { ID, Query, Databases } from 'node-appwrite';
import { IInvoiceRepository, Invoice, CreateInvoiceDTO } from '@/core/repositories/IInvoiceRepository';
import { getAppwriteServerClient } from './client';
import { config } from '../config/env';

export class AppwriteInvoiceRepository implements IInvoiceRepository {
    private db: Databases;
    private databaseId: string;
    private collectionId: string;

    constructor() {
        const client = getAppwriteServerClient();
        this.db = new Databases(client);
        this.databaseId = config.appwrite.databaseId;
        this.collectionId = config.appwrite.collections.invoices;
    }

    async findAll(sellerId: string): Promise<Invoice[]> {
        const response = await this.db.listDocuments(
            this.databaseId,
            this.collectionId,
            [Query.equal('sellerId', sellerId), Query.orderDesc('$createdAt')]
        );

        return response.documents.map(doc => this.mapToInvoice(doc));
    }

    async findById(id: string): Promise<Invoice | null> {
        try {
            const doc = await this.db.getDocument(
                this.databaseId,
                this.collectionId,
                id
            );
            return this.mapToInvoice(doc);
        } catch (error) {
            return null;
        }
    }

    async create(data: CreateInvoiceDTO): Promise<Invoice> {
        const doc = await this.db.createDocument(
            this.databaseId,
            this.collectionId,
            ID.unique(),
            {
                sellerId: data.sellerId,
                customerId: data.customerId,
                invoiceNumber: `INV-${Date.now()}-${ID.unique().substring(0, 5).toUpperCase()}`,
                invoiceDate: new Date().toISOString(),
                items: JSON.stringify(data.items),
                subtotal: data.subtotal,
                discount: data.discount,
                total: data.total,
                paymentMethod: data.paymentMethod,
                notes: data.notes || '',
                status: data.status,
            }
        );

        return this.mapToInvoice(doc);
    }

    async updateStatus(id: string, status: string): Promise<Invoice> {
        const doc = await this.db.updateDocument(
            this.databaseId,
            this.collectionId,
            id,
            { status }
        );

        return this.mapToInvoice(doc);
    }

    private mapToInvoice(doc: any): Invoice {
        return {
            id: doc.$id,
            sellerId: doc.sellerId,
            customerId: doc.customerId,
            customerName: doc.customerName || '',
            invoiceNumber: doc.invoiceNumber,
            invoiceDate: doc.invoiceDate,
            items: JSON.parse(doc.items),
            subtotal: doc.subtotal,
            discount: doc.discount,
            total: doc.total,
            paymentMethod: doc.paymentMethod,
            notes: doc.notes,
            status: doc.status,
            createdAt: new Date(doc.$createdAt),
            updatedAt: new Date(doc.$updatedAt),
        };
    }
}
