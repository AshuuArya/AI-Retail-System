/**
 * Utility functions for exporting data to CSV format
 */

export interface ExportColumn {
    key: string;
    label: string;
    format?: (value: any) => string;
}

/**
 * Convert array of objects to CSV string
 */
export function convertToCSV(data: any[], columns: ExportColumn[]): string {
    if (!data || data.length === 0) {
        return '';
    }

    // Create header row
    const headers = columns.map(col => col.label).join(',');

    // Create data rows
    const rows = data.map(item => {
        return columns.map(col => {
            let value = item[col.key];

            // Apply custom formatting if provided
            if (col.format && value !== undefined && value !== null) {
                value = col.format(value);
            }

            // Handle null/undefined
            if (value === null || value === undefined) {
                return '';
            }

            // Convert to string and escape quotes
            const stringValue = String(value).replace(/"/g, '""');

            // Wrap in quotes if contains comma, newline, or quote
            if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
                return `"${stringValue}"`;
            }

            return stringValue;
        }).join(',');
    });

    return [headers, ...rows].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

/**
 * Export products to CSV
 */
export function exportProductsToCSV(products: any[]): void {
    const columns: ExportColumn[] = [
        { key: 'name', label: 'Product Name' },
        { key: 'sku', label: 'SKU' },
        { key: 'barcode', label: 'Barcode' },
        { key: 'category', label: 'Category' },
        { key: 'brand', label: 'Brand' },
        { key: 'description', label: 'Description' },
        { key: 'price', label: 'Price', format: (v) => `₹${v}` },
        { key: 'costPrice', label: 'Cost Price', format: (v) => `₹${v}` },
        { key: 'stock', label: 'Stock' },
        { key: 'unit', label: 'Unit' },
        { key: 'lowStockThreshold', label: 'Low Stock Threshold' },
        { key: 'tags', label: 'Tags', format: (v) => Array.isArray(v) ? v.join('; ') : v },
        { key: 'isActive', label: 'Active', format: (v) => v ? 'Yes' : 'No' },
        { key: '$createdAt', label: 'Created At', format: (v) => new Date(v).toLocaleString() },
    ];

    const csv = convertToCSV(products, columns);
    const filename = `products_export_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
}

/**
 * Export customers to CSV
 */
export function exportCustomersToCSV(customers: any[]): void {
    const columns: ExportColumn[] = [
        { key: 'name', label: 'Customer Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'address', label: 'Address' },
        { key: 'city', label: 'City' },
        { key: 'state', label: 'State' },
        { key: 'pincode', label: 'Pincode' },
        { key: 'totalPurchases', label: 'Total Purchases', format: (v) => `₹${v || 0}` },
        { key: 'lastPurchaseDate', label: 'Last Purchase', format: (v) => v ? new Date(v).toLocaleDateString() : 'Never' },
        { key: 'notes', label: 'Notes' },
        { key: '$createdAt', label: 'Created At', format: (v) => new Date(v).toLocaleString() },
    ];

    const csv = convertToCSV(customers, columns);
    const filename = `customers_export_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
}

/**
 * Export invoices to CSV
 */
export function exportInvoicesToCSV(invoices: any[]): void {
    const columns: ExportColumn[] = [
        { key: 'invoiceNumber', label: 'Invoice Number' },
        { key: 'customerName', label: 'Customer' },
        { key: 'totalAmount', label: 'Total Amount', format: (v) => `₹${v}` },
        { key: 'paymentMethod', label: 'Payment Method' },
        { key: 'status', label: 'Status' },
        { key: '$createdAt', label: 'Date', format: (v) => new Date(v).toLocaleString() },
    ];

    const csv = convertToCSV(invoices, columns);
    const filename = `invoices_export_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
}
