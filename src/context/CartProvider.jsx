import React, { useCallback, useMemo, useState } from "react";
import { CartContext } from "./CartContext";
import api from "../services/api";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get("/cart");
      setItems(res.data?.items || []);
    } catch (err) {
      console.log(err);
      setItems([]);
      throw err;
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get("/order/my");
      setOrders(res.data || []);
    } catch (err) {
      console.log(err);
      setOrders([]);
      throw err;
    }
  }, []);

  const addItem = useCallback(
    async (product, quantity = 1) => {
      try {
        await api.post("/cart", {
          productId: product._id,
          quantity,
        });

        await fetchCart();
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    [fetchCart]
  );

  const updateQuantity = useCallback(
    async (itemId, quantity) => {
      try {
        const nextQuantity = Math.max(1, Number(quantity) || 1);

        await api.put(`/cart/${itemId}`, {
          quantity: nextQuantity,
        });

        await fetchCart();
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    [fetchCart]
  );

  const removeItem = useCallback(
    async (itemId) => {
      try {
        await api.delete(`/cart/${itemId}`);
        await fetchCart();
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    [fetchCart]
  );

  const clearCart = useCallback(async () => {
    try {
      await api.delete("/cart");
      setItems([]);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }, []);

  const placeOrder = useCallback(
    async (orderData = {}) => {
      try {
        const res = await api.post("/order", orderData);

        fetchCart().catch((err) => console.log(err));
        fetchOrders().catch((err) => console.log(err));

        return res.data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    [fetchCart, fetchOrders]
  );

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

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

  const value = useMemo(
    () => ({
      items,
      orders,
      totals,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      placeOrder,
      fetchOrders,
      fetchCart,
    }),
    [
      items,
      orders,
      totals,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      placeOrder,
      fetchOrders,
      fetchCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
