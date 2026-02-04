import { AIQuery, AIProductEnrichment, AIEnrichmentResult } from '../entities/AIQuery';
import { Product } from '../entities/Product';

export interface IAIService {
    semanticSearch(query: AIQuery, products: Product[]): Promise<Product[]>;
    enrichProduct(data: AIProductEnrichment): Promise<AIEnrichmentResult>;
    generateDescription(productName: string): Promise<string>;
    categorizeProduct(productName: string, description?: string): Promise<string>;
}
