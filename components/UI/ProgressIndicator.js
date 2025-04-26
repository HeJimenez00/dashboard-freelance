// components/UI/ProgressIndicator.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

const ProgressIndicator = ({ completed, total }) => {
  // Calcular el porcentaje de progreso
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Determinar el color según el progreso
  const getProgressColor = () => {
    if (percentage < 30) return colors.error;
    if (percentage < 70) return colors.primary;
    return colors.success;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progreso</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${percentage}%`, backgroundColor: getProgressColor() },
          ]}
        />
      </View>

      <Text style={styles.tasksCount}>
        {completed} de {total} tareas completadas
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  percentage: {
    color: colors.white,
    fontSize: 14,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors["fg-secondary"],
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 5,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  tasksCount: {
    color: colors.ghost,
    fontSize: 12,
    textAlign: "right",
  },
});

export default ProgressIndicator;
