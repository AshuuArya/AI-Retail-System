'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface InvoiceItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
}

interface Invoice {
    id: string;
    invoiceNumber: string;
    customerId: string;
    customerName: string;
    items: InvoiceItem[];
    subtotal: number;
    discount: number;
    total: number;
    status: 'paid' | 'pending' | 'cancelled';
    paymentMethod: string;
    notes: string;
    createdAt: string;
}

export default function InvoiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchInvoice();
        }
    }, [params.id]);

    const fetchInvoice = async () => {
        try {
            const response = await fetch(`/api/invoices/${params.id}`);
            const data = await response.json();

            if (response.ok) {
                setInvoice(data.invoice);
            }
        } catch (error) {
            console.error('Error fetching invoice:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground animate-pulse font-medium">Retrieving invoice details...</p>
                </div>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="glass-card max-w-md w-full p-12 text-center rounded-3xl">
                    <div className="text-6xl mb-6 animate-float">📄</div>
                    <h2 className="text-2xl font-bold text-foreground mb-3">Invoice Not Found</h2>
                    <p className="text-muted-foreground mb-8">The invoice record could not be located in our system.</p>
                    <button
                        onClick={() => router.push('/dashboard/invoices')}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                    >
                        Back to Invoices
                    </button>
                </div>
            </div>
        );
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Actions Bar - Hide on print */}
                <div className="mb-8 flex items-center justify-between print:hidden">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 glass-card rounded-2xl text-foreground font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                        <span className="text-xl">←</span> Back
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-8 py-3 premium-gradient text-white rounded-2xl font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-transform flex items-center gap-3"
                    >
                        <span>🖨️</span> Print Invoice
                    </button>
                </div>

                {/* Invoice Body */}
                <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl border-white/5 relative">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <div className="text-9xl font-black">INVOICE</div>
                    </div>

                    <div className="p-8 md:p-12 relative z-10">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12 pb-12 border-b border-white/10">
                            <div>
                                <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-6">
                                    <span className="text-white text-3xl font-bold">🛒</span>
                                </div>
                                <h1 className="text-4xl font-black text-foreground mb-2 tracking-tight">INVOICE</h1>
                                <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">{invoice.invoiceNumber}</p>
                            </div>
                            <div className="md:text-right">
                                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
                                    {user?.companyName}
                                </h2>
                                <p className="text-muted-foreground font-medium mb-4">{user?.email}</p>
                                <span className={`inline-flex px-5 py-2 text-xs font-black uppercase tracking-widest rounded-full border ${getStatusStyles(invoice.status)}`}>
                                    {invoice.status}
                                </span>
                            </div>
                        </div>

                        {/* Customer & Date Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 px-2">
                            <div className="space-y-4 p-6 rounded-3xl bg-white/5 border border-white/5">
                                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Billing Information</h3>
                                <div>
                                    <p className="text-2xl font-bold text-foreground mb-1">{invoice.customerName}</p>
                                    <p className="text-muted-foreground">ID: {invoice.customerId}</p>
                                </div>
                            </div>
                            <div className="space-y-4 p-6 rounded-3xl bg-white/5 border border-white/5 text-right md:text-right">
                                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] md:text-right">Issue Date</h3>
                                <div>
                                    <p className="text-2xl font-bold text-foreground mb-1">
                                        {new Date(invoice.createdAt).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-muted-foreground">{new Date(invoice.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-12 overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left pb-6 text-xs font-black text-muted-foreground uppercase tracking-widest">Description</th>
                                        <th className="text-right pb-6 text-xs font-black text-muted-foreground uppercase tracking-widest">Rate</th>
                                        <th className="text-right pb-6 text-xs font-black text-muted-foreground uppercase tracking-widest">Qty</th>
                                        <th className="text-right pb-6 text-xs font-black text-muted-foreground uppercase tracking-widest">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {invoice.items.map((item, index) => (
                                        <tr key={index} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="py-6 pr-4">
                                                <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{item.productName}</p>
                                                <p className="text-xs text-muted-foreground font-mono mt-1 opacity-60">ID: {item.productId}</p>
                                            </td>
                                            <td className="py-6 text-right text-foreground font-medium">₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="py-6 text-right">
                                                <span className="inline-flex px-3 py-1 bg-white/5 rounded-lg text-foreground font-black text-xs">
                                                    {item.quantity}
                                                </span>
                                            </td>
                                            <td className="py-6 text-right font-black text-foreground">₹{item.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 pt-12 border-t border-white/10">
                            <div className="flex-1 space-y-4">
                                {invoice.notes && (
                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5 max-w-md">
                                        <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Notes & Remarks</h3>
                                        <p className="text-muted-foreground leading-relaxed italic">"{invoice.notes}"</p>
                                    </div>
                                )}
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 max-w-sm">
                                    <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-3">Payment Info</h3>
                                    <p className="text-foreground font-bold capitalize flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                        {invoice.paymentMethod}
                                    </p>
                                </div>
                            </div>

                            <div className="w-full md:w-80 space-y-4">
                                <div className="flex justify-between items-center text-muted-foreground font-medium px-4">
                                    <span>Subtotal</span>
                                    <span>₹{invoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                                {invoice.discount > 0 && (
                                    <div className="flex justify-between items-center text-emerald-400 font-bold px-4">
                                        <span>Discount</span>
                                        <span>-₹{invoice.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                )}
                                <div className="h-px bg-white/10 my-4"></div>
                                <div className="premium-gradient p-8 rounded-3xl text-white shadow-xl shadow-primary/20 group hover:scale-[1.02] transition-transform cursor-default">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-black uppercase tracking-widest opacity-80">Final Total</span>
                                        <span className="text-3xl font-black">
                                            ₹{invoice.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Signature Area */}
                        <div className="mt-20 pt-12 border-t border-white/5 flex flex-col items-center gap-4 text-center">
                            <div className="w-40 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-4"></div>
                            <p className="text-muted-foreground font-medium italic opacity-60">This is a system generated invoice.</p>
                            <p className="text-foreground font-black tracking-widest text-xs uppercase opacity-40">Thank you for choosing {user?.companyName}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    .glass-card {
                        background: white !important;
                        border: 1px solid #ddd !important;
                        box-shadow: none !important;
                        color: black !important;
                    }
                    .premium-gradient {
                        background: #333 !important;
                        color: white !important;
                    }
                    .text-foreground { color: black !important; }
                    .text-muted-foreground { color: #555 !important; }
                    .bg-background { background: white !important; }
                    .print\\:hidden { display: none !important; }
                }
            `}</style>
        </div>
    );
}
