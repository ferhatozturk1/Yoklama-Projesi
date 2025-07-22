// File utilities
export * from "./fileUtils";

// PDF utilities
export * from "./pdfUtils";

// Excel utilities
export * from "./excelUtils";

// Validation utilities
export * from "./validationSchemas";
export * from "./validationUtils";
export * from "./academicValidations";
export * from "./fileValidations";

// Responsive utilities
export * from "./responsiveUtils";

// API utilities
export { default as apiClient, apiRequest } from "./apiClient";
export * from "./apiErrorHandler";
export * from "./apiValidator";
export * from "./apiCache";

// Performance utilities
export { default as cacheManager } from "./cacheManager";
export * from "./routePrefetcher";
export { default as imageOptimizer } from "./imageOptimizer";
export { default as memoHelpers } from "./memoHelpers";
export { 
  lazyLoad, 
  preloadComponent, 
  lazyMemo, 
  preloadComponents, 
  createPreloadHandlers, 
  lazyLoadOnVisible 
} from "./lazyLoad.jsx";
export { default as contextOptimizer } from "./contextOptimizer.jsx";

// Accessibility utilities
export { default as accessibilityUtils } from "./accessibilityUtils";

// Browser compatibility utilities
export { default as browserUtils } from "./browserUtils";

// Error reporting utilities
export { default as errorReporter } from "./errorReporter";

// Other utilities can be added here as they are created
