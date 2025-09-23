# 📸 Fotos Firebase

Aplicación web desarrollada en **Angular 16** que permite **subir, visualizar y eliminar imágenes** utilizando **Firebase Storage** y **Firestore**.

Incluye manejo de **SweetAlert2** para notificaciones y **drag & drop** para cargar archivos de forma intuitiva.

Este proyecto se desarrolló como práctica para reforzar conceptos clave como:

- Integración con Firebase (Storage y Firestore)
- Directivas personalizadas para **drag & drop**
- Formularios reactivos
- Uso de servicios en Angular
- Validaciones de archivos (tipo y tamaño)
- Persistencia y visualización de datos

## 📸 Demo

🔗 **Visita la demo en línea:** [Fotos Firebase App en Netlify](https://melodic-mooncake-69f589.netlify.app)

- **Pantalla principal** – Selección de archivos para subir  
  ![Carga de imágenes](https://raw.githubusercontent.com/david99cartagena/FotosFirebase/refs/heads/main/media/Screenshot_1.png)
- **Carga de imágenes** con progreso visual
  ![Carga de imágenes](https://raw.githubusercontent.com/david99cartagena/FotosFirebase/refs/heads/main/media/Screenshot_2.png)
- **Visualización de imágenes subidas**
  ![Carga de imágenes](https://raw.githubusercontent.com/david99cartagena/FotosFirebase/refs/heads/main/media/Screenshot_3.png)
- **Eliminación de imágenes** con confirmación
  ![Carga de imágenes](https://raw.githubusercontent.com/david99cartagena/FotosFirebase/refs/heads/main/media/Screenshot_4.png)
  ![Carga de imágenes](https://raw.githubusercontent.com/david99cartagena/FotosFirebase/refs/heads/main/media/Screenshot_5.png)
- **Firebase ( Firestore y Storage )**
  ![Carga de imágenes](https://raw.githubusercontent.com/david99cartagena/FotosFirebase/refs/heads/main/media/Screenshot_6.png)

## 🚀 Tecnologías Utilizadas

- **Angular 16**
- **Firebase ( Firestore y Storage )**
- **@angular/fire**
- **SweetAlert2**
- **RxJS / TypeScript**
- **HTML5 / CSS3**

## 📁 Estructura del Proyecto

```
src/
├── app/
│ ├── components/
│ │ ├── carga/                      # Componente para subir imágenes
│ │ └── fotos/                      # Componente para visualizar y eliminar imágenes
│ ├── directives/
│ │ └── ng-drop-files.directive.ts  # Directiva drag & drop
│ ├── models/
│ │ └── file-item.ts                # Clase para representar archivos
│ ├── services/
│ │ └── carga-imagenes.service.ts   # Servicio para subir y eliminar imágenes en Firebase
│ ├── app-routing.module.ts
│ └── app.module.ts
├── assets/
│ ├── drop-images.png               # Imagen para área drag & drop
├── environments/
│ ├── environment.ts
│ └── environment.development.ts
├── index.html
└── main.ts
```

## 🔑 Funcionalidades

✅ Subir imágenes a Firebase Storage con **drag & drop**  
✅ Validación de **tipo de archivo** (.png, .jpg, .jpeg)  
✅ Validación de **tamaño máximo** (5 MB)  
✅ Progreso de carga en tiempo real  
✅ Guardar información en **Firestore**  
✅ Visualizar imágenes subidas en una galería  
✅ Eliminar imágenes con confirmación  
✅ Notificaciones usando **SweetAlert2**

## 📦 Instalación

1. Clona este repositorio:

```bash
git clone https://github.com/david99cartagena/FotosFirebase.git
```

```bash
cd FotosFirebase
```

2. Instala las dependencias:

```bash
npm install
```

3. Ejecuta el servidor local:

```bash
npm start
```

```bash
ng serve
```

La aplicación estará disponible en: `http://localhost:4200/`

## ⚙️ Configuración para Firebase

1. Configura tu proyecto en Firebase y reemplaza las credenciales en `environment.ts`

```ts
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROJECT_ID.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT_ID.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID",
  },
};
```

Basado en el curso de **Fernando Herrera** – [Angular: De Cero a Experto (Edición 2018)](https://www.udemy.com/course/angular-2-fernando-herrera/)
