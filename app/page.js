import AuroraBackground from '@/components/AuroraBackground';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import FeatureCards from '@/components/FeatureCards';
import DemoSimulator from '@/components/DemoSimulator';

export default function Home() {
  return (
    <div style={{ background: '#050508', minHeight: '100vh' }}>
      <AuroraBackground />

      <main style={{ position: 'relative', zIndex: 1 }}>
        <NavBar />
        <HeroSection />
        <FeatureCards />

        <DemoSimulator />

        {/* Footer */}
        <footer
          style={{
            borderTop: '1px solid rgba(139,92,246,0.12)',
            padding: '32px 24px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              fontSize: 13,
              color: '#334155',
            }}
          >
            © 2025 CityPulseFlow &nbsp;·&nbsp; The City Knows. You Benefit.
          </p>
        </footer>
      </main>
    </div>
  );
}
