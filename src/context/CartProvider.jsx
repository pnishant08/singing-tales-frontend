import React, { useEffect, useMemo, useState } from "react";
import { CartContext } from "./CartContext";

const CART_KEY = "singing_tales_cart";
const ORDERS_KEY = "singing_tales_orders";

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const buildLineId = (product, customization = {}) => {
  const customKey = JSON.stringify(customization);
  return `${product.id}-${btoa(unescape(encodeURIComponent(customKey))).slice(0, 10)}`;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => readStorage(CART_KEY, []));
  const [orders, setOrders] = useState(() => readStorage(ORDERS_KEY, []));

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const addItem = (product, quantity = 1, customization = {}) => {
    const lineId = buildLineId(product, customization);

    setItems((current) => {
      const existing = current.find((item) => item.lineId === lineId);

      if (existing) {
        return current.map((item) =>
          item.lineId === lineId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...current,
        {
          lineId,
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity,
          customization,
        },
      ];
    });
  };

  const updateQuantity = (lineId, quantity) => {
    const nextQuantity = Math.max(1, Number(quantity) || 1);
    setItems((current) =>
      current.map((item) =>
        item.lineId === lineId ? { ...item, quantity: nextQuantity } : item
      )
    );
  };

  const removeItem = (lineId) => {
    setItems((current) => current.filter((item) => item.lineId !== lineId));
  };

  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = subtotal > 0 && subtotal < 499 ? 49 : 0;
    const discount = subtotal >= 500 ? 50 : 0;
    const total = Math.max(0, subtotal + delivery - discount);

    return {
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      delivery,
      discount,
      total,
    };
  }, [items]);

  const placeOrder = (customer) => {
    if (!items.length) return null;

    const order = {
      id: `ST${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
      status: "Crafting",
      eta: "3-5 business days",
      customer,
      items,
      totals,
    };

    setOrders((current) => [order, ...current]);
    setItems([]);
    return order;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        orders,
        totals,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
