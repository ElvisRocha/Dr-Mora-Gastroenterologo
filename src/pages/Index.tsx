import { Hero } from "@/components/landing/Hero";
import { ServiciosGrid } from "@/components/landing/ServiciosGrid";
import { PorQueNosotros } from "@/components/landing/PorQueNosotros";
import { SobreElDoctor } from "@/components/landing/SobreElDoctor";
import { Testimonios } from "@/components/landing/Testimonios";
import { GaleriaPreview } from "@/components/landing/GaleriaPreview";
import { FAQ } from "@/components/landing/FAQ";
import { CTAFinal } from "@/components/landing/CTAFinal";

export default function Index() {
  return (
    <>
      <Hero />
      <PorQueNosotros />
      <ServiciosGrid />
      <GaleriaPreview />
      <Testimonios />
      <SobreElDoctor />
      <FAQ />
      <CTAFinal />
    </>
  );
}
