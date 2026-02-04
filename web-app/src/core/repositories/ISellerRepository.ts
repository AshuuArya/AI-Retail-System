/**
 * Seller Repository Interface
 * Defines operations for seller data access
 */

import { Seller, CreateSellerDTO, UpdateSellerDTO } from '../entities/Seller';

export interface ISellerRepository {
    /**
     * Find seller by ID
     */
    findById(id: string): Promise<Seller | null>;

    /**
     * Find seller by email
     */
    findByEmail(email: string): Promise<Seller | null>;

    /**
     * Find seller by GST number
     */
    findByGSTNumber(gstNumber: string): Promise<Seller | null>;

    /**
     * Create new seller
     */
    create(data: CreateSellerDTO): Promise<Seller>;

    /**
     * Update seller
     */
    update(id: string, data: UpdateSellerDTO): Promise<Seller>;

    /**
     * Delete seller (soft delete - set isActive to false)
     */
    delete(id: string): Promise<void>;

    /**
     * Mark setup as completed
     */
    markSetupCompleted(id: string): Promise<void>;

    /**
     * Get all sellers (admin function)
     */
    findAll(filters?: {
        isActive?: boolean;
        businessType?: string;
        subscriptionPlan?: string;
    }): Promise<Seller[]>;
}
