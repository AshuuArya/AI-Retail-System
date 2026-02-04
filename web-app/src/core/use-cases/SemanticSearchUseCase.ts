/**
 * Semantic Search Use Case
 * Business logic for AI-powered product search
 */
import { IProductRepository } from '../repositories/IProductRepository';
import { IAIService } from '../repositories/IAIService';
import { Product } from '../entities/Product';

export class SemanticSearchUseCase {
    constructor(
        private productRepository: IProductRepository,
        private aiService: IAIService
    ) { }

    async execute(query: string, shopId: string): Promise<Product[]> {
        // Get all products for the shop
        const products = await this.productRepository.findAll(shopId);

        // If no query, return all products
        if (!query || query.trim() === '') {
            return products;
        }

        // Use AI to perform semantic search
        const results = await this.aiService.semanticSearch(
            { query, shopId },
            products
        );

        return results;
    }
}
