import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../../constants/colors";
import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../../FirebaseConfig";

const ProjectImagePicker = ({
  projectId,
  currentImageUrl,
  onImageUploaded,
}) => {
  const [image, setImage] = useState(currentImageUrl);
  const [uploading, setUploading] = useState(false);

  // Solicitar permisos para acceder a la galería
  const requestPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Se necesita acceso a la galería para seleccionar imágenes",
        );
        return false;
      }
      return true;
    }
    return true;
  };

  // Seleccionar imagen de la galería
  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error al seleccionar la imagen:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
    }
  };

  // Tomar foto con la cámara
  const takePhoto = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Se necesita acceso a la cámara para tomar fotos",
        );
        return;
      }
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error al tomar la foto:", error);
      Alert.alert("Error", "No se pudo tomar la foto");
    }
  };

  // Subir imagen a Firebase Storage
  const uploadImage = async (uri) => {
    if (!uri) return;

    setUploading(true);

    try {
      // Convertir imagen a blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Generar nombre de archivo único
      const filename = `project_${projectId}_${new Date().getTime()}`;
      const storageRef = ref(storage, `projects/${filename}`);

      // Subir a Firebase Storage
      await uploadBytes(storageRef, blob);

      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(storageRef);

      // Actualizar estado local
      setImage(downloadURL);

      // Notificar al componente padre
      if (onImageUploaded) {
        onImageUploaded(downloadURL);
      }

      Alert.alert("Éxito", "Imagen subida correctamente");
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      Alert.alert("Error", "No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  // Mostrar opciones para seleccionar imagen
  const showImageOptions = () => {
    Alert.alert(
      "Cambiar imagen del proyecto",
      "¿Cómo quieres agregar una imagen?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Tomar foto", onPress: takePhoto },
        { text: "Seleccionar de la galería", onPress: pickImage },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={showImageOptions}
        disabled={uploading}
      >
        {uploading ? (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.uploadingText}>Subiendo...</Text>
          </View>
        ) : image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <Text style={styles.placeholderText}>Agregar imagen</Text>
          </View>
        )}
      </TouchableOpacity>

      {image && !uploading && (
        <TouchableOpacity
          style={styles.changeImageButton}
          onPress={showImageOptions}
        >
          <Text style={styles.changeImageText}>Cambiar imagen</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: colors["fg-primary"],
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  placeholderText: {
    color: colors.white,
    fontSize: 16,
  },
  uploadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  uploadingText: {
    color: colors.white,
    marginTop: 10,
    fontSize: 14,
  },
  changeImageButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors["fg-secondary"],
    borderRadius: 8,
  },
  changeImageText: {
    color: colors.white,
    fontSize: 14,
  },
});

export default ProjectImagePicker;
