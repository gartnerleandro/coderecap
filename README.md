# Code Recap - DevCard Generator

Genera y comparte tu tarjeta de desarrollador basadas en tus estadísticas de GitHub.

## 🚀 Demo en vivo

Visita la aplicación en: [https://coderecap.vercel.app/](https://coderecap.vercel.app/)

## 📸 Vista previa

<div align="center">
  <img src="./public/preview-dark.png" alt="DevCard Vista Modo Oscuro" width="400"/>
  <img src="./public/preview-light.png" alt="DevCard Vista Modo Claro" width="400"/>
</div>

## 📖 Sobre el Proyecto

Code Recap es una herramienta que permite a los desarrolladores crear tarjetas personalizadas mostrando sus estadísticas de GitHub. Características principales:

- 🎨 Modos claro y oscuro
- 📊 Visualización de estadísticas de GitHub
- 📱 Diseño responsivo
- 📤 Opciones para compartir en redes sociales
- 💾 Descarga de tarjetas en formato PNG

## ⚙️ Construido con

- [Next.js 14](https://nextjs.org/) - Framework de React
- [TypeScript](https://www.typescriptlang.org/) - Superset de JavaScript
- [Framer Motion](https://www.framer.com/motion/) - Biblioteca de animaciones
- [Recharts](https://recharts.org/) - Biblioteca de gráficos
- [GitHub API](https://docs.github.com/en/rest) - API para datos de GitHub
- [CSS Modules](https://github.com/css-modules/css-modules) - Estilos modulares
- [Firebase](https://firebase.google.com/docs/firestore?hl=es-419) - Base de Datos

## 🚀 Comenzando

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Instalación

1. Clona el repositorio

   ```bash
   git clone https://github.com/usuario/devcard-generator.git
   ```

2. Instala las dependencias

   ```bash
   npm install
   # o
   yarn install
   ```

3. Crea un archivo `.env.local` y añade tus variables de entorno, puedes clonar el archivo `.env.example`

   ```bash
    AUTH_SECRET=

    AUTH_GITHUB_ID=
    AUTH_GITHUB_SECRET=

    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=
   ```

4. Inicia el servidor de desarrollo

   ```bash
   npm run dev
   # o
   yarn dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## 🤝 Contribuir

Las contribuciones son lo que hacen a la comunidad open source un lugar increíble para aprender, inspirar y crear. Cualquier contribución que hagas será **muy apreciada**.

1. Haz un Fork del proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios utilizando [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) (`git commit -m 'feat: Add some AmazingFeature'`)
4. Haz Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request a la rama `develop`

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE.md](LICENSE.md) para más detalles.

---

<div align="center">
  Hecho con ❤️ por <a href="https://github.com/gartnerleandro">gartnerleandro</a>
</div>
