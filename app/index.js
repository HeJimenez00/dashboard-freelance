import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View, Text, Image } from "react-native";
import { colors } from "../constants/colors";
import AppLayout from "../components/layouts/AppLayout";
import { router } from "expo-router";
import { auth, onAuthStateChanged } from "../FirebaseConfig";

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setTimeout(() => {
        if (user) {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
        setIsLoading(false);
      }, 1500);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AppLayout>
      <View style={styles.container}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Freelance Dashboard</Text>
        {isLoading && (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        )}
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  },
});
