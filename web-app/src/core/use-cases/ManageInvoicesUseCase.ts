/**
 * Manage Invoices Use Case
 * Handles CRUD operations for invoices
 */
import { IInvoiceRepository, Invoice, CreateInvoiceDTO } from '../repositories/IInvoiceRepository';
import { IProductRepository } from '../repositories/IProductRepository';
import { ICustomerRepository } from '../repositories/ICustomerRepository';

export class ManageInvoicesUseCase {
    constructor(
        private invoiceRepository: IInvoiceRepository,
        private productRepository: IProductRepository,
        private customerRepository: ICustomerRepository
    ) { }

    async getInvoices(sellerId: string): Promise<Invoice[]> {
        return await this.invoiceRepository.findAll(sellerId);
    }

    async getInvoiceById(id: string): Promise<Invoice | null> {
        return await this.invoiceRepository.findById(id);
    }

    async createInvoice(data: CreateInvoiceDTO): Promise<Invoice> {
        // 1. Create the invoice
        const invoice = await this.invoiceRepository.create(data);

        // 2. Update product stock
        for (const item of data.items) {
            try {
                const product = await this.productRepository.findById(item.productId);
                if (product) {
                    await this.productRepository.updateQuantity(item.productId, Math.max(0, product.quantity - item.quantity));
                }
            } catch (error) {
                console.error(`Failed to update stock for product ${item.productId}:`, error);
            }
        }

        // 3. Update customer total spending
        try {
            const customer = await this.customerRepository.findById(data.customerId);
            if (customer) {
                await this.customerRepository.update(data.customerId, {
                    totalSpending: (customer.totalSpending || 0) + data.total
                });
            }
        } catch (error) {
            console.error(`Failed to update customer spending for ${data.customerId}:`, error);
        }

        return invoice;
    }
}
