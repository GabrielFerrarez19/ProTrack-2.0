import {
  IndexHeader,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  BenefitsSection,
  CTASection,
  IndexFooter,
} from "./components";

export function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <IndexHeader />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <CTASection />
      <IndexFooter />
    </div>
  );
}
