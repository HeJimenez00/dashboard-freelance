import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { colors } from "../../constants/colors";
import { ArrowRight } from "../icons/ArrowRight";
import { Date } from "../icons/Date";

const ProjectCard = ({
  client = {
    name: "",
    avatar: null,
  },
  projectName = "",
  description = "",
  priority = "",
  dueDate = "",
  onPress,
}) => {
  const getPriorityStyle = () => {
    switch (priority.toLowerCase()) {
      case "alta":
        return { backgroundColor: colors.error };
      case "baja":
        return { backgroundColor: colors.success };
      default:
        return { backgroundColor: colors.primary };
    }
  };

  const defaultAvatar = require("../../assets/logo.png");

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.clientInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={client.avatar || defaultAvatar}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.clientName}>{client.name}</Text>
        </View>
        <View style={styles.chevron}>
          <ArrowRight color="white" />
        </View>
      </View>

      {/* Contenido del proyecto */}
      <View style={styles.content}>
        <Text style={styles.projectName}>{projectName}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>

        {/* Badge de prioridad */}
        <View style={styles.badgeContainer}>
          <View style={[styles.priorityBadge, getPriorityStyle()]}>
            <Text style={styles.priorityText}>{priority}</Text>
          </View>
        </View>

        {/* Fecha de vencimiento */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Fecha de vencimiento</Text>
          <View style={styles.dateWrapper}>
            <View style={styles.dateIcon}>
              <Date />
            </View>
            <Text style={styles.date}>{dueDate}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors["fg-secondary"],
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  clientInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    overflow: "hidden",
    marginRight: 10,
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  clientName: {
    color: colors.white,
    fontWeight: "bold",
  },
  chevron: {
    display: "flex",
    color: colors.white,
    fontSize: 24,
    backgroundColor: colors["fg-primary"],
    padding: 10,
    borderRadius: 50,
  },
  content: {
    padding: 15,
    paddingTop: 0,
  },
  projectName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    color: colors.ghost,
    fontSize: 14,
    marginBottom: 10,
  },
  badgeContainer: {
    marginBottom: 10,
  },
  priorityBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  priorityText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  dateContainer: {
    marginTop: 5,
  },
  dateLabel: {
    color: colors.white,
    fontSize: 14,
    marginBottom: 2,
  },
  dateWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateIcon: {
    marginRight: 5,
    fontSize: 14,
  },
  date: {
    color: colors.ghost,
    fontSize: 14,
  },
});

export default ProjectCard;
