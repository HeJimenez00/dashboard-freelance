import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { colors } from "../../constants/colors";

const StatusSelector = ({ currentStatus, onStatusChange }) => {
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Por hacer";
      case "in_progress":
        return "En progreso";
      case "completed":
        return "Terminado";
      default:
        return "Por hacer";
    }
  };

  const getStatusValue = (statusText) => {
    switch (statusText) {
      case "Por hacer":
        return "pending";
      case "En progreso":
        return "in_progress";
      case "Terminado":
        return "completed";
      default:
        return "pending";
    }
  };

  const statuses = ["Por hacer", "En progreso", "Terminado"];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Estado del proyecto:</Text>
      <View style={styles.statusContainer}>
        {statuses.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusOption,
              getStatusText(currentStatus) === status &&
                (status === "Por hacer"
                  ? styles.pendingStatus
                  : status === "En progreso"
                    ? styles.inProgressStatus
                    : styles.completedStatus),
            ]}
            onPress={() => onStatusChange(getStatusValue(status))}
          >
            <Text
              style={[
                styles.statusText,
                getStatusText(currentStatus) === status &&
                  styles.activeStatusText,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginTop: 10,
  },
  label: {
    color: colors.white,
    fontSize: 16,
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusOption: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: colors["fg-secondary"],
    alignItems: "center",
  },
  pendingStatus: {
    backgroundColor: colors.error, // Rojo para "Por hacer"
  },
  inProgressStatus: {
    backgroundColor: colors.primary, // Naranja para "En progreso"
  },
  completedStatus: {
    backgroundColor: colors.success, // Verde para "Terminado"
  },
  statusText: {
    color: colors.ghost,
    fontSize: 14,
  },
  activeStatusText: {
    color: colors.white,
    fontWeight: "bold",
  },
});

export default StatusSelector;
