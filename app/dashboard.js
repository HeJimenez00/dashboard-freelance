import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { colors } from "../constants/colors";
import SwipeableProjectCard from "../components/UI/SwipeableProjectCard";
import AppLayout from "../components/layouts/AppLayout";
import {
  auth,
  db,
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
  onAuthStateChanged,
  signOut,
} from "../FirebaseConfig";

export default function DashboardScreen() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Por hacer");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verificar estado de autenticación y cargar proyectos
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // Si no hay usuario autenticado, redirigir a login
        router.replace("/login");
        return;
      }
      // Guardar la información del usuario
      setUser(currentUser);

      // Cargar proyectos del usuario
      fetchProjects(currentUser.uid, activeTab);
    });

    // Limpiar el listener cuando se desmonta el componente
    return () => unsubscribe();
  }, []);

  // Cargar proyectos cuando cambia la pestaña activa
  useEffect(() => {
    if (user) {
      fetchProjects(user.uid, activeTab);
    }
  }, [activeTab]);

  // Función para convertir estado de pestaña a valor de la base de datos
  const getProjectStatus = (tabName) => {
    switch (tabName) {
      case "Por hacer":
        return "pending";
      case "En progreso":
        return "in_progress";
      case "Terminados":
        return "completed";
      default:
        return "pending";
    }
  };

  // Función para obtener proyectos de Firestore
  const fetchProjects = async (userId, tabName) => {
    try {
      setLoading(true);

      const status = getProjectStatus(tabName);

      // Consulta para obtener proyectos del usuario con el estado seleccionado
      const projectsQuery = query(
        collection(db, "projects"),
        where("userId", "==", userId),
        where("status", "==", status),
        orderBy("createdAt", "desc"),
      );

      const querySnapshot = await getDocs(projectsQuery);

      const projectsList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        projectsList.push({
          id: doc.id,
          client: {
            name: data.clientName,
            avatar: require("../assets/logo.png"), // Usar avatar local
          },
          projectName: data.name,
          description: data.description,
          priority: data.priority,
          dueDate: data.dueDate,
          status: data.status,
        });
      });

      setProjects(projectsList);
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
      Alert.alert("Error", "No se pudieron cargar los proyectos");
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar la sesión");
    }
  };

  // Función para eliminar un proyecto
  const handleDeleteProject = async (projectId) => {
    try {
      // Eliminar de Firestore
      await deleteDoc(doc(db, "projects", projectId));

      // Actualizar estado local
      setProjects(projects.filter((project) => project.id !== projectId));

      Alert.alert("Éxito", "Proyecto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
      Alert.alert("Error", "No se pudo eliminar el proyecto");
    }
  };

  return (
    <AppLayout>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
        </View>
        <Text style={styles.greeting}>
          ¿Qué pasa,&nbsp;
          <Text style={styles.username}>
            {user?.displayName || user?.email?.split("@")[0] || "usuario"}
          </Text>
          ?
        </Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Por hacer" && styles.activeTab]}
          onPress={() => setActiveTab("Por hacer")}
        >
          <Text style={styles.tabText}>Por hacer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "En progreso" && styles.activeTab]}
          onPress={() => setActiveTab("En progreso")}
        >
          <Text style={styles.tabText}>En progreso</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Terminados" && styles.activeTab]}
          onPress={() => setActiveTab("Terminados")}
        >
          <Text style={styles.tabText}>Terminados</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando proyectos...</Text>
        </View>
      ) : (
        <ScrollView style={styles.projectsContainer}>
          {projects.length > 0 ? (
            projects.map((project) => (
              <SwipeableProjectCard
                key={project.id}
                project={project}
                onPress={() =>
                  router.push({
                    pathname: "/project-details",
                    params: {
                      id: project.id,
                      name: project.projectName,
                      clientName: project.client.name,
                      dueDate: project.dueDate,
                      priority: project.priority,
                      status: project.status,
                    },
                  })
                }
                onDelete={() => handleDeleteProject(project.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Empieza por crear un proyecto
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Botón flotante "+" para agregar proyectos */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/add-project")}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 10,
  },
  logoutButton: {
    marginLeft: 10,
  },
  logoutText: {
    color: colors.error,
  },
  logoContainer: {
    alignItems: "flex-start",
    marginBottom: 30,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  greeting: {
    fontSize: 24,
    color: colors.white,
    fontWeight: "bold",
  },
  username: {
    color: colors.primary,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 20,
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
  projectsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
  loadingText: {
    color: colors.white,
    marginTop: 10,
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
  emptyStateText: {
    color: colors.ghost,
    fontSize: 18,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors["fg-primary"],
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addButtonText: {
    fontSize: 30,
    color: colors.white,
  },
});
