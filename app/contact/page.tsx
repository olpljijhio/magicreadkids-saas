import ContactForm from "@/components/contact/ContactForm";

export const metadata = { title: "Contact – MagicReadKids" };

export default function Page() {
  return (
    <section className="mx-auto max-w-xl px-4 md:px-6 py-12">
      <h1 className="text-3xl font-extrabold mb-4">Contact</h1>
      <ContactForm />
    </section>
  );
}