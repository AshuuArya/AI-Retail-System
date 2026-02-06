/**
 * Theme Configuration
 * 
 * Centralized theme configuration for easy customization.
 * Modify these values to change the entire application's appearance.
 */

export const theme = {
    // Brand colors
    colors: {
        brand: {
            primary: '#8B5CF6',
            primaryHover: '#7C3AED',
            secondary: '#6366F1',
            accent: '#EC4899',
        },
        background: {
            primary: '#0A0E1A',
            secondary: '#0F1419',
            tertiary: '#141824',
            elevated: '#1A1F2E',
        },
        text: {
            primary: '#F8FAFC',
            secondary: '#CBD5E1',
            tertiary: '#94A3B8',
            muted: '#64748B',
        },
        semantic: {
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6',
        },
    },

    // Typography
    typography: {
        fontFamily: {
            sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            mono: 'JetBrains Mono, "Courier New", monospace',
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
        },
    },

    // Spacing
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem',
    },

    // Border radius
    borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        full: '9999px',
    },

    // Layout
    layout: {
        sidebarWidth: '280px',
        sidebarCollapsedWidth: '80px',
        headerHeight: '64px',
        containerMaxWidth: {
            xs: '640px',
            sm: '768px',
            md: '1024px',
            lg: '1280px',
            xl: '1536px',
        },
    },

    // Animation
    animation: {
        duration: {
            fast: '150ms',
            base: '200ms',
            slow: '300ms',
            bounce: '500ms',
        },
        easing: {
            default: 'cubic-bezier(0.4, 0, 0.2, 1)',
            bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        },
    },
} as const;

export type Theme = typeof theme;

// Feature flags
export const features = {
    enableAnimations: true,
    enableGlassmorphism: true,
    enableDarkMode: true,
    enableCustomization: true,
} as const;

// User preferences (can be stored in localStorage)
export interface UserPreferences {
    theme: 'dark' | 'light' | 'auto';
    sidebarCollapsed: boolean;
    compactMode: boolean;
    animationsEnabled: boolean;
}

export const defaultPreferences: UserPreferences = {
    theme: 'dark',
    sidebarCollapsed: false,
    compactMode: false,
    animationsEnabled: true,
};
