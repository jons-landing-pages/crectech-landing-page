import PageHeader from "@/components/PageHeader";
import ContactSection from "@/components/contact/ContactSection";

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Talk to us about making fuel from <span className="text-primary">your biogas.</span>
          </>
        }
        subtitle="We would like to hear from biogas producers, shipping lines, partners and investors."
      />
      <ContactSection />
    </main>
  );
}
