import { NextRequest, NextResponse } from 'next/server';
import { databases } from '@/infrastructure/appwrite/server-client';
import { Query } from 'node-appwrite';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const INVOICES_COLLECTION_ID = process.env.APPWRITE_INVOICES_COLLECTION_ID || 'invoices';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const sellerId = searchParams.get('sellerId');
        const days = parseInt(searchParams.get('days') || '30');

        if (!sellerId) {
            return NextResponse.json(
                { message: 'Seller ID is required' },
                { status: 400 }
            );
        }

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Fetch invoices for the period
        const invoices = await databases.listDocuments(
            DATABASE_ID,
            INVOICES_COLLECTION_ID,
            [
                Query.equal('sellerId', sellerId),
                Query.greaterThanEqual('invoiceDate', startDate.toISOString()),
                Query.orderDesc('invoiceDate'),
                Query.limit(1000)
            ]
        );

        // Calculate totals
        const totalRevenue = invoices.documents.reduce((sum, inv) => sum + (inv.total || 0), 0);
        const salesCount = invoices.documents.length;
        const avgOrderValue = salesCount > 0 ? totalRevenue / salesCount : 0;

        // Group by date for chart
        const revenueByDate: { [key: string]: number } = {};
        invoices.documents.forEach(invoice => {
            const date = new Date(invoice.invoiceDate).toISOString().split('T')[0];
            revenueByDate[date] = (revenueByDate[date] || 0) + invoice.total;
        });

        // Aggregate top products
        const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
        invoices.documents.forEach(invoice => {
            try {
                const items = JSON.parse(invoice.items || '[]');
                items.forEach((item: any) => {
                    if (!productSales[item.productId]) {
                        productSales[item.productId] = {
                            name: item.productName,
                            quantity: 0,
                            revenue: 0
                        };
                    }
                    productSales[item.productId].quantity += item.quantity || 0;
                    productSales[item.productId].revenue += item.total || 0;
                });
            } catch (error) {
                console.error('Error parsing invoice items:', error);
            }
        });

        // Sort top products by revenue
        const topProducts = Object.entries(productSales)
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Recent sales (last 5)
        const recentSales = invoices.documents.slice(0, 5).map(inv => ({
            id: inv.$id,
            invoiceNumber: inv.invoiceNumber,
            customerName: inv.customerName,
            total: inv.total,
            status: inv.status,
            date: inv.invoiceDate
        }));

        return NextResponse.json({
            totalRevenue,
            salesCount,
            avgOrderValue,
            revenueByDate,
            topProducts,
            recentSales
        });
    } catch (error: any) {
        console.error('Error fetching sales analytics:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
