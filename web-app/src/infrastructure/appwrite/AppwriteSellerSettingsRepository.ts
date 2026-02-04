/**
 * Appwrite Seller Settings Repository Implementation
 */
import { ID, Query } from 'node-appwrite';
import { ISellerSettingsRepository } from '@/core/repositories/ISellerSettingsRepository';
import { SellerSettings, CreateSellerSettingsDTO, UpdateSellerSettingsDTO } from '@/core/entities/SellerSettings';
import { getAppwriteServerClient } from './client';
import { Databases } from 'node-appwrite';
import { config } from '../config/env';

export class AppwriteSellerSettingsRepository implements ISellerSettingsRepository {
    private db: Databases;
    private databaseId: string;
    private collectionId: string;

    constructor() {
        const client = getAppwriteServerClient();
        this.db = new Databases(client);
        this.databaseId = config.appwrite.databaseId;
        this.collectionId = process.env.APPWRITE_SELLER_SETTINGS_COLLECTION_ID || 'seller_settings';
    }

    async findBySellerId(sellerId: string): Promise<SellerSettings | null> {
        try {
            const response = await this.db.listDocuments(
                this.databaseId,
                this.collectionId,
                [Query.equal('sellerId', sellerId)]
            );

            if (response.documents.length === 0) return null;
            return this.mapToSettings(response.documents[0]);
        } catch (error) {
            return null;
        }
    }

    async create(data: CreateSellerSettingsDTO): Promise<SellerSettings> {
        const doc = await this.db.createDocument(
            this.databaseId,
            this.collectionId,
            ID.unique(),
            {
                sellerId: data.sellerId,
                enabledFields: JSON.stringify(data.enabledFields),
                customFields: JSON.stringify(data.customFields),
                aiImageEnabled: data.aiImageEnabled,
                aiDescriptionEnabled: data.aiDescriptionEnabled,
                currency: data.currency || 'INR',
                taxSettings: JSON.stringify(data.taxSettings || {}),
                inventoryAlerts: JSON.stringify({
                    lowStockThreshold: 10,
                    enableEmailAlerts: false,
                    enableSMSAlerts: false,
                }),
            }
        );

        return this.mapToSettings(doc);
    }

    async update(sellerId: string, data: UpdateSellerSettingsDTO): Promise<SellerSettings> {
        // First find the document by sellerId
        const existing = await this.findBySellerId(sellerId);
        if (!existing) {
            throw new Error('Settings not found for seller');
        }

        const updateData: any = {};

        if (data.enabledFields) updateData.enabledFields = JSON.stringify(data.enabledFields);
        if (data.customFields) updateData.customFields = JSON.stringify(data.customFields);
        if (data.aiImageEnabled !== undefined) updateData.aiImageEnabled = data.aiImageEnabled;
        if (data.aiDescriptionEnabled !== undefined) updateData.aiDescriptionEnabled = data.aiDescriptionEnabled;
        if (data.currency) updateData.currency = data.currency;
        if (data.taxSettings) updateData.taxSettings = JSON.stringify(data.taxSettings);
        if (data.inventoryAlerts) updateData.inventoryAlerts = JSON.stringify(data.inventoryAlerts);

        // Get the document ID from the existing settings
        const response = await this.db.listDocuments(
            this.databaseId,
            this.collectionId,
            [Query.equal('sellerId', sellerId)]
        );

        const doc = await this.db.updateDocument(
            this.databaseId,
            this.collectionId,
            response.documents[0].$id,
            updateData
        );

        return this.mapToSettings(doc);
    }

    async delete(sellerId: string): Promise<void> {
        const response = await this.db.listDocuments(
            this.databaseId,
            this.collectionId,
            [Query.equal('sellerId', sellerId)]
        );

        if (response.documents.length > 0) {
            await this.db.deleteDocument(
                this.databaseId,
                this.collectionId,
                response.documents[0].$id
            );
        }
    }

    private mapToSettings(doc: any): SellerSettings {
        return {
            sellerId: doc.sellerId,
            enabledFields: JSON.parse(doc.enabledFields || '[]'),
            customFields: JSON.parse(doc.customFields || '[]'),
            aiImageEnabled: doc.aiImageEnabled,
            aiDescriptionEnabled: doc.aiDescriptionEnabled,
            currency: doc.currency,
            taxSettings: JSON.parse(doc.taxSettings || '{}'),
            inventoryAlerts: JSON.parse(doc.inventoryAlerts || '{}'),
            createdAt: new Date(doc.$createdAt),
            updatedAt: new Date(doc.$updatedAt),
        };
    }
}
