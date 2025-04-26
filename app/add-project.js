import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { colors } from "../constants/colors";
import {
  auth,
  db,
  collection,
  addDoc,
  serverTimestamp,
} from "../FirebaseConfig";
import { Date as DateIcon } from "../components/icons/Date";

export default function AddProjectScreen() {
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Media");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const [initialTasks, setInitialTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");

  const formatDate = (date) => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const priorityOptions = ["Alta", "Media", "Baja"];

  // Funcion para añadir una tarea inicial
  const addInitialTask = () => {
    if (!newTaskText.trim()) return;

    setInitialTasks([
      ...initialTasks,
      { text: newTaskText.trim(), completed: false },
    ]);
    setNewTaskText("");
  };

  // Funcion para eliminar una tarea inicial
  const removeInitialTask = (index) => {
    const newTasks = [...initialTasks];
    newTasks.splice(index, 1);
    setInitialTasks(newTasks);
  };

  const saveProject = async () => {
    if (!projectName || !clientName) {
      Alert.alert("Error", "Por favor completa los campos obligatorios");
      return;
    }

    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        throw new Error("No hay usuario autenticado");
      }

      // Crear documento en Firestore
      const projectData = {
        name: projectName,
        clientName: clientName,
        description: description || "",
        priority: priority,
        dueDate: formatDate(date),
        status: "pending", // Por hacer
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Añadir a la colección de proyectos
      const projectRef = await addDoc(collection(db, "projects"), projectData);

      const tasksCollectionRef = collection(
        db,
        "projects",
        projectRef.id,
        "tasks",
      );

      const taskPromises = initialTasks.map((task) =>
        addDoc(tasksCollectionRef, {
          text: task.text,
          completed: task.completed,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }),
      );

      await Promise.all(taskPromises);

      Alert.alert("¡Éxito!", "Proyecto creado correctamente", [
        {
          text: "OK",
          onPress: () => router.replace("/dashboard"),
        },
      ]);
    } catch (error) {
      console.error("Error al crear proyecto:", error);
      Alert.alert("Error", "No se pudo crear el proyecto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuevo Proyecto</Text>
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre del proyecto *</Text>
          <TextInput
            style={styles.input}
            value={projectName}
            onChangeText={setProjectName}
            placeholder="Nombre del proyecto"
            placeholderTextColor={colors.ghost}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre del cliente *</Text>
          <TextInput
            style={styles.input}
            value={clientName}
            onChangeText={setClientName}
            placeholder="Nombre del cliente"
            placeholderTextColor={colors.ghost}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción del proyecto"
            placeholderTextColor={colors.ghost}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Prioridad</Text>
          <View style={styles.priorityContainer}>
            {priorityOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.priorityOption,
                  priority === option &&
                    (option === "Alta"
                      ? styles.highPriority
                      : option === "Media"
                        ? styles.mediumPriority
                        : styles.lowPriority),
                ]}
                onPress={() => setPriority(option)}
              >
                <Text
                  style={[
                    styles.priorityText,
                    priority === option && styles.activePriorityText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Fecha de vencimiento</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={showDatepicker}
          >
            <Text style={styles.dateText}>{formatDate(date)}</Text>
            <View style={styles.calendarIcon}>
              <DateIcon />
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChange}
              minimumDate={new Date()}
              themeVariant="dark"
              style={styles.datePicker}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tareas iniciales</Text>

          <View style={styles.taskInputContainer}>
            <TextInput
              style={styles.taskInput}
              value={newTaskText}
              onChangeText={setNewTaskText}
              placeholder="Agregar una tarea inicial..."
              placeholderTextColor={colors.ghost}
              onSubmitEditing={addInitialTask}
            />
            <TouchableOpacity
              style={styles.addTaskButton}
              onPress={addInitialTask}
            >
              <Text style={styles.addTaskButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {initialTasks.length > 0 ? (
            <View style={styles.tasksList}>
              {initialTasks.map((task, index) => (
                <View key={index} style={styles.taskItem}>
                  <Text style={styles.taskItemText}>{task.text}</Text>
                  <TouchableOpacity
                    style={styles.removeTaskButton}
                    onPress={() => removeInitialTask(index)}
                  >
                    <Text style={styles.removeTaskButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noTasksText}>
              No hay tareas iniciales. Agrega algunas para empezar a trabajar en
              este proyecto.
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveProject}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Proyecto</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.bg,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 24,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: colors.white,
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors["fg-primary"],
    borderRadius: 8,
    padding: 12,
    color: colors.white,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityOption: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: colors["fg-secondary"],
    alignItems: "center",
  },
  highPriority: {
    backgroundColor: colors.error,
  },
  mediumPriority: {
    backgroundColor: colors.primary,
  },
  lowPriority: {
    backgroundColor: colors.success,
  },
  priorityText: {
    color: colors.ghost,
    fontSize: 14,
  },
  activePriorityText: {
    color: colors.white,
    fontWeight: "bold",
  },
  datePickerButton: {
    backgroundColor: colors["fg-primary"],
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    color: colors.white,
    fontSize: 16,
  },
  calendarIcon: {
    fontSize: 16,
  },
  datePicker: {
    marginTop: 10,
    backgroundColor: colors["fg-primary"],
    borderRadius: 8,
  },
  taskInputContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  taskInput: {
    flex: 1,
    backgroundColor: colors["fg-primary"],
    borderRadius: 8,
    padding: 12,
    color: colors.white,
    fontSize: 16,
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
    fontWeight: "semibold",
  },
  tasksList: {
    marginTop: 10,
  },
  taskItem: {
    flexDirection: "row",
    backgroundColor: colors["fg-primary"],
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  taskItemText: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
  },
  removeTaskButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors["fg-secondary"],
    justifyContent: "center",
    alignItems: "center",
  },
  removeTaskButtonText: {
    color: colors.white,
    fontSize: 14,
  },
  noTasksText: {
    color: colors.ghost,
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: colors.bg,
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
