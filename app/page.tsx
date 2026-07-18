import Header from "./components/home/Header";
import Hero from "./components/home/Hero";
import BeforeAfter from "./components/home/BeforeAfter";
import AIDesignFlow from "./components/home/AIDesignFlow";
import Categories from "./components/home/Categories";
import Pricing from "./components/home/Pricing";
import Process from "./components/home/Process";
import Gallery from "./components/home/Gallery";
import Reviews from "./components/home/Reviews";
import FAQAndMockup from "./components/home/FAQAndMockup";
import Footer from "./components/home/Footer";
import StructuredData from "./components/home/StructuredData";
import MobileActionBar from "./components/home/MobileActionBar";

export default function Page() {
  return (
    <div className="font-sans antialiased text-gray-900 selection:bg-orange-200">
      <StructuredData />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <AIDesignFlow />
        <BeforeAfter />
        <Categories />
        <Pricing />
        <Process />
        <section className="py-12 bg-gray-50/50">
          <div className="max-w-[1440px] mx-auto px-4 grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
            <Gallery />
            <Reviews />
          </div>
        </section>
        <FAQAndMockup />
      </main>
      <Footer />
      <MobileActionBar />
    </div>
  );
}
