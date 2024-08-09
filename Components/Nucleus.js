import React, { useState, useEffect, useRef, useContext } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import BarReader from "./BarcodeScanner";

import ProductList from "./ProductList";
import SalesTransaction from "../Services/sales";
import * as Location from "expo-location";
import { UserContext } from "../Services/UserContext"; // Import UserContext

export default function Nucleus() {
  const { user } = useContext(UserContext); // Get user from context
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const blinkCount = useRef(0);

  // alert(JSON.stringify(user));
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let locationText = "Waiting..";
  if (errorMsg) {
    locationText = errorMsg;
  } else if (location) {
    locationText = JSON.stringify(location);
  }

  async function showLocation() {
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);

    setIsBlinking(true);
    blinkCount.current = 0;

    const blinkInterval = setInterval(() => {
      setIsBlinking((prevState) => !prevState);

      blinkCount.current += 1;
      if (blinkCount.current >= 4) {
        clearInterval(blinkInterval);
        setIsBlinking(false);
      }
    }, 500);
  }

  const [scanned, setScanned] = useState(false);
  const byeEmoji = String.fromCodePoint(0x1f44b);
  const cannabisLeafEmoji = String.fromCodePoint(0x1f33f);
  const cashEmoji = String.fromCodePoint(0x1f4b5);
  const creditCardEmoji = String.fromCodePoint(0x1f4b3);
  const moneyBagEmoji = String.fromCodePoint(0x1f4b0);
  let gpsLocation = String.fromCodePoint(0x1f6f0);

  const [myList, setMyList] = useState([]);
  const total = myList.reduce(
    (sum, product) => sum + parseFloat(product.price.replace("$", "")),
    0
  );
  let StateTax = total * 0.0875;
  let theTotal = total + StateTax;

  function savetoDB(transactionType) {
    showLocation().then(() => {
      if (myList.length === 0) {
        alert("No Products Scanned Yet");
        return;
      }

      const saleTransaction = {
        retailerEmail: user.email, // Use user.email from context
        locationSold: locationText,
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
        SalesRevenue: total,
        FederalTax: 0,
        StateTax: StateTax,
        Total: theTotal,
        saleDetails: myList,
        transactionType: transactionType,
      };

      SalesTransaction(saleTransaction).then((d) => {
        alert(d.message);
        setMyList([]);
      });
    });
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.mainHeading}>Silo's Inventory Scanner</Text> */}
      <Text style={styles.mainHeading}>{user.company}</Text>

      <Pressable
        disabled={false}
        style={[styles.locationButton, isBlinking && styles.blinkingButton]}
      >
        <Text style={styles.locationButtonText}>{gpsLocation}</Text>
      </Pressable>
      {scanned ? (
        <>
          <Pressable
            style={styles.byeButton}
            onPress={() => props.setAuth(false)}
          >
            <Text style={styles.textColor}>{byeEmoji}</Text>
          </Pressable>

          <View style={{ flex: 1 }}>
            <ProductList products={myList} setProductList={setMyList} />

            <View style={styles.totalTaxContainer}>
              <Text style={styles.totalText}>Total Tax</Text>
              <Text style={styles.totalText}>${StateTax.toFixed(2)}</Text>
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total</Text>
              <View style={styles.doubleUnderline}>
                <View style={styles.innerUnderline}>
                  <Text style={[styles.totalText]}>${theTotal.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.scanButton}>
            <Pressable style={styles.button} onPress={() => setScanned(false)}>
              <Text style={styles.textColor}> {cannabisLeafEmoji} </Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => savetoDB("Cash")}>
              <Text style={styles.textColor}> {cashEmoji}</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => savetoDB("Credit Card")}
            >
              <Text style={styles.textColor}> {creditCardEmoji}</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => savetoDB("Other Unknown Mode")}
            >
              <Text style={styles.textColor}> {moneyBagEmoji}</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <BarReader
          scanned={scanned}
          setScanned={setScanned}
          myList={myList}
          setMyList={setMyList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "wheat",
  },
  mainHeading: {
    marginTop: 16,
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    fontVariant: "small-caps",
  },
  textColor: {
    color: "white",
  },
  scanButton: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "black",
    width: 70,
  },
  byeButton: {
    position: "absolute",
    top: -40,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "red",
  },
  locationButton: { position: "absolute", top: -40, left: 0 },
  locationButtonText: { fontSize: 25 },
  blinkingButton: {
    opacity: 0.5, // Example blink effect style (reduce opacity)
  },
  totalContainer: {
    marginTop: 10,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "gray",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalTaxContainer: {
    marginTop: 1,
    padding: 10,
    borderBottomColor: "gray",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  doubleUnderline: {
    borderBottomWidth: 3,
    borderBottomColor: "green",
    paddingBottom: 1,
  },
  innerUnderline: {
    borderBottomWidth: 3,
    borderBottomColor: "green",
    paddingBottom: 1,
  },
});
