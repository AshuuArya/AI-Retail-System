import React from 'react';

interface FilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    activeFilterCount?: number;
    onClearAll?: () => void;
}

export default function FilterPanel({
    isOpen,
    onClose,
    children,
    activeFilterCount = 0,
    onClearAll
}: FilterPanelProps) {
    if (!isOpen) return null;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Filters
                    </h3>
                    {activeFilterCount > 0 && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                            {activeFilterCount} active
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {activeFilterCount > 0 && onClearAll && (
                        <button
                            onClick={onClearAll}
                            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            Clear All
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                    >
                        ✕
                    </button>
                </div>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}

interface FilterGroupProps {
    label: string;
    children: React.ReactNode;
}

export function FilterGroup({ label, children }: FilterGroupProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            {children}
        </div>
    );
}
