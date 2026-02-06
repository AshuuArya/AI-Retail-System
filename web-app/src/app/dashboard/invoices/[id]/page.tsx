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
            if (response.ok) setInvoice(data.invoice);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#94a3b8' }}>
            Loading document...
        </div>
    );

    if (!invoice) return (
        <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h1 style={{ color: 'white', fontSize: '2rem' }}>Document Exhausted</h1>
            <p style={{ color: '#94a3b8', margin: '1rem 0 2rem' }}>We couldn&apos;t find this invoice in our records.</p>
            <button className="btn btn-purple" onClick={() => router.push('/dashboard/invoices')}>Return to ledger</button>
        </div>
    );

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-10 print:hidden">
                <button className="btn" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'white' }} onClick={() => router.back()}>
                    ← Back to Ledger
                </button>
                <button className="btn btn-purple" onClick={() => window.print()}>
                    ⎙ Print Invoice
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden', background: '#0a0e1a', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                {/* Visual Header */}
                <div style={{ background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)', height: '8px' }}></div>

                <div style={{ padding: '3rem' }}>
                    <div className="flex justify-between mb-12">
                        <div>
                            <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.05em' }}>INVOICE</h1>
                            <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>{invoice.invoiceNumber}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700 }}>{user?.companyName || 'Business Portal'}</h2>
                            <p style={{ color: '#94a3b8' }}>{user?.email}</p>
                            <span style={{
                                display: 'inline-block',
                                marginTop: '1rem',
                                padding: '0.25rem 1rem',
                                borderRadius: '100px',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                background: invoice.status === 'paid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                color: invoice.status === 'paid' ? '#10b981' : '#f59e0b',
                                border: `1px solid ${invoice.status === 'paid' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                            }}>
                                {invoice.status.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-2 mb-12" style={{ gap: '4rem' }}>
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>Bill To</p>
                            <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>{invoice.customerName}</h3>
                            <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>ID: {invoice.customerId}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>Issued On</p>
                            <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>{new Date(invoice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                            <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>{new Date(invoice.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '3rem' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem' }}>ITEMS</th>
                                <th style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem' }}>QTY</th>
                                <th style={{ textAlign: 'right', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem' }}>PRICE</th>
                                <th style={{ textAlign: 'right', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem' }}>TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <td style={{ padding: '1.5rem 1rem' }}>
                                        <p style={{ color: 'white', fontWeight: 600 }}>{item.productName}</p>
                                        <p style={{ color: '#64748b', fontSize: '0.75rem' }}>UID: {item.productId.slice(0, 8)}</p>
                                    </td>
                                    <td style={{ padding: '1.5rem 1rem', textAlign: 'center', color: 'white' }}>{item.quantity}</td>
                                    <td style={{ padding: '1.5rem 1rem', textAlign: 'right', color: '#94a3b8' }}>₹{(item.price ?? 0).toLocaleString()}</td>
                                    <td style={{ padding: '1.5rem 1rem', textAlign: 'right', color: 'white', fontWeight: 800 }}>₹{(item.total ?? 0).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="grid grid-2" style={{ gap: '4rem' }}>
                        <div>
                            {invoice.notes && (
                                <>
                                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>Remarks</p>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', fontStyle: 'italic' }}>&quot;{invoice.notes}&quot;</p>
                                </>
                            )}
                            <div style={{ marginTop: '2rem' }}>
                                <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Method</p>
                                <p style={{ color: 'white', fontWeight: 600 }}>{invoice.paymentMethod.toUpperCase()}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '2rem', color: '#94a3b8' }}>
                                <span>Subtotal</span>
                                <span style={{ width: '150px' }}>₹{(invoice.subtotal ?? 0).toLocaleString()}</span>
                            </div>
                            {invoice.discount > 0 && (
                                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '2rem', color: '#10b981', fontWeight: 600 }}>
                                    <span>Discount Applied</span>
                                    <span style={{ width: '150px' }}>-₹{(invoice.discount ?? 0).toLocaleString()}</span>
                                </div>
                            )}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '2rem',
                                color: 'white',
                                fontSize: '2.25rem',
                                fontWeight: 900,
                                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                paddingTop: '1.5rem'
                            }}>
                                <span>Total</span>
                                <span style={{ width: '250px', color: '#10b981' }}>₹{(invoice.total ?? 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '5rem', textAlign: 'center', color: '#475569', fontSize: '0.75rem' }}>
                        <p>This document is digitally verified. Thank you for your business!</p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    body { background: white !important; }
                    .container { max-width: 100% !important; padding: 0 !important; }
                    .card { border: none !important; color: black !important; }
                    h1, h2, h3, p, span, td, th { color: black !important; }
                    .btn, .print\\:hidden { display: none !important; }
                }
            `}</style>
        </div>
    );
}
