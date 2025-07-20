// utils/localCart.ts

const CART_KEY = "local_cart";

export const fetchLocalCart = () => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addLocalProducts = ({ ID }) => {
  if (typeof window === "undefined") return;

  const cart = fetchLocalCart();
  const index = cart.findIndex((item) => item.id === ID);

  if (index !== -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({ id: ID, quantity: 1 });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const removeLocalProducts = ({ ID }) => {
  if (typeof window === "undefined") return;

  const cart = fetchLocalCart();
  const index = cart.findIndex((item) => item.id === ID);

  if (index !== -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      deleteLocalProducts({ ID });
      return;
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
};

export const deleteLocalProducts = ({ ID }) => {
  if (typeof window === "undefined") return;

  const cart = fetchLocalCart();
  const updatedCart = cart.filter((item) => item.id !== ID);

  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
};

export const clearLocalCart = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(CART_KEY);
};
