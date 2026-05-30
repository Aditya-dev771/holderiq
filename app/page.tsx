import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import WhyHolderIQ from "@/components/WhyHolderIQ";
import Waitlist from "@/components/Waitlist";
import Footer from "@/components/Footer";
import CollectionAnalyzer from "@/components/CollectionAnalyzer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
	<CollectionAnalyzer />
      <Features />
      <WhyHolderIQ />
      <Waitlist />
      <Footer />
    </main>
  );
}