import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
} from "react-native";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import ProjectCard from "./ProjectCard";
import { colors } from "../../constants/colors";

const SwipeableProjectCard = ({ project, onPress, onDelete }) => {
  // Renderiza la acción de eliminación que aparece al deslizar
  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.deleteContainer}>
        <Animated.View
          style={[
            styles.deleteAction,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Eliminar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions} rightThreshold={40}>
        <ProjectCard
          client={project.client}
          projectName={project.projectName}
          description={project.description}
          priority={project.priority}
          dueDate={project.dueDate}
          onPress={onPress}
        />
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  deleteContainer: {
    width: 100,
    marginBottom: 15,
  },
  deleteAction: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: colors.error,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  deleteText: {
    color: colors.white,
    fontWeight: "bold",
    padding: 20,
  },
});

export default SwipeableProjectCard;
