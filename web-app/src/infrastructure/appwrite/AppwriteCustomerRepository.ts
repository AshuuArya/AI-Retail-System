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
                city: data.city || '',
                state: data.state || '',
                pincode: data.pincode || '',
                notes: data.notes || '',
                totalSpending: 0,
            }
        );

        return this.mapToCustomer(doc);
    }

    async update(id: string, data: Partial<CreateCustomerDTO>): Promise<Customer> {
        const updateData: any = {};
        if (data.name) updateData.name = data.name;
        if (data.email !== undefined) updateData.email = data.email;
        if (data.phone) updateData.phone = data.phone;
        if (data.address !== undefined) updateData.address = data.address;
        if (data.city !== undefined) updateData.city = data.city;
        if (data.state !== undefined) updateData.state = data.state;
        if (data.pincode !== undefined) updateData.pincode = data.pincode;
        if (data.notes !== undefined) updateData.notes = data.notes;
        if (data.totalSpending !== undefined) updateData.totalSpending = data.totalSpending;

        const doc = await this.db.updateDocument(
            this.databaseId,
            this.collectionId,
            id,
            updateData
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

    async search(query: string, sellerId: string): Promise<Customer[]> {
        const response = await this.db.listDocuments(
            this.databaseId,
            this.collectionId,
            [
                Query.equal('sellerId', sellerId),
                Query.search('name', query)
            ]
        );

        return response.documents.map(doc => this.mapToCustomer(doc));
    }

    private mapToCustomer(doc: any): Customer {
        return {
            id: doc.$id,
            sellerId: doc.sellerId,
            name: doc.name,
            email: doc.email,
            phone: doc.phone,
            address: doc.address,
            city: doc.city,
            state: doc.state,
            pincode: doc.pincode,
            notes: doc.notes,
            totalSpending: doc.totalSpending || 0,
            lastPurchaseDate: doc.lastPurchaseDate ? new Date(doc.lastPurchaseDate) : undefined,
            createdAt: new Date(doc.$createdAt),
            updatedAt: new Date(doc.$updatedAt),
        };
    }
}
