import React, { createContext, useState, useEffect } from "react";
import { fetchProducts } from "./fetchProducts";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetchProducts();
        if (response.status === "success") {
          setProducts(response.data); // Set the data array from response
        } else {
          setError(response.message); // Set error message if status is not success
        }
      } catch (err) {
        setError("Error fetching products");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    getProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};
