import React, { useContext } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { ProductContext } from "../Services/ProductContext";

let uuid = 0;

export default function BarReader(props) {
  const { products } = useContext(ProductContext); // Access products from context
  const { scanned, setScanned, setMyList, myList } = props;

  const handleBarCodeScanned = ({ type, data }) => {
    uuid = uuid + 1;
    const serialNumber = data;

    const scannedProduct = products.find(
      (product) => product.Serial_Number === serialNumber
    );

    if (scannedProduct) {
      const newItem = {
        id: uuid,
        productId: scannedProduct.VariationID,
        productName: scannedProduct.Name,
        price: scannedProduct.Price.toString(),
        serial: scannedProduct.Serial_Number,
      };

      setMyList([...myList, newItem]);
    } else {
      Alert.alert(
        "Product Not Found",
        "This serial number " + serialNumber + " does not match any product."
      );
      // alert(JSON.stringify(products));
      alert(JSON.stringify(scannedProduct));
    }

    setScanned(true);
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10, // This will start the component right below the SafeAreaView
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 0,
    maxHeight: 600,
  },
});
