'use client';

import React from 'react';

interface SalesChartProps {
    data: { [key: string]: number };
}

export default function SalesChart({ data }: SalesChartProps) {
    const entries = Object.entries(data).slice(-7); // Last 7 days
    const maxValue = Math.max(...entries.map(([, value]) => value), 1);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend (Last 7 Days)</h3>

            <div className="flex items-end justify-between gap-2 h-48">
                {entries.map(([date, value]) => {
                    const height = (value / maxValue) * 100;
                    const dateObj = new Date(date);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

                    return (
                        <div key={date} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full flex flex-col items-center justify-end h-40 relative group">
                                <div
                                    className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all hover:from-purple-700 hover:to-purple-500 relative"
                                    style={{ height: `${height}%`, minHeight: value > 0 ? '8px' : '0px' }}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                            ₹{value.toFixed(2)}
                                        </div>
                                        <div className="w-2 h-2 bg-gray-900 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">{dayName}</div>
                        </div>
                    );
                })}
            </div>

            {entries.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p>No sales data available</p>
                    <p className="text-sm mt-1">Create invoices to see revenue trends</p>
                </div>
            )}
        </div>
    );
}
