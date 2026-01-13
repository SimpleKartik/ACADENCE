import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Features from '@/components/Features';
import WhyAcadence from '@/components/WhyAcadence';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import LogoBackground from '@/components/LogoBackground';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <LogoBackground opacity={5} />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Features />
        <WhyAcadence />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
