import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { colors } from "../../constants/colors";

const PriorityTag = ({ priority }) => {
  const getPriorityStyle = () => {
    switch (priority.toLowerCase()) {
      case "alta":
        return styles.highPriority;
      case "media":
        return styles.mediumPriority;
      case "baja":
        return styles.lowPriority;
      default:
        return styles.mediumPriority;
    }
  };

  return (
    <View style={[styles.tag, getPriorityStyle()]}>
      <Text style={styles.text}>{priority}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  highPriority: {
    backgroundColor: colors.error, // Rojo para prioridad Alta
  },
  mediumPriority: {
    backgroundColor: colors.primary, // Naranja para prioridad Media
  },
  lowPriority: {
    backgroundColor: colors.success, // Verde para prioridad Baja
  },
  text: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default PriorityTag;
