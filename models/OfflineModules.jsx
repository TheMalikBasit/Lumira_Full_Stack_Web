import toast from "react-hot-toast";
const CART_KEY = "local_cart";

export const fetchLocalCart = () => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addLocalProducts = ({ ID, variantId }) => {
  if (typeof window === "undefined") return;

  const cart = fetchLocalCart();
  const index = cart.findIndex((item) => item.vid === variantId);

  if (index !== -1) {
    cart[index].quantity += 1;
    toast.success("Cart updated");
  } else {
    cart.push({ id: ID, vid: variantId, quantity: 1, checked: true });
    toast.success("Cart updated");
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const removeLocalProducts = ({ variantId }) => {
  if (typeof window === "undefined") return;

  const cart = fetchLocalCart();
  const index = cart.findIndex((item) => item.vid === variantId);

  if (index !== -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      toast.success("Cart updated");
    } else {
      deleteLocalProducts({ variantId });
      toast.success("Cart updated");
      return;
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
};

export const deleteLocalProducts = ({ variantId }) => {
  if (typeof window === "undefined") return;

  const cart = fetchLocalCart();
  const updatedCart = cart.filter((item) => item.vid !== variantId);
  toast.success("Cart updated");
  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
};

export const clearLocalCart = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(CART_KEY);
};
