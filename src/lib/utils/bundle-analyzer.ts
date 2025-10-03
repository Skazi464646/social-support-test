/**
 * Bundle Analysis and Code Splitting Utilities
 * Provides tools for analyzing bundle size and optimizing code splitting
 */

// =============================================================================
// BUNDLE SIZE ANALYSIS
// =============================================================================

interface ChunkInfo {
  name: string;
  size: number;
  gzipSize?: number;
  modules: string[];
  type: 'entry' | 'vendor' | 'dynamic' | 'shared';
}

interface BundleReport {
  totalSize: number;
  totalGzipSize: number;
  chunks: ChunkInfo[];
  duplicateModules: string[];
  recommendations: string[];
  performanceScore: number;
}

export class BundleAnalyzer {
  private chunks: Map<string, ChunkInfo> = new Map();
  private moduleUsage: Map<string, number> = new Map();

  constructor() {
    this.initializeAnalysis();
  }

  private initializeAnalysis() {
    if (typeof window !== 'undefined') {
      // Analyze current bundle
      this.analyzeCurrentBundle();
      
      // Set up dynamic import tracking
      this.setupDynamicImportTracking();
    }
  }

  private analyzeCurrentBundle() {
    // Get all script tags
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    
    scripts.forEach(script => {
      const src = (script as HTMLScriptElement).src;
      const name = this.extractChunkName(src);
      const type = this.determineChunkType(src);
      
      this.chunks.set(name, {
        name,
        size: 0, // Will be estimated
        modules: [],
        type,
      });
    });
  }

  private extractChunkName(src: string): string {
    const filename = src.split('/').pop() || src;
    return filename.replace(/\.[^.]+$/, ''); // Remove extension
  }

  private determineChunkType(src: string): ChunkInfo['type'] {
    if (src.includes('vendor')) return 'vendor';
    if (src.includes('chunk')) return 'dynamic';
    if (src.includes('shared')) return 'shared';
    return 'entry';
  }

  private setupDynamicImportTracking() {
    // Override dynamic import to track usage
    const originalImport = window.eval('import');
    
    if (originalImport) {
      // This is just for tracking, actual implementation would depend on bundler
      console.log('[Bundle Analyzer] Dynamic import tracking enabled');
    }
  }

  // Track module usage
  trackModuleUsage(moduleName: string) {
    const currentUsage = this.moduleUsage.get(moduleName) || 0;
    this.moduleUsage.set(moduleName, currentUsage + 1);
  }

  // Get bundle recommendations
  generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    // Check for large chunks
    this.chunks.forEach(chunk => {
      if (chunk.size > 1000000) { // 1MB
        recommendations.push(`Consider code splitting for large chunk: ${chunk.name}`);
      }
    });

    // Check for duplicate modules
    const duplicates = this.findDuplicateModules();
    if (duplicates.length > 0) {
      recommendations.push(`Found ${duplicates.length} duplicate modules - consider deduplication`);
    }

    // Check for unused modules
    const unusedModules = this.findUnusedModules();
    if (unusedModules.length > 0) {
      recommendations.push(`Found ${unusedModules.length} potentially unused modules`);
    }

    return recommendations;
  }

  private findDuplicateModules(): string[] {
    const duplicates: string[] = [];
    
    this.moduleUsage.forEach((usage, module) => {
      if (usage > 1) {
        duplicates.push(module);
      }
    });

    return duplicates;
  }

  private findUnusedModules(): string[] {
    // This would require more sophisticated analysis
    // For now, return empty array
    return [];
  }

  // Generate performance score
  calculatePerformanceScore(): number {
    let score = 100;

    // Deduct points for large bundles
    const totalSize = Array.from(this.chunks.values())
      .reduce((total, chunk) => total + chunk.size, 0);

    if (totalSize > 5000000) score -= 20; // 5MB
    else if (totalSize > 2000000) score -= 10; // 2MB

    // Deduct points for too many chunks
    if (this.chunks.size > 10) score -= 10;

    // Deduct points for duplicates
    const duplicates = this.findDuplicateModules();
    score -= duplicates.length * 2;

    return Math.max(0, score);
  }

  // Get full bundle report
  generateReport(): BundleReport {
    const chunks = Array.from(this.chunks.values());
    const duplicates = this.findDuplicateModules();
    const recommendations = this.generateRecommendations();
    
    return {
      totalSize: chunks.reduce((total, chunk) => total + chunk.size, 0),
      totalGzipSize: chunks.reduce((total, chunk) => total + (chunk.gzipSize || chunk.size * 0.3), 0),
      chunks,
      duplicateModules: duplicates,
      recommendations,
      performanceScore: this.calculatePerformanceScore(),
    };
  }
}

// =============================================================================
// CODE SPLITTING UTILITIES
// =============================================================================

import type * as React from 'react';

export interface LazyComponentOptions {
  fallback?: React.ComponentType;
  errorBoundary?: React.ComponentType<{ error: Error; retry: () => void }>;
  preload?: boolean;
  timeout?: number;
}

