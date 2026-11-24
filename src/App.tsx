import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WebGISLab } from './components/WebGISLab';
import { ProjectsSection } from './components/ProjectsSection';
import { ServicesSection } from './components/ServicesSection';
import { CredentialsSection } from './components/CredentialsSection';
import { ContactSection } from './components/ContactSection';
import { ResumeModal } from './components/ResumeModal';
import { Footer } from './components/Footer';
import { DemoShell } from './components/DemoShell';
import { parseHashToDemoId, type DemoId } from './demos/registry';
import { useLanguage } from './i18n/LanguageContext';

// Lazy-load all 6 full-viewport demos so initial portfolio load stays blazing fast
const WebGISStudioDemo = lazy(() => import('./demos/WebGISStudioDemo'));
const SalonSaaSDemo = lazy(() => import('./demos/SalonSaaSDemo'));
const HydrologyDemo = lazy(() => import('./demos/HydrologyDemo'));
const DataPortalDemo = lazy(() => import('./demos/DataPortalDemo'));
const DevToolsDemo = lazy(() => import('./demos/DevToolsDemo'));
const AILabDemo = lazy(() => import('./demos/AILabDemo'));

function DemoLoadingFallback() {
  const { bi } = useLanguage();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
        {bi('Loading interactive synthetic sandbox...', '正在加载交互式合成沙盒...')}
      </p>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    try {
      return localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [resumeOpen, setResumeOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState<DemoId | null>(() =>
    typeof window !== 'undefined' ? parseHashToDemoId(window.location.hash) : null
  );

  // Sync theme instantly with zero white-on-white CTA transition flash
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('theme-switching');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // Force style recalculation synchronously before removing the guard class
    void root.offsetHeight;
    const raf = window.requestAnimationFrame(() => {
      root.classList.remove('theme-switching');
    });

    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch {
      // Ignore storage errors in restricted browsing modes
    }
    return () => window.cancelAnimationFrame(raf);
  }, [theme]);

  // Listen to browser hash changes (back/forward buttons + direct #/demos/* links)
  useEffect(() => {
    const onHashChange = () => {
      const demo = parseHashToDemoId(window.location.hash);
      setActiveDemo(demo);
      if (demo) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const toggleTheme = useCallback(
    () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
    []
  );

  const launchDemo = useCallback((id: DemoId) => {
    window.location.hash = `#/demos/${id}`;
    setActiveDemo(id);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const exitToPortfolio = useCallback((scrollSection?: string) => {
    window.location.hash = scrollSection ? `#${scrollSection}` : '#/';
    setActiveDemo(null);
    if (scrollSection) {
      window.setTimeout(() => {
        document.getElementById(scrollSection)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  if (activeDemo) {
    return (
      <DemoShell
        activeDemo={activeDemo}
        theme={theme}
        onToggleTheme={toggleTheme}
        onExitToPortfolio={exitToPortfolio}
        onSelectDemo={launchDemo}
      >
        <Suspense fallback={<DemoLoadingFallback />}>
          {activeDemo === 'webgis' && <WebGISStudioDemo />}
          {activeDemo === 'salon' && <SalonSaaSDemo />}
          {activeDemo === 'hydrology' && <HydrologyDemo />}
          {activeDemo === 'data-portal' && <DataPortalDemo />}
          {activeDemo === 'devtools' && <DevToolsDemo />}
          {activeDemo === 'ai-lab' && <AILabDemo />}
        </Suspense>
      </DemoShell>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-obsidian-950 dark:text-slate-100">
      <div className={resumeOpen ? 'no-print' : undefined}>
        <Navbar
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenResume={() => setResumeOpen(true)}
          onLaunchDemo={launchDemo}
        />

        <main>
          <Hero onOpenResume={() => setResumeOpen(true)} onLaunchDemo={launchDemo} />
          <WebGISLab onLaunchFullStudio={() => launchDemo('webgis')} />
          <ProjectsSection onLaunchDemo={launchDemo} />
          <ServicesSection />
          <CredentialsSection />
          <ContactSection onOpenResume={() => setResumeOpen(true)} />
        </main>

        <Footer />
      </div>

      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}
