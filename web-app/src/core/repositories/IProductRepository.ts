/**
 * Product Repository Interface
 * This is the contract that infrastructure must implement
 * NO IMPLEMENTATION HERE - just the interface
 */
import { Product, CreateProductDTO, UpdateProductDTO } from '../entities/Product';

export interface IProductRepository {
    /**
     * Find all products for a shop
     */
    findAll(shopId: string): Promise<Product[]>;

    /**
     * Find product by ID
     */
    findById(id: string): Promise<Product | null>;

    /**
     * Create a new product
     */
    create(data: CreateProductDTO): Promise<Product>;

    /**
     * Update an existing product
     */
    update(id: string, data: UpdateProductDTO): Promise<Product>;

    /**
     * Delete a product
     */
    delete(id: string): Promise<void>;

    /**
     * Search products by name or description
     */
    search(query: string, shopId: string, category?: string): Promise<Product[]>;

    /**
     * Update product quantity (for inventory management)
     */
    updateQuantity(id: string, quantity: number): Promise<Product>;
}
