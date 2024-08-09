import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ProductContext } from "../Services/ProductContext";

const ProductList = () => {
  const { products } = useContext(ProductContext);

  return (
    <View style={styles.container}>
      {products.length > 0 ? (
        products.map((product) => (
          <View key={product.VariationID} style={styles.productContainer}>
            <Text style={styles.productName}>{product.Name}</Text>
            <Text style={styles.productPrice}>{`$${product.Price}`}</Text>
          </View>
        ))
      ) : (
        <Text>Loading products...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  productContainer: {
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    color: "green",
  },
});

export default ProductList;
