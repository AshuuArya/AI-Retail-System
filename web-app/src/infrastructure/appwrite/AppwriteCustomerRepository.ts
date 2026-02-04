/**
 * Appwrite Customer Repository Implementation
 */
import { ID, Query, Databases } from 'node-appwrite';
import { ICustomerRepository, Customer, CreateCustomerDTO } from '@/core/repositories/ICustomerRepository';
import { getAppwriteServerClient } from './client';
import { config } from '../config/env';

export class AppwriteCustomerRepository implements ICustomerRepository {
    private db: Databases;
    private databaseId: string;
    private collectionId: string;

    constructor() {
        const client = getAppwriteServerClient();
        this.db = new Databases(client);
        this.databaseId = config.appwrite.databaseId;
        this.collectionId = config.appwrite.collections.customers;
    }

    async findAll(sellerId: string): Promise<Customer[]> {
        const response = await this.db.listDocuments(
            this.databaseId,
            this.collectionId,
            [Query.equal('sellerId', sellerId)]
        );

        return response.documents.map(doc => this.mapToCustomer(doc));
    }

    async findById(id: string): Promise<Customer | null> {
        try {
            const doc = await this.db.getDocument(
                this.databaseId,
                this.collectionId,
                id
            );
            return this.mapToCustomer(doc);
        } catch (error) {
            return null;
        }
    }

    async create(data: CreateCustomerDTO): Promise<Customer> {
        const doc = await this.db.createDocument(
            this.databaseId,
            this.collectionId,
            ID.unique(),
            {
                sellerId: data.sellerId,
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address || '',
                totalSpending: 0,
            }
        );

        return this.mapToCustomer(doc);
    }

    async update(id: string, data: Partial<CreateCustomerDTO>): Promise<Customer> {
        const doc = await this.db.updateDocument(
            this.databaseId,
            this.collectionId,
            id,
            data
        );

        return this.mapToCustomer(doc);
    }

    async delete(id: string): Promise<void> {
        await this.db.deleteDocument(
            this.databaseId,
            this.collectionId,
            id
        );
    }

    private mapToCustomer(doc: any): Customer {
        return {
            id: doc.$id,
            sellerId: doc.sellerId,
            name: doc.name,
            email: doc.email,
            phone: doc.phone,
            address: doc.address,
            totalSpending: doc.totalSpending || 0,
            lastPurchaseDate: doc.lastPurchaseDate ? new Date(doc.lastPurchaseDate) : undefined,
            createdAt: new Date(doc.$createdAt),
            updatedAt: new Date(doc.$updatedAt),
        };
    }
}
