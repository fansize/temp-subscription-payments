import Pricing from '@/components/pricing/pricing-primary';
import Hero from '@/components/landing-page/hero';
import AiTool from '@/components/landing-page/ai-tool';

export default async function PricingPage() {

  return (
    <div>
      <Hero />
      {/* <AiTool /> */}
      <Pricing />
    </div>
  );
}
