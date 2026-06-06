import React, { useEffect, useMemo, useState } from "react";
import { CartContext } from "./CartContext";
import api from "../services/api"


export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchCart=async()=>{
    try{
      const res=await api.get("/cart");
      setItems(res.data.items||[]);
    }catch(err){
      console.log(err);
    }
  };

  useEffect(()=>{
    fetchCart();
  },[]);


 const addItem=async(CSSMathProduct,quantity=1)=>{
    try{
      await api.post("/cart",{
        productId:product._id,
        quantity,
      });
      await fetchCart();
    }catch(err){
      console.log(err);
    }
 };
  const updateQuantity = async (itemId, quantity) => {
    try{
       await api.put(`/cart/${itemId}`,{
        quantity,
       });
       await fetchCart();
    }catch(err){
      console.log(err);
    }
  };

  const removeItem =async (itemId) => {
    try{
      await api.delete(`/cart/${itemId}`);
      await fetchCart();
    }catch(err){
      console.log(err);
    }
  };

  const clearCart = async () => {
    try{
      await api.delete("/carts");
      setItems([]);
    }catch(err){
      console.log(err);
    }
  }

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


  const fetchOrders=async()=>{
    try{
      const res=await api.get("/order");
      setOrders(res.data);
    }catch(err){
      console.log(err);
    }
  }

  const placeOrder = async() => {
     try{
      const res= await api.post("/order");
      await fetchCart();
      await fetchOrders();
     }catch(err){
      console.log(err)
     }
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
        fetchOrders,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
