import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import axios from "axios";
import { UserContext } from "../Services/UserContext";

const Login = ({ navigation }) => {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://silotosidewalks.com/app/REST/v2/userAuthSerialSell.php",
        { email, password }
      );

      if (response.data.status === "success") {
        const { email, company, fullname, role, status } = response.data.user;
        login({ email, company, fullname, role, status });
        Alert.alert("Login Successful", `Welcome back, ${fullname}!`);
        setEmail("");
        setPassword("");
        navigation.navigate("Nucleus"); // Updated navigation
      } else {
        setError(response.data.message || "Login failed");
        Alert.alert("Login Failed", "Please try again.");
        setPassword("");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/icon.png")} style={styles.logo} />
      <Text style={styles.header}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
});

export default Login;