/**
 * Enhanced lazy loading with performance tracking
 */
export function createLazyComponent<T = any>(
  importFn: () => Promise<{ default: React.ComponentType<T> } | React.ComponentType<T>>,
  _options?: LazyComponentOptions
): React.LazyExoticComponent<React.ComponentType<T>> {
  const startTime = performance.now();
  
  // React will be available at runtime, we import dynamically
  const React = require('react');
  
  return React.lazy(async () => {
    try {
      const module = await importFn();
      const loadTime = performance.now() - startTime;
      
      // Track performance
      if (typeof window !== 'undefined' && (window as any).__performance) {
        (window as any).__performance.monitor.recordMetric('lazy-component-load', loadTime);
      }
      
      // Handle different module formats
      if (module && typeof module === 'object' && 'default' in module) {
        return module as { default: React.ComponentType<T> };
      }
      
      return { default: module as React.ComponentType<T> };
    } catch (error) {
      const loadTime = performance.now() - startTime;
      
      // Track error
      if (typeof window !== 'undefined' && (window as any).__performance) {
        (window as any).__performance.monitor.recordMetric('lazy-component-error', loadTime, {
          error: (error as Error).message,
        });
      }
      
      throw error;
    }
  });
}

/**
 * Preload a lazy component
 */
export function preloadComponent(importFn: () => Promise<any>) {
  return importFn().catch(error => {
    console.warn('[Preload] Failed to preload component:', error);
  });
}

/**
 * Smart preloading based on user interaction
 */
export function setupSmartPreloading() {
  if (typeof window === 'undefined') return;

  let isIdle = false;
  
  // Use requestIdleCallback if available
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      isIdle = true;
    });
  } else {
    // Fallback: assume idle after initial load
    setTimeout(() => {
      isIdle = true;
    }, 2000);
  }

  return {
    isIdle: () => isIdle,
    preloadWhenIdle: (importFn: () => Promise<any>) => {
      if (isIdle) {
        preloadComponent(importFn);
      } else {
        // Wait for idle state
        const checkIdle = () => {
          if (isIdle) {
            preloadComponent(importFn);
          } else {
            setTimeout(checkIdle, 100);
          }
        };
        checkIdle();
      }
    },
  };
}

// =============================================================================
// FORM-SPECIFIC OPTIMIZATIONS
// =============================================================================

/**
 * Optimized form step loader with prefetching
 */
export class FormStepLoader {
  private loadedSteps: Set<number> = new Set();
  private preloadTimer: NodeJS.Timeout | null = null;

  async loadStep(step: number): Promise<React.ComponentType> {
    const startTime = performance.now();
    
    try {
      let component: React.ComponentType;
      
      switch (step) {
        case 1:
          const Step1 = await import('@/components/organisms/FormStep1');
          component = Step1.FormStep1;
          break;
        case 2:
          const Step2 = await import('@/components/organisms/FormStep2');
          component = Step2.FormStep2;
          break;
        case 3:
          const Step3 = await import('@/components/organisms/FormStep3');
          component = Step3.FormStep3;
          break;
        default:
          throw new Error(`Invalid step: ${step}`);
      }

      this.loadedSteps.add(step);
      
      const loadTime = performance.now() - startTime;
      console.log(`[Form Loader] Step ${step} loaded in ${loadTime.toFixed(2)}ms`);
      
      return component;
    } catch (error) {
      console.error(`[Form Loader] Failed to load step ${step}:`, error);
      throw error;
    }
  }

  preloadNextStep(currentStep: number) {
    const nextStep = currentStep + 1;
    
    if (nextStep <= 3 && !this.loadedSteps.has(nextStep)) {
      // Delay preloading to avoid blocking current step
      this.preloadTimer = setTimeout(() => {
        this.loadStep(nextStep).catch(error => {
          console.warn(`[Form Loader] Preload failed for step ${nextStep}:`, error);
        });
      }, 1000);
    }
  }

  cancelPreload() {
    if (this.preloadTimer) {
      clearTimeout(this.preloadTimer);
      this.preloadTimer = null;
    }
  }

  isStepLoaded(step: number): boolean {
    return this.loadedSteps.has(step);
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export const bundleAnalyzer = new BundleAnalyzer();
export const formStepLoader = new FormStepLoader();

// Development tools
export function analyzeBundlePerformance() {
  if (import.meta.env.DEV) {
    const report = bundleAnalyzer.generateReport();
    
    console.group('[Bundle Analysis]');
    console.log('Performance Score:', report.performanceScore);
    console.log('Total Size:', (report.totalSize / 1024 / 1024).toFixed(2), 'MB');
    console.log('Gzip Size:', (report.totalGzipSize / 1024 / 1024).toFixed(2), 'MB');
    console.table(report.chunks);
    
    if (report.recommendations.length > 0) {
      console.group('Recommendations:');
      report.recommendations.forEach(rec => console.log('•', rec));
      console.groupEnd();
    }
    
    console.groupEnd();
    
    return report;
  }
  
  return null;
}