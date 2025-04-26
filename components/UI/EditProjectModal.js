import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors } from "../../constants/colors";

const EditProjectModal = ({ visible, onClose, projectData, onSave }) => {
  const [name, setName] = useState(projectData.name);
  const [description, setDescription] = useState(projectData.description);
  const [priority, setPriority] = useState(projectData.priority);

  // Parseamos la fecha a partir del formato DD/MM/YYYY
  const parseDateFromString = (dateString) => {
    // Formato esperado: "9/Abril/2025" o similar
    if (!dateString) return new Date();

    const months = {
      Enero: 0,
      Febrero: 1,
      Marzo: 2,
      Abril: 3,
      Mayo: 4,
      Junio: 5,
      Julio: 6,
      Agosto: 7,
      Septiembre: 8,
      Octubre: 9,
      Noviembre: 10,
      Diciembre: 11,
    };

    try {
      const parts = dateString.split("/");
      const day = parseInt(parts[0], 10);
      const month = months[parts[1]] || 0; // Si no reconoce el mes, usa enero
      const year = parseInt(parts[2], 10);

      return new Date(year, month, day);
    } catch (e) {
      return new Date(); // Fecha actual por defecto si hay error
    }
  };

  // Formatear fecha para mostrar en formato español
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

  const [date, setDate] = useState(parseDateFromString(projectData.dueDate));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios"); // En iOS el picker no se cierra automáticamente
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleSave = () => {
    if (name.trim() === "") return;

    // Guardar cambios
    onSave({
      name,
      description,
      priority,
      dueDate: formatDate(date),
    });

    // Cerrar modal
    onClose();
  };

  // Opciones de prioridad
  const priorityOptions = ["Alta", "Media", "Baja"];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar proyecto</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre del proyecto</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nombre del proyecto"
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
                <Text style={styles.calendarIcon}>📅</Text>
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

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: colors["fg-secondary"],
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    color: colors.white,
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors["fg-primary"],
    borderRadius: 8,
    padding: 12,
    color: colors.white,
    fontSize: 14,
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
    borderRadius: 30,
    paddingVertical: 8,
    marginHorizontal: 5,
    backgroundColor: colors["fg-primary"],
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
    fontSize: 14,
  },
  calendarIcon: {
    fontSize: 16,
  },
  datePicker: {
    marginTop: 10,
    backgroundColor: colors["fg-primary"],
    borderRadius: 8,
    ...(Platform.OS === "ios" && {
      width: "100%",
    }),
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProjectModal;
