/**
 * Customer Repository Interface
 */
export interface Customer {
    id: string;
    sellerId: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city?: string;
    state?: string;
    pincode?: string;
    notes?: string;
    totalSpending: number;
    lastPurchaseDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCustomerDTO {
    sellerId: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    notes?: string;
    totalSpending?: number;
}

export interface ICustomerRepository {
    findAll(sellerId: string): Promise<Customer[]>;
    findById(id: string): Promise<Customer | null>;
    create(data: CreateCustomerDTO): Promise<Customer>;
    update(id: string, data: Partial<CreateCustomerDTO>): Promise<Customer>;
    delete(id: string): Promise<void>;
    search(query: string, sellerId: string): Promise<Customer[]>;
}
