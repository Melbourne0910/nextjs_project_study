import Modal from "@/components/ui/Modal";
import Cart from "@/components/ui/Cart";

export const metadata = {
  title: "Checkout | Agora",
  description: "Complete your checkout securely on Agora.",
};

export default function CheckoutPage() {
  return (
    <Modal>
      <Cart />
    </Modal>
  );
}