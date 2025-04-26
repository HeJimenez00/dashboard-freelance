import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { colors } from "../constants/colors";
import PriorityTag from "../components/UI/PriorityTag";
import TaskItem from "../components/UI/TaskItem";
import EditProjectModal from "../components/UI/EditProjectModal";
import StatusSelector from "../components/UI/StatusSelector";
import ProgressIndicator from "../components/UI/ProgressIndicator";
import {
  db,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
} from "../FirebaseConfig";
import { Date as IconDate } from "../components/icons/Date";
import { Edit } from "../components/icons/Edit";
import { Trash } from "../components/icons/Trash";

export default function ProjectDetailScreen() {
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("Descripción");
  const [newTask, setNewTask] = useState("");
  const [newIdea, setNewIdea] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [taskLoading, setTaskLoading] = useState(false);

  // Datos del proyecto
  const [projectData, setProjectData] = useState({
    id: params.id || "",
    name: params.name || "",
    client: {
      name: params.clientName || "",
      avatar: require("../assets/logo.png"),
    },
    dueDate: params.dueDate || "",
    priority: params.priority || "",
    status: params.status || "pending",
    description: "",
    tasks: [],
    ideas: [],
    resources: [],
  });

  const [editingIdea, setEditingIdea] = useState(null);

  // Cargar datos del proyecto y tareas al iniciar
  useEffect(() => {
    if (params.id) {
      fetchProjectDetails();
    } else {
      setLoading(false);
    }
  }, [params.id]);

  // Función para cargar detalles del proyecto
  const fetchProjectDetails = async () => {
    try {
      setLoading(true);

      // Obtener datos del proyecto
      const projectRef = doc(db, "projects", params.id);
      const projectSnapshot = await getDoc(projectRef);

      if (!projectSnapshot.exists()) {
        Alert.alert("Error", "No se encontró el proyecto");
        router.back();
        return;
      }

      const projectInfo = projectSnapshot.data();

      // Obtener tareas del proyecto
      const tasksQuery = query(
        collection(db, "projects", params.id, "tasks"),
        orderBy("createdAt", "asc"),
      );

      const tasksSnapshot = await getDocs(tasksQuery);
      const tasksList = [];

      tasksSnapshot.forEach((doc) => {
        tasksList.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Actualizar estado con todos los datos
      setProjectData({
        id: params.id,
        name: projectInfo.name,
        client: {
          name: projectInfo.clientName,
          avatar: require("../assets/logo.png"),
        },
        dueDate: projectInfo.dueDate,
        priority: projectInfo.priority,
        status: projectInfo.status || "pending",
        description: projectInfo.description || "",
        tasks: tasksList,
        ideas: projectInfo.ideas || [],
        resources: projectInfo.resources || [],
      });
    } catch (error) {
      console.error("Error al cargar detalles del proyecto:", error);
      Alert.alert("Error", "No se pudieron cargar los detalles del proyecto");
    } finally {
      setLoading(false);
    }
  };

  // Funciones para manejar el modal de edición
  const openEditModal = () => {
    setModalVisible(true);
  };

  const closeEditModal = () => {
    setModalVisible(false);
  };

  const saveProjectChanges = async (updatedData) => {
    try {
      // Actualizar en Firestore
      const projectRef = doc(db, "projects", projectData.id);
      await updateDoc(projectRef, {
        name: updatedData.name,
        description: updatedData.description,
        priority: updatedData.priority,
        dueDate: updatedData.dueDate,
        updatedAt: serverTimestamp(),
      });

      // Actualizar estado local
      setProjectData({
        ...projectData,
        name: updatedData.name,
        description: updatedData.description,
        priority: updatedData.priority,
        dueDate: updatedData.dueDate,
      });

      Alert.alert("Éxito", "Cambios guardados correctamente");
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      Alert.alert("Error", "No se pudieron guardar los cambios");
    }
  };

  // Función para cambiar el estado del proyecto
  const handleStatusChange = async (newStatus) => {
    try {
      // Actualizar en Firestore
      const projectRef = doc(db, "projects", projectData.id);
      await updateDoc(projectRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      // Actualizar estado local
      setProjectData({
        ...projectData,
        status: newStatus,
      });

      Alert.alert(
        "Estado actualizado",
        "El estado del proyecto ha sido actualizado correctamente.",
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      Alert.alert("Error", "No se pudo actualizar el estado del proyecto");
    }
  };

  // Función para sugerir un cambio de estado basado en el progreso
  const suggestStatusChange = (tasks) => {
    if (tasks.length === 0) return null;

    const completedTasks = tasks.filter((task) => task.completed).length;
    const percentage = (completedTasks / tasks.length) * 100;

    // Si todas las tareas están completadas, sugerir "Terminado"
    if (percentage === 100 && projectData.status !== "completed") {
      return {
        suggested: "completed",
        message:
          '¡Todas las tareas están completadas! ¿Quieres marcar este proyecto como "Terminado"?',
      };
    }

    // Si hay avance pero no está en progreso, sugerir "En progreso"
    if (
      percentage > 0 &&
      percentage < 100 &&
      projectData.status === "pending"
    ) {
      return {
        suggested: "in_progress",
        message:
          'Has comenzado a trabajar en este proyecto. ¿Quieres cambiarlo a "En progreso"?',
      };
    }

    return null;
  };

  // Función para agregar una nueva tarea
  const handleAddTask = async () => {
    if (newTask.trim() === "") return;

    try {
      setTaskLoading(true);

      // Crear nueva tarea en Firestore
      const taskData = {
        text: newTask.trim(),
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const tasksCollectionRef = collection(
        db,
        "projects",
        projectData.id,
        "tasks",
      );
      const docRef = await addDoc(tasksCollectionRef, taskData);

      // Actualizar estado local
      const newTaskItem = {
        id: docRef.id,
        text: newTask.trim(),
        completed: false,
        createdAt: new Date(),
      };

      setProjectData({
        ...projectData,
        tasks: [...projectData.tasks, newTaskItem],
      });

      setNewTask("");
      Keyboard.dismiss();
    } catch (error) {
      console.error("Error al añadir tarea:", error);
      Alert.alert("Error", "No se pudo añadir la tarea");
    } finally {
      setTaskLoading(false);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    try {
      const task = projectData.tasks.find((t) => t.id === taskId);
      if (!task) return;

      const newCompletedState = !task.completed;

      const taskRef = doc(db, "projects", projectData.id, "tasks", taskId);
      await updateDoc(taskRef, {
        completed: newCompletedState,
        updatedAt: serverTimestamp(),
      });

      const updatedTasks = projectData.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: newCompletedState } : t,
      );

      setProjectData({
        ...projectData,
        tasks: updatedTasks,
      });

      const suggestion = suggestStatusChange(updatedTasks);
      if (suggestion) {
        Alert.alert("Sugerencia", suggestion.message, [
          { text: "No ahora", style: "cancel" },
          {
            text: "Sí, cambiar",
            onPress: () => handleStatusChange(suggestion.suggested),
          },
        ]);
      }
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      Alert.alert("Error", "No se pudo actualizar la tarea");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      Alert.alert(
        "Eliminar tarea",
        "¿Estás seguro de que deseas eliminar esta tarea?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: async () => {
              const taskRef = doc(
                db,
                "projects",
                projectData.id,
                "tasks",
                taskId,
              );
              await deleteDoc(taskRef);

              const updatedTasks = projectData.tasks.filter(
                (task) => task.id !== taskId,
              );

              setProjectData({
                ...projectData,
                tasks: updatedTasks,
              });
            },
          },
        ],
      );
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      Alert.alert("Error", "No se pudo eliminar la tarea");
    }
  };

  const handleAddIdea = () => {
    if (newIdea.trim() === "") return;

    const newIdeaItem = {
      id: Date.now().toString(),
      text: newIdea.trim(),
    };

    setProjectData({
      ...projectData,
      ideas: [...projectData.ideas, newIdeaItem],
    });

    setNewIdea("");
    Keyboard.dismiss();
  };

  const startEditIdea = (idea) => {
    setEditingIdea(idea.id);
    setNewIdea(idea.text);
  };

  const saveEditIdea = () => {
    if (newIdea.trim() === "") return;

    const updatedIdeas = projectData.ideas.map((idea) =>
      idea.id === editingIdea ? { ...idea, text: newIdea.trim() } : idea,
    );

    setProjectData({
      ...projectData,
      ideas: updatedIdeas,
    });

    setNewIdea("");
    setEditingIdea(null);
    Keyboard.dismiss();
  };

  const deleteIdea = (ideaId) => {
    const updatedIdeas = projectData.ideas.filter((idea) => idea.id !== ideaId);

    setProjectData({
      ...projectData,
      ideas: updatedIdeas,
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando proyecto...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.projectTitle}>{projectData.name}</Text>
        <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
          <Text style={styles.editIcon}>
            <Edit />
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.clientSection}>
        <View style={styles.clientHeader}>
          <View style={styles.clientInfo}>
            <View style={styles.avatarContainer}>
              <Image source={projectData.client.avatar} style={styles.avatar} />
            </View>
            <View>
              <Text style={styles.clientLabel}>Cliente</Text>
              <Text style={styles.clientName}>{projectData.client.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.dueDateSection}>
          <Text style={styles.dateLabel}>Fecha de vencimiento</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.dateIcon}>
              <IconDate />
            </Text>
            <Text style={styles.date}>{projectData.dueDate}</Text>
          </View>
        </View>

        <View style={styles.priorityContainer}>
          <PriorityTag priority={projectData.priority} />
        </View>

        <StatusSelector
          currentStatus={projectData.status}
          onStatusChange={handleStatusChange}
        />
      </View>

      <View style={styles.progressContent}>
        {projectData.tasks.length > 0 && (
          <ProgressIndicator
            completed={
              projectData.tasks.filter((task) => task.completed).length
            }
            total={projectData.tasks.length}
          />
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Descripción" && styles.activeTab]}
          onPress={() => setActiveTab("Descripción")}
        >
          <Text style={styles.tabText}>Descripción</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Pensamientos" && styles.activeTab]}
          onPress={() => setActiveTab("Pensamientos")}
        >
          <Text style={styles.tabText}>Pensamientos</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido según el tab activo */}
      <ScrollView style={styles.contentContainer}>
        {activeTab === "Descripción" ? (
          <View>
            <Text style={styles.descriptionText}>
              {projectData.description}
            </Text>

            <Text style={styles.sectionTitle}>Tarea</Text>

            {/* Campo para agregar nueva tarea */}
            <View style={styles.addTaskContainer}>
              <TextInput
                style={styles.addTaskInput}
                placeholder="Agregar nueva tarea..."
                placeholderTextColor={colors.ghost}
                value={newTask}
                onChangeText={setNewTask}
                onSubmitEditing={handleAddTask}
              />
              <TouchableOpacity
                style={styles.addTaskButton}
                onPress={handleAddTask}
                disabled={taskLoading}
              >
                {taskLoading ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.addTaskButtonText}>+</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Lista de tareas */}
            {projectData.tasks.length > 0 ? (
              projectData.tasks.map((task) => (
                <View key={task.id} style={styles.taskItemContainer}>
                  <TaskItem
                    task={task.text}
                    completed={task.completed}
                    onToggle={() => toggleTaskCompletion(task.id)}
                  />
                  <TouchableOpacity
                    style={styles.deleteTaskButton}
                    onPress={() => deleteTask(task.id)}
                  >
                    <View style={styles.deleteTaskButtonText}>
                      <Trash color="#888888" />
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.emptyStateText}>
                No hay tareas. ¡Agrega algunas!
              </Text>
            )}
          </View>
        ) : (
          <View>
            {/* Sección de Ideas */}
            <Text style={styles.thoughtsSectionTitle}>Ideas</Text>

            {/* Campo para agregar o editar ideas */}
            <View style={styles.addTaskContainer}>
              <TextInput
                style={styles.addTaskInput}
                placeholder={
                  editingIdea ? "Editar idea..." : "Agregar nueva idea..."
                }
                placeholderTextColor={colors.ghost}
                value={newIdea}
                onChangeText={setNewIdea}
                onSubmitEditing={editingIdea ? saveEditIdea : handleAddIdea}
              />
              <TouchableOpacity
                style={styles.addTaskButton}
                onPress={editingIdea ? saveEditIdea : handleAddIdea}
              >
                <Text style={styles.addTaskButtonText}>
                  {editingIdea ? "✓" : "+"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Lista de ideas */}
            <View style={styles.ideasContainer}>
              {projectData.ideas.length > 0 ? (
                projectData.ideas.map((idea) => (
                  <View key={idea.id} style={styles.ideaItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.ideaText}>{idea.text}</Text>

                    <View style={styles.ideaActions}>
                      <TouchableOpacity
                        style={styles.ideaActionButton}
                        onPress={() => startEditIdea(idea)}
                      >
                        <Text style={styles.actionText}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.ideaActionButton}
                        onPress={() => deleteIdea(idea.id)}
                      >
                        <Text style={styles.actionText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyStateText}>
                  No hay ideas. ¡Agrega algunas!
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sección inferior fija con botón para guardar cambios */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() =>
            Alert.alert(
              "Cambios guardados",
              "Los cambios se han guardado correctamente.",
            )
          }
        >
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para editar la información del proyecto */}
      <EditProjectModal
        visible={modalVisible}
        onClose={closeEditModal}
        projectData={projectData}
        onSave={saveProjectChanges}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: colors.white,
    marginTop: 10,
    fontSize: 16,
  },
  subHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 24,
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
  },
  progressContent: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  editButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    fontSize: 20,
  },
  clientSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  clientHeader: {
    marginBottom: 15,
  },
  clientLabel: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 5,
  },
  clientInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFBB33",
    overflow: "hidden",
    marginRight: 10,
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  clientName: {
    color: colors.ghost,
    fontSize: 16,
  },
  dueDateSection: {
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 5,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  date: {
    color: colors.ghost,
    fontSize: 16,
  },
  priorityContainer: {
    marginBottom: 15,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
    justifyContent: "space-between",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: colors["fg-secondary"],
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.white,
    fontWeight: "500",
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 80, // Espacio para el botón fijo en la parte inferior
  },
  descriptionText: {
    color: colors.ghost,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
  },
  addTaskContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  addTaskInput: {
    flex: 1,
    backgroundColor: colors["fg-primary"],
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: colors.white,
    marginRight: 10,
  },
  addTaskButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addTaskButtonText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "bold",
  },
  taskItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  deleteTaskButton: {
    marginLeft: 10,
    padding: 5,
  },
  deleteTaskButtonText: {
    width: 20,
    height: 20,
    color: colors.ghost,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: colors.white,
  },

  // Estilos para la sección de pensamientos
  thoughtsSectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
  },
  ideasContainer: {
    backgroundColor: colors["fg-primary"],
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  ideaItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  bulletPoint: {
    color: colors.white,
    fontSize: 20,
    marginRight: 8,
    marginTop: -4,
  },
  ideaText: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  ideaActions: {
    flexDirection: "row",
    marginLeft: 10,
  },
  ideaActionButton: {
    padding: 5,
  },
  actionText: {
    fontSize: 16,
  },

  // Pie de página fijo con botón de guardar
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors["fg-primary"],
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
