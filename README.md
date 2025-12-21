# Clinicode-api


Este proyecto es la API backend para el **Sistema Clínico**, desarrollado con **Node.js**, **TypeScript** y el framework **Fastify**. Utiliza **Supabase** como servicio de base de datos y autenticación.

## Configuración del Proyecto

Sigue estos pasos para clonar el repositorio y configurar el proyecto en tu entorno local.

### 1. Requisitos Previos

Asegúrate de tener instalado lo siguiente:

*   **Node.js** (versión recomendada: 18 o superior)
*   **npm** (se instala con Node.js)
*   **Git**

### 2. Clonación del Repositorio

Clona el repositorio a tu máquina local usando Git:

```bash
git clone https://github.com/Inexsu-Coordinadora/Clinicode.git
```

### 3. Instalación de Dependencias

Una vez dentro del directorio del proyecto, instala todas las dependencias necesarias:

```bash
npm install
```

### 4. Configuración de Variables de Entorno

El proyecto utiliza el paquete `dotenv` para gestionar las variables de entorno. Necesitas crear un archivo llamado `.env` en la raíz del proyecto.

**`.env`**

```
# Configuración de Supabase
# Debes obtener estos valores desde el panel de control de tu proyecto Supabase
SUPABASE_URL="[TU_URL_DE_PROYECTO_SUPABASE]"
SUPABASE_ANON_KEY="[TU_CLAVE_ANON_SUPABASE]"

# Otras variables de entorno necesarias para el proyecto (si las hay)
# ...
```

> **Importante:** El proyecto utiliza `supabase-js` para interactuar con la base de datos. Asegúrate de que tu proyecto Supabase esté configurado y que las credenciales sean correctas.

### 5. Configuración de la Base de Datos (Migraciones)

El proyecto requiere una estructura de base de datos específica. Las migraciones SQL definen las tablas y relaciones necesarias.

**Tecnología de Base de Datos:** La estructura SQL proporcionada (`migraciones.sql`) es compatible con **PostgreSQL** (el motor de base de datos de Supabase), incluyendo el uso del tipo `uuid` y `ENUM`.

#### 5.1. Aplicar Migraciones

Debes ejecutar el contenido del archivo `migraciones.sql` en tu base de datos de Supabase.

1.  Accede al panel de control de tu proyecto Supabase.
2.  Navega a la sección **SQL Editor** (o similar).
3.  Copia y pega todo el contenido del archivo `migraciones.sql` en el editor.
4.  Ejecuta el script para crear las tablas: `pacientes`, `especialidades`, `medicos`, `consultorios`, `disponibilidad_consultorio` y `citas_medicas`, junto con sus respectivas claves foráneas.

### 6. Ejecución del Proyecto

El proyecto ofrece dos modos de ejecución: desarrollo y producción.

#### Modo Desarrollo

Para ejecutar el proyecto en modo desarrollo con recarga automática (hot-reload) usando `ts-node`:

```bash
npm run dev
```

El servidor se iniciará y estará escuchando en el puerto configurado (por defecto, Fastify usa el puerto `3000` a menos que se configure lo contrario).

#### Modo Producción

Para compilar y ejecutar el proyecto para producción:

1.  **Compilar el código TypeScript a JavaScript:**
    ```bash
    npm run build
    ```
    Esto generará los archivos JavaScript en el directorio `dist/`.

2.  **Iniciar el servidor de producción:**
    ```bash
    npm start
    ```

## Documentación

La documentación técnica se encuentra en la carpeta `docs/`:

- [Visión general](docs/overview.md)
- [Arquitectura](docs/arquitectura.md)
- [Base de datos](docs/base-de-datos.md)
- [Pruebas](docs/pruebas.md)

