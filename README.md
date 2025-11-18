# Norma Insights: Inteligencia Regulatoria con IA

## Descripción General

Norma Insights es una aplicación web que utiliza inteligencia artificial generativa para proporcionar análisis profundos sobre el panorama regulatorio del sector salud en Colombia y México. Los usuarios pueden realizar consultas complejas en lenguaje natural y recibir a cambio un informe de estilo consultoría, profesional y bien estructurado, en formato PDF.

Esta aplicación fue creada en Firebase Studio.

## Características Principales

-   **Análisis por IA**: Interpreta consultas complejas y genera informes detallados utilizando el modelo Gemini de Google a través de Genkit.
-   **Generación de PDF**: El informe generado por la IA se convierte en un archivo PDF directamente en el navegador (`jspdf`) para facilitar su descarga y uso.
-   **Interfaz Moderna**: Desarrollada con Next.js y ShadCN para una experiencia de usuario limpia, responsiva y agradable.
-   **Limitación de Uso**: Incluye un sistema de control del lado del cliente (`localStorage`) que limita a los usuarios a dos consultas por día para gestionar los recursos.
-   **Despliegue Sencillo**: Configurada para un despliegue rápido en Firebase App Hosting.

## Pila Tecnológica

-   **Framework**: Next.js (con App Router)
-   **Lenguaje**: TypeScript
-   **Estilos**: Tailwind CSS
-   **Componentes UI**: ShadCN/UI
-   **Inteligencia Artificial**: Genkit & Google Gemini
-   **Despliegue**: Firebase App Hosting

## Estructura del Proyecto

A continuación, se describen los archivos y directorios más importantes:

-   `src/app/`: Contiene las páginas y la lógica principal de la aplicación Next.js.
    -   `page.tsx`: La página de inicio de la aplicación.
    -   `layout.tsx`: El layout principal que envuelve toda la aplicación.
    -   `actions.ts`: Server Actions de Next.js que se comunican con los flujos de IA.
-   `src/components/`: Contiene los componentes de React reutilizables.
    -   `query-client.tsx`: El componente principal que gestiona el formulario de consulta, el estado de la aplicación y la interacción con la IA.
    -   `ui/`: Componentes de UI de ShadCN.
-   `src/ai/`: Lógica relacionada con la inteligencia artificial.
    -   `genkit.ts`: Configuración e inicialización de Genkit.
    -   `flows/`: Contiene los flujos de Genkit que definen las interacciones con el modelo de IA.
        -   `generate-consulting-report.ts`: El flujo que recibe la consulta y genera el informe.
-   `public/`: Archivos estáticos.
-   `apphosting.yaml`: Archivo de configuración para el despliegue en Firebase App Hosting.
-   `package.json`: Dependencias y scripts del proyecto.

## Puesta en Marcha Local

Para ejecutar el proyecto en una máquina local, sigue estos pasos:

1.  **Descarga el código del proyecto.**

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade tu clave de API de Gemini:
    ```
    GEMINI_API_KEY=tu_api_key_aqui
    ```

4.  **Ejecuta el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

La aplicación estará disponible en `http://localhost:9002`.

## Despliegue

Este proyecto está configurado para desplegarse fácilmente en **Firebase App Hosting**.

1.  **Instala Firebase CLI:**
    ```bash
    npm install -g firebase-tools
    ```

2.  **Inicia sesión y selecciona tu proyecto:**
    ```bash
    firebase login
    firebase use <TU_ID_DE_PROYECTO_FIREBASE>
    ```

3.  **Despliega la aplicación:**
    ```bash
    firebase apphosting:backends:deploy
    ```

La Firebase CLI se encargará de construir y desplegar la aplicación. Al finalizar, te proporcionará la URL pública de tu proyecto.
