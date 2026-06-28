import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";
import ConsultationModal from "@/components/lead/ConsultationModal";
import { getWhatsappNumber } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const whatsapp = await getWhatsappNumber();

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ChatWidget whatsapp={whatsapp} />
      <ConsultationModal whatsapp={whatsapp} />
    </>
  );
}
