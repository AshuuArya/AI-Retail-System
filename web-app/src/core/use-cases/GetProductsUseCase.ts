/**
 * Get Products Use Case
 * Handles product listing for a specific seller
 */
import { IProductRepository } from '../repositories/IProductRepository';
import { Product } from '../entities/Product';

export class GetProductsUseCase {
    constructor(private productRepository: IProductRepository) { }

    async execute(sellerId: string): Promise<Product[]> {
        if (!sellerId) {
            throw new Error('Seller ID is required');
        }

        return await this.productRepository.findAll(sellerId);
    }
}
