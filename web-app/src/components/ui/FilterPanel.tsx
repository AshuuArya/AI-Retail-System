/**
 * Simple Filter Panel
 * No fancy UI library - just simple filters
 */

export interface FilterGroup {
    id: string;
    label: string;
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: (value: string) => void;
}

interface FilterPanelProps {
    filters: FilterGroup[];
    onReset?: () => void;
}

export default function FilterPanel({ filters, onReset }: FilterPanelProps) {
    return (
        <div className="card" style={{ padding: '1rem' }}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Filters</h3>
                {onReset && (
                    <button
                        onClick={onReset}
                        className="text-sm"
                        style={{ color: '#6366f1', fontWeight: 600 }}
                    >
                        Reset
                    </button>
                )}
            </div>

            <div className="grid gap-4">
                {filters.map((filter) => (
                    <div key={filter.id}>
                        <label className="label">
                            {filter.label}
                        </label>
                        <select
                            value={filter.value}
                            onChange={(e) => filter.onChange(e.target.value)}
                            className="input"
                        >
                            {filter.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
}

// export type { FilterGroup }; // Already exported above
