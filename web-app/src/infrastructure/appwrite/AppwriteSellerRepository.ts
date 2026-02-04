/**
 * Appwrite Seller Repository Implementation
 */
import { ID, Query } from 'node-appwrite';
import { ISellerRepository } from '@/core/repositories/ISellerRepository';
import { Seller, CreateSellerDTO, UpdateSellerDTO, BusinessType, SubscriptionPlan } from '@/core/entities/Seller';
import { getAppwriteServerClient } from './client';
import { Databases } from 'node-appwrite';
import { config } from '../config/env';

export class AppwriteSellerRepository implements ISellerRepository {
    private db: Databases;
    private databaseId: string;
    private collectionId: string;

    constructor() {
        const client = getAppwriteServerClient();
        this.db = new Databases(client);
        this.databaseId = config.appwrite.databaseId;
        this.collectionId = process.env.APPWRITE_SELLERS_COLLECTION_ID || 'sellers';
    }

    async findById(id: string): Promise<Seller | null> {
        try {
            const doc = await this.db.getDocument(
                this.databaseId,
                this.collectionId,
                id
            );
            return this.mapToSeller(doc);
        } catch (error) {
            return null;
        }
    }

    async findByEmail(email: string): Promise<Seller | null> {
        try {
            const response = await this.db.listDocuments(
                this.databaseId,
                this.collectionId,
                [Query.equal('email', email)]
            );

            if (response.documents.length === 0) return null;
            return this.mapToSeller(response.documents[0]);
        } catch (error) {
            return null;
        }
    }

    async findByGSTNumber(gstNumber: string): Promise<Seller | null> {
        try {
            const response = await this.db.listDocuments(
                this.databaseId,
                this.collectionId,
                [Query.equal('gstNumber', gstNumber)]
            );

            if (response.documents.length === 0) return null;
            return this.mapToSeller(response.documents[0]);
        } catch (error) {
            return null;
        }
    }

    async create(data: CreateSellerDTO & { password: string }): Promise<Seller> {
        const doc = await this.db.createDocument(
            this.databaseId,
            this.collectionId,
            ID.unique(),
            {
                companyName: data.companyName,
                ownerName: data.ownerName,
                gstNumber: data.gstNumber,
                email: data.email,
                phone: data.phone,
                addressStreet: data.address.street,
                addressCity: data.address.city,
                addressState: data.address.state,
                addressPincode: data.address.pincode,
                addressCountry: data.address.country,
                businessType: data.businessType,
                logoUrl: '',
                subscriptionPlan: SubscriptionPlan.FREE,
                isActive: true,
                setupCompleted: false,
                passwordHash: data.password, // Already hashed by API
            }
        );

        return this.mapToSeller(doc);
    }

    async update(id: string, data: UpdateSellerDTO): Promise<Seller> {
        const updateData: any = {};

        if (data.companyName) updateData.companyName = data.companyName;
        if (data.ownerName) updateData.ownerName = data.ownerName;
        if (data.phone) updateData.phone = data.phone;
        if (data.businessType) updateData.businessType = data.businessType;
        if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl;

        if (data.address) {
            updateData.addressStreet = data.address.street;
            updateData.addressCity = data.address.city;
            updateData.addressState = data.address.state;
            updateData.addressPincode = data.address.pincode;
            updateData.addressCountry = data.address.country;
        }

        const doc = await this.db.updateDocument(
            this.databaseId,
            this.collectionId,
            id,
            updateData
        );

        return this.mapToSeller(doc);
    }

    async delete(id: string): Promise<void> {
        // Soft delete - set isActive to false
        await this.db.updateDocument(
            this.databaseId,
            this.collectionId,
            id,
            { isActive: false }
        );
    }

    async markSetupCompleted(id: string): Promise<void> {
        await this.db.updateDocument(
            this.databaseId,
            this.collectionId,
            id,
            { setupCompleted: true }
        );
    }

    async findAll(filters?: {
        isActive?: boolean;
        businessType?: string;
        subscriptionPlan?: string;
    }): Promise<Seller[]> {
        const queries: string[] = [];

        if (filters?.isActive !== undefined) {
            queries.push(Query.equal('isActive', filters.isActive));
        }
        if (filters?.businessType) {
            queries.push(Query.equal('businessType', filters.businessType));
        }
        if (filters?.subscriptionPlan) {
            queries.push(Query.equal('subscriptionPlan', filters.subscriptionPlan));
        }

        const response = await this.db.listDocuments(
            this.databaseId,
            this.collectionId,
            queries
        );

        return response.documents.map(doc => this.mapToSeller(doc));
    }

    private mapToSeller(doc: any): Seller {
        return {
            id: doc.$id,
            companyName: doc.companyName,
            ownerName: doc.ownerName,
            gstNumber: doc.gstNumber,
            email: doc.email,
            phone: doc.phone,
            address: {
                street: doc.addressStreet,
                city: doc.addressCity,
                state: doc.addressState,
                pincode: doc.addressPincode,
                country: doc.addressCountry,
            },
            businessType: doc.businessType as BusinessType,
            logoUrl: doc.logoUrl,
            subscriptionPlan: doc.subscriptionPlan as SubscriptionPlan,
            isActive: doc.isActive,
            setupCompleted: doc.setupCompleted,
            createdAt: new Date(doc.$createdAt),
            updatedAt: new Date(doc.$updatedAt),
        };
    }
}
