/**
 * Appwrite Product Repository Implementation
 */
import { ID, Query, Databases } from 'node-appwrite';
import { IProductRepository } from '@/core/repositories/IProductRepository';
import { Product, CreateProductDTO, UpdateProductDTO } from '@/core/entities/Product';
import { getAppwriteServerClient } from './client';
import { config } from '../config/env';

export class AppwriteProductRepository implements IProductRepository {
    private db: Databases;
    private databaseId: string;
    private collectionId: string;

    constructor() {
        const client = getAppwriteServerClient();
        this.db = new Databases(client);
        this.databaseId = config.appwrite.databaseId;
        this.collectionId = config.appwrite.collections.products;
    }

    async findAll(sellerId: string): Promise<Product[]> {
        const response = await this.db.listDocuments(
            this.databaseId,
            this.collectionId,
            [Query.equal('sellerId', sellerId)]
        );

        return response.documents.map(doc => this.mapToProduct(doc));
    }

    async findById(id: string): Promise<Product | null> {
        try {
            const doc = await this.db.getDocument(
                this.databaseId,
                this.collectionId,
                id
            );
            return this.mapToProduct(doc);
        } catch (error) {
            return null;
        }
    }

    async create(data: CreateProductDTO): Promise<Product> {
        const doc = await this.db.createDocument(
            this.databaseId,
            this.collectionId,
            ID.unique(),
            {
                sellerId: data.sellerId,
                itemId: data.itemId,
                itemName: data.itemName,
                category: data.category,
                quantity: data.quantity,
                costPrice: data.costPrice,
                sellPrice: data.sellPrice,
                additionalFields: JSON.stringify(data.additionalFields || {}),
                customImageUrl: data.customImageUrl || '',
                userEditedDescription: data.userEditedDescription || '',
                lowStockThreshold: data.lowStockThreshold || 10,
                unit: data.unit || 'piece',
                brand: data.brand || '',
                tags: data.tags || [],
                isActive: data.isActive !== undefined ? data.isActive : true,
                barcode: data.barcode || '',
            }
        );

        return this.mapToProduct(doc);
    }

    async update(id: string, data: UpdateProductDTO): Promise<Product> {
        const updateData: any = {};
        const allowedFields = [
            'itemId', 'itemName', 'category', 'quantity', 'costPrice', 'sellPrice',
            'additionalFields', 'aiGeneratedImageUrl', 'aiGeneratedDescription',
            'customImageUrl', 'userEditedDescription', 'lowStockThreshold',
            'unit', 'brand', 'tags', 'isActive', 'barcode'
        ];

        allowedFields.forEach(field => {
            if ((data as any)[field] !== undefined) {
                updateData[field] = (data as any)[field];
            }
        });

        if (data.additionalFields) {
            updateData.additionalFields = JSON.stringify(data.additionalFields);
        }

        const doc = await this.db.updateDocument(
            this.databaseId,
            this.collectionId,
            id,
            updateData
        );

        return this.mapToProduct(doc);
    }

    async delete(id: string): Promise<void> {
        await this.db.deleteDocument(
            this.databaseId,
            this.collectionId,
            id
        );
    }

    async search(query: string, sellerId: string, category?: string): Promise<Product[]> {
        const queries = [Query.equal('sellerId', sellerId)];

        if (query) {
            queries.push(Query.search('itemName', query));
        }

        if (category && category !== 'all') {
            queries.push(Query.equal('category', category));
        }

        const response = await this.db.listDocuments(
            this.databaseId,
            this.collectionId,
            queries
        );

        return response.documents.map(doc => this.mapToProduct(doc));
    }

    async updateQuantity(id: string, quantity: number): Promise<Product> {
        const doc = await this.db.updateDocument(
            this.databaseId,
            this.collectionId,
            id,
            { quantity }
        );

        return this.mapToProduct(doc);
    }

    private mapToProduct(doc: any): Product {
        return {
            id: doc.$id,
            sellerId: doc.sellerId,
            itemId: doc.itemId || doc.sku || doc.$id,
            itemName: doc.itemName || doc.name || 'Unnamed Product',
            category: doc.category,
            quantity: doc.quantity ?? doc.stock ?? 0,
            costPrice: doc.costPrice || 0,
            sellPrice: doc.sellPrice ?? doc.price ?? 0,
            additionalFields: doc.additionalFields ? JSON.parse(doc.additionalFields) : {},
            aiGeneratedImageUrl: doc.aiGeneratedImageUrl,
            aiGeneratedDescription: doc.aiGeneratedDescription,
            customImageUrl: doc.customImageUrl,
            userEditedDescription: doc.userEditedDescription || doc.description,
            lowStockThreshold: doc.lowStockThreshold || 10,
            unit: doc.unit || 'piece',
            brand: doc.brand || '',
            tags: doc.tags || [],
            isActive: doc.isActive ?? true,
            barcode: doc.barcode || '',
            createdAt: new Date(doc.$createdAt),
            updatedAt: new Date(doc.$updatedAt),
        };
    }
}
