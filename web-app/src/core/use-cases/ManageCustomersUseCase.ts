/**
 * Manage Customers Use Case
 * Handles CRUD operations for customers
 */
import { ICustomerRepository, Customer, CreateCustomerDTO } from '../repositories/ICustomerRepository';

export class ManageCustomersUseCase {
    constructor(private customerRepository: ICustomerRepository) { }

    async getCustomers(sellerId: string, search?: string): Promise<Customer[]> {
        if (search) {
            return await this.customerRepository.search(search, sellerId);
        }
        return await this.customerRepository.findAll(sellerId);
    }

    async createCustomer(data: CreateCustomerDTO): Promise<Customer> {
        if (!data.name || !data.sellerId) {
            throw new Error('Name and Seller ID are required');
        }
        return await this.customerRepository.create(data);
    }

    async updateCustomer(id: string, data: Partial<CreateCustomerDTO>): Promise<Customer> {
        return await this.customerRepository.update(id, data);
    }

    async deleteCustomer(id: string): Promise<void> {
        await this.customerRepository.delete(id);
    }
}
