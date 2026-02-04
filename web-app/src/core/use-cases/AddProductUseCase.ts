/**
 * Add Product Use Case
 * Handles product creation with AI enrichment
 */
import { IProductRepository } from '../repositories/IProductRepository';
import { IAIService } from '../repositories/IAIService';
import { CreateProductDTO, Product } from '../entities/Product';

export class AddProductUseCase {
    constructor(
        private productRepository: IProductRepository,
        private aiService: IAIService
    ) { }

    async execute(data: CreateProductDTO, useAI: boolean = true): Promise<Product> {
        let enrichedData = { ...data };

        // If AI is enabled and description/category is missing, enrich with AI
        if (useAI && (!data.userEditedDescription || !data.category)) {
            try {
                const enrichment = await this.aiService.enrichProduct({
                    name: data.itemName,
                    existingDescription: data.userEditedDescription,
                });

                enrichedData = {
                    ...enrichedData,
                    userEditedDescription: data.userEditedDescription || enrichment.description,
                    category: data.category || enrichment.category,
                };
            } catch (error) {
                console.error('AI enrichment failed, using provided data:', error);
                // Continue with original data if AI fails
            }
        }

        // Create the product
        return await this.productRepository.create(enrichedData);
    }
}
