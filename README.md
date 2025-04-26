# freelance-dashboard

Freelance Dashboard es una aplicación móvil desarrollada con React Native y Firebase que permite a freelancers gestionar sus proyectos, tareas y clientes de manera eficiente. La aplicación facilita el seguimiento del progreso en los proyectos y la organización de tareas pendientes.

## 🚀 Cómo usar

1. Clone o descargue el respositorio

```sh
git clone https://github.com/HeJimenez00/dashboard-freelance
```

2. Navegue al directorio del proyecto

```sh
cd freelance-dashboard
```

3. Instale las dependencias

```sh
npm install
```

## Configuración de Firebase

Cree un proyecto en Firebase Console
Active Authentication (con email/password)
Cree una base de datos en Firestore
Reemplace las credenciales de Firebase en el archivo FirebaseConfig.js:

```js
const firebaseConfig = {
  apiKey: "SU_API_KEY",
  authDomain: "SU_AUTH_DOMAIN",
  projectId: "SU_PROJECT_ID",
  storageBucket: "SU_STORAGE_BUCKET",
  messagingSenderId: "SU_MESSAGING_SENDER_ID",
  appId: "SU_APP_ID",
};
```

## iniciar la aplicación en modo dev

### Iniciar la aplicacion en modo desarrollo

```bash
npx expo start
```

### iOS

```bash
npx expo run:ios
```
