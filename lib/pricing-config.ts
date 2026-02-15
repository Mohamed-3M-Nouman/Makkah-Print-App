export const PRICING_CONFIG = {
    // Rates per Sheet (not per page)
    bw: {
        single: 0.5,
        double: 0.75,
    },
    color_inkjet: {
        single: 1.0,
        double: 1.5,
    },
    color_laser: {
        single: 3.0,
        double: 4.5,
    },
    delivery: 25,
};

export type PricingConfig = typeof PRICING_CONFIG;
