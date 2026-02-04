/**
 * Seller Settings Repository Interface
 * Defines operations for seller settings data access
 */

import { SellerSettings, CreateSellerSettingsDTO, UpdateSellerSettingsDTO } from '../entities/SellerSettings';

export interface ISellerSettingsRepository {
    /**
     * Find settings by seller ID
     */
    findBySellerId(sellerId: string): Promise<SellerSettings | null>;

    /**
     * Create new seller settings
     */
    create(data: CreateSellerSettingsDTO): Promise<SellerSettings>;

    /**
     * Update seller settings
     */
    update(sellerId: string, data: UpdateSellerSettingsDTO): Promise<SellerSettings>;

    /**
     * Delete seller settings
     */
    delete(sellerId: string): Promise<void>;
}
