import React from "react";
import { StyleSheet, View } from "react-native";
import { UserProvider } from "./Services/UserContext";
import { ProductProvider } from "./Services/ProductContext";
import Navigation from "./Navigation/Navigation";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <View style={styles.container}>
          <Navigation />
          <StatusBar style="auto" />
        </View>
      </ProductProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
