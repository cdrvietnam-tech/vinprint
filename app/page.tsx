import Header from "./components/home/Header";
import Hero from "./components/home/Hero";
import HotProductsMarquee from "./components/home/HotProductsMarquee";
import Pricing from "./components/home/Pricing";
import Process from "./components/home/Process";
import Gallery from "./components/home/Gallery";
import CaseStudies from "./components/home/CaseStudies";
import FAQAndZaloCTA from "./components/home/FAQAndZaloCTA";
import Footer from "./components/home/Footer";
import StructuredData from "./components/home/StructuredData";
import MobileActionBar from "./components/home/MobileActionBar";
import ScrollToTop from "./components/home/ScrollToTop";
import MapSection from "./components/home/MapSection";

export default function Page() {
  return (
    <div className="font-sans antialiased text-gray-900 selection:bg-orange-200">
      <StructuredData />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <HotProductsMarquee />
        <Pricing />
        <Process />
        <section className="py-12 bg-gray-50/50">
          <div className="max-w-[1440px] mx-auto px-4 grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
            <Gallery />
            <CaseStudies />
          </div>
        </section>
        <FAQAndZaloCTA />
        <MapSection />
      </main>
      <Footer hasMobileActionBar />
      <MobileActionBar />
      <ScrollToTop />
    </div>
  );
}
