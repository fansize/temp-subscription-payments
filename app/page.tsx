// import Pricing from '@/components/ui/Pricing/Pricing';
import Pricing from '@/components/pricing/pricing-primary';
import Hero from '@/components/landing-page/hero';

export default async function PricingPage() {

  return (
    <div className="min-h-screen">
      <Hero />
      <Pricing />
    </div>
  );
}
