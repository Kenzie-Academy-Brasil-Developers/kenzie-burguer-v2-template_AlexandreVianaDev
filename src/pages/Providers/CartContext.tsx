import { createContext, ReactNode, useState } from "react";
import api from "../../services/api";


interface iCartContextProps {
  children: ReactNode;
}

export interface iProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  img: string;
}

interface iCartContext {
  cart: iProduct[];
  cards: iProduct[];
  addProduct: (product: iProduct) => void;
  removeProduct:(productToRemove: iProduct) => void;
  getProducts: () => void;
}

export const CartContext = createContext<iCartContext>({} as iCartContext)

export const CartProvider = ({ children } : iCartContextProps) => {

  const [cart, setCart] = useState<iProduct[]>([])
  const [cards, setCards] = useState<iProduct[]>([])

  const getProducts = async () => {
    try {
      const tokenLS = localStorage.getItem("@TOKEN")
      const response = await api.get("/products", {
        headers: {
          Authorization: `Bearer ${tokenLS}`
        }
      });
      setCards(await response.data)
      console.log(await response.data)

    } catch (error) {
      console.log(error)
    }
  };

  const addProduct = (product: iProduct) => {
    setCart([...cart, product])
  }

  const removeProduct = (productToRemove: iProduct) => {
    const newCart = cart.filter(product => product.name !== productToRemove.name )
    setCart(newCart)
  }

  return (
    <CartContext.Provider value={{
      cart,
      cards,
      addProduct,
      removeProduct,
      getProducts
    }}>
      {children}
    </CartContext.Provider>
  )
}
