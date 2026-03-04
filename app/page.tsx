import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import TechDepthSection from '@/components/sections/TechDepthSection'
import PortfolioSection from '@/components/sections/PortfolioSection'
import CTASection from '@/components/sections/CTASection'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <TechDepthSection />
      <PortfolioSection />
      <CTASection />
      <Footer />
    </main>
  )
}
