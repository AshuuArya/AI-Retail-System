/**
 * Get Products Use Case
 * Handles product listing for a specific seller
 */
import { IProductRepository } from '../repositories/IProductRepository';
import { Product } from '../entities/Product';

export class GetProductsUseCase {
    constructor(private productRepository: IProductRepository) { }

    async execute(sellerId: string, search?: string, category?: string): Promise<Product[]> {
        if (!sellerId) {
            throw new Error('Seller ID is required');
        }

        if (search || category) {
            return await this.productRepository.search(search || '', sellerId, category);
        }

        return await this.productRepository.findAll(sellerId);
    }
}
