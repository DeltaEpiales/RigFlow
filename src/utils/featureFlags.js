// --- Feature Flags ---
// Used to conditionally enable features based on the phased rollout plan.

export const FEATURE_FLAGS = {
    // Phase 1 (Core Loop)
    geospatialCommandCenter: true,
    workOrderLifecycle: true,
    technicianMobileCore: true,
    supervisorApprovalCore: true,
    offlineMode: true, // Assumed true for all mobile-first features

    // Phase 2 (Enterprise Capabilities)
    assetAndInventoryManagement: true,
    apiForIntegrations: true, // Backend-dependent, represented by UI placeholders
    expandedFormsLibrary: true, // e.g., Daily Drilling Report

    // Phase 3 (Optimization & Intelligence)
    aiAssistedDispatching: true, // Represented by UI placeholders
    advancedAnalytics: true,
    iotIntegration: false, // Future goal
    crewAndProjectManagement: true, // Represented by UI placeholders
};
