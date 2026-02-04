export interface AIQuery {
    query: string;
    filters?: Record<string, any>;
    limit?: number;
}

export interface AIProductEnrichment {
    name: string;
    existingDescription?: string;
    category?: string;
}

export interface AIEnrichmentResult {
    description: string;
    category: string;
    suggestedPrice?: number;
}
