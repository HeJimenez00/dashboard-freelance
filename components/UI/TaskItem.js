// components/UI/TaskItem.js
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { colors } from "../../constants/colors";

const TaskItem = ({ task, completed, onToggle, onLongPress }) => {
  return (
    <TouchableOpacity
      style={styles.taskItemContainer}
      onPress={onToggle}
      onLongPress={onLongPress}
      delayLongPress={500}
      testID="task-checkbox" // Añade esta línea
    >
      <View style={styles.taskItem}>
        <TouchableOpacity
          style={[styles.checkbox, completed && styles.checkboxCompleted]}
          onPress={onToggle}
        >
          {completed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <Text style={[styles.taskText, completed && styles.taskTextCompleted]}>
          {task}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  taskItemContainer: {
    flex: 1,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors["fg-primary"],
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.ghost,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  taskText: {
    color: colors.white,
    fontSize: 14,
    flex: 1,
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: colors.ghost,
  },
});

export default TaskItem;
