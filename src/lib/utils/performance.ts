/**
 * Performance Monitoring and Bundle Analysis Utilities
 * Provides tools for tracking performance metrics and bundle optimization
 */

// =============================================================================
// PERFORMANCE METRICS
// =============================================================================

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface BundleAnalysis {
  totalSize: number;
  chunks: Array<{
    name: string;
    size: number;
    type: 'main' | 'vendor' | 'dynamic';
  }>;
  dynamicImports: Array<{
    name: string;
    loadTime: number;
    size?: number;
  }>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();
  private bundleAnalysis: BundleAnalysis = {
    totalSize: 0,
    chunks: [],
    dynamicImports: [],
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // Long Task Observer
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('long-task', entry.duration, {
              startTime: entry.startTime,
            });
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.set('longtask', longTaskObserver);
      } catch (error) {
        console.warn('[Performance] Long task observer not supported:', error);
      }

      // Navigation Observer
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric('page-load', navEntry.loadEventEnd - navEntry.fetchStart, {
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
              firstPaint: this.getFirstPaint(),
              firstContentfulPaint: this.getFirstContentfulPaint(),
            });
          }
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.set('navigation', navigationObserver);
      } catch (error) {
        console.warn('[Performance] Navigation observer not supported:', error);
      }
    }
  }

  private getFirstPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  private getFirstContentfulPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : null;
  }

  // Record custom metrics
  recordMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);


    // Send to analytics in production
    if (!import.meta.env.DEV && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: value,
        ...metadata,
      });
    }
  }

  // Track dynamic imports
  trackDynamicImport(name: string): Promise<any> {
    const startTime = performance.now();
    
    return new Promise((resolve, reject) => {
      const importPromise = import(/* @vite-ignore */ name);
      
      importPromise
        .then((module) => {
          const loadTime = performance.now() - startTime;
          this.recordMetric('dynamic-import', loadTime, { module: name });
          
          this.bundleAnalysis.dynamicImports.push({
            name,
            loadTime,
          });
          
          resolve(module);
        })
        .catch((error) => {
          const loadTime = performance.now() - startTime;
          this.recordMetric('dynamic-import-error', loadTime, { 
            module: name, 
            error: error.message 
          });
          reject(error);
        });
    });
  }

  // Get performance summary
  getPerformanceSummary() {
    const summary = {
      totalMetrics: this.metrics.length,
      averagePageLoad: this.getAverageMetric('page-load'),
      averageDynamicImport: this.getAverageMetric('dynamic-import'),
      longTasksCount: this.getMetricCount('long-task'),
      bundleAnalysis: this.bundleAnalysis,
      recentMetrics: this.metrics.slice(-10),
    };

    return summary;
  }

  private getAverageMetric(name: string): number | null {
    const relevantMetrics = this.metrics.filter(m => m.name === name);
    if (relevantMetrics.length === 0) return null;
    
    const sum = relevantMetrics.reduce((acc, m) => acc + m.value, 0);
    return sum / relevantMetrics.length;
  }

  private getMetricCount(name: string): number {
    return this.metrics.filter(m => m.name === name).length;
  }

  // Clear metrics
  clearMetrics() {
    this.metrics = [];
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// =============================================================================
// BUNDLE ANALYSIS
// =============================================================================

export function analyzeBundleSize() {
  if (typeof window === 'undefined') return null;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  const analysis = {
    scripts: scripts.map(script => ({
      src: (script as HTMLScriptElement).src,
      async: (script as HTMLScriptElement).async,
      defer: (script as HTMLScriptElement).defer,
    })),
    styles: styles.map(style => ({
      href: (style as HTMLLinkElement).href,
    })),
    performance: {
      resourceLoadTimes: getResourceLoadTimes(),
      memoryUsage: getMemoryUsage(),
    },
  };

  return analysis;
}

function getResourceLoadTimes() {
  if (typeof performance === 'undefined') return [];
  
  return performance
    .getEntriesByType('resource')
    .map(entry => ({
      name: entry.name,
      duration: entry.duration,
      size: (entry as any).transferSize || 0,
      type: (entry as any).initiatorType,
    }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 20); // Top 20 slowest resources
}

function getMemoryUsage() {
  if (typeof performance === 'undefined' || !('memory' in performance)) {
    return null;
  }

  const memory = (performance as any).memory;
  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usedPercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  };
}

// =============================================================================
// COMPONENT PERFORMANCE TRACKING
// =============================================================================

export function trackComponentRender(componentName: string) {
  const startTime = performance.now();
  
  return {
    end: () => {
      const renderTime = performance.now() - startTime;
      performanceMonitor.recordMetric('component-render', renderTime, {
        component: componentName,
      });
      return renderTime;
    },
  };
}

export function trackFormStepLoad(step: number) {
  const startTime = performance.now();
  
  return {
    end: () => {
      const loadTime = performance.now() - startTime;
      performanceMonitor.recordMetric('form-step-load', loadTime, {
        step,
      });
      return loadTime;
    },
  };
}

// =============================================================================
// FORM-SPECIFIC PERFORMANCE TRACKING
// =============================================================================

export function trackFormValidation(step: number, fieldCount: number) {
  const startTime = performance.now();
  
  return {
    end: (errorCount = 0) => {
      const validationTime = performance.now() - startTime;
      performanceMonitor.recordMetric('form-validation', validationTime, {
        step,
        fieldCount,
        errorCount,
      });
      return validationTime;
    },
  };
}

export function trackAIAssistance(action: 'open' | 'generate' | 'accept' | 'reject') {
  const startTime = performance.now();
  
  return {
    end: () => {
      const actionTime = performance.now() - startTime;
      performanceMonitor.recordMetric('ai-assistance', actionTime, {
        action,
      });
      return actionTime;
    },
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions
export { PerformanceMonitor };

// Development helper
export function enablePerformanceDebugging() {
  if (import.meta.env.DEV) {
    // Add performance debugging to window for manual inspection
    (window as any).__performance = {
      monitor: performanceMonitor,
      analyze: analyzeBundleSize,
      summary: () => performanceMonitor.getPerformanceSummary(),
    };
    
    console.log('[Performance] Debugging enabled. Use window.__performance');
  }
}

// Auto-enable in development
if (import.meta.env.DEV) {
  enablePerformanceDebugging();
}