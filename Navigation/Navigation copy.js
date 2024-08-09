import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Components/Login";
import ProductList from "../Components/ProductList";
import Nucleus from "../Components/Nucleus";
import BarcodeScanner from "../Components/BarcodeScanner";

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="ProductList"
          component={ProductList}
          options={{ title: "Products" }}
        />
        <Stack.Screen
          name="Nucleus"
          component={Nucleus}
          options={{ title: "Nucleus" }}
        />
        <Stack.Screen
          name="BarcodeScanner"
          component={BarcodeScanner}
          options={{ title: "Scan Barcode" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
