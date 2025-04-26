import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "../FirebaseConfig";
import { colors } from "../constants/colors";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    try {
      setLoading(true);

      if (isRegistering) {
        // Crear cuenta nueva
        if (!name) {
          Alert.alert("Error", "Por favor ingresa tu nombre");
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        // Actualizar perfil con el nombre
        await updateProfile(userCredential.user, {
          displayName: name,
        });

        Alert.alert("¡Éxito!", "Cuenta creada correctamente");
        router.replace("/dashboard");
      } else {
        // Iniciar sesión
        await signInWithEmailAndPassword(auth, email, password);
        router.replace("/dashboard");
      }
    } catch (error) {
      let errorMessage = "Ocurrió un error. Inténtalo de nuevo.";

      // Mensajes de error más amigables según el código de error
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este correo ya está registrado.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "El formato del correo es inválido.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "La contraseña debe tener al menos 6 caracteres.";
      } else if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage = "Correo o contraseña incorrectos.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Alternar entre inicio de sesión y registro
  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>
          {isRegistering ? "Crea una cuenta" : "Inicia sesión"}
        </Text>

        {isRegistering && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={name}
              onChangeText={setName}
              placeholderTextColor={colors.ghost}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={colors.ghost}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={colors.ghost}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          onPress={handleAuth}
          style={styles.button}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>
              {isRegistering ? "Crear cuenta" : "Iniciar sesión"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleAuthMode}
          style={styles.switchModeButton}
        >
          <Text style={styles.switchModeText}>
            {isRegistering
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
  form: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
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
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    backgroundColor: colors["fg-primary"],
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    color: colors.white,
    width: "100%",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  switchModeButton: {
    marginTop: 20,
    padding: 10,
  },
  switchModeText: {
    color: colors.primary,
    fontSize: 14,
  },
});
