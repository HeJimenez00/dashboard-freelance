import React from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";

/**
 * Layout principal de la aplicación que proporciona:
 * - SafeAreaView para manejar espaciados en notch y barra de navegación
 * - Background color unificado
 * - StatusBar configurada
 */
const AppLayout = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});

export default AppLayout;
