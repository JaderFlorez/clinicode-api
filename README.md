# Clinicode API

API REST backend para la gestión de un sistema clínico. Permite administrar pacientes, médicos, consultorios y citas médicas, con validación de traslapes de horarios y estados de cita.

Desarrollado como proyecto práctico aplicando **arquitectura hexagonal**, con énfasis en separación de responsabilidades, testabilidad y desacoplamiento del framework y la base de datos.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Lenguaje | TypeScript |
| Runtime | Node.js 18+ |
| Framework | Fastify 5 |
| Base de datos | PostgreSQL via Supabase |
| Validación | Zod |
| Pruebas | Jest + Supertest |
| Cliente API | Bruno |

## Arquitectura

El proyecto sigue el patrón **Ports and Adapters (Hexagonal Architecture)**:

```
src/
├── core/
│   ├── dominio/          # Entidades, interfaces de repositorios
│   ├── aplicacion/       # Casos de uso (lógica de negocio)
│   └── infraestructura/  # Repositorios Supabase, esquemas, cliente DB
├── presentacion/         # Controladores y rutas Fastify
└── common/               # Configuración, errores, códigos HTTP
```

La lógica de negocio no tiene dependencias de Fastify ni de Supabase. Cambiar el framework o la base de datos no afecta el núcleo del sistema.

## Entidades principales

- **Paciente** — identificación, datos de contacto
- **Médico** — especialidad, número de licencia
- **Consultorio** — ubicación, disponibilidad por día y hora
- **Asignación médico-consultorio** — con validación de traslapes
- **Cita médica** — estados: `Programada`, `Atendida`, `Cancelada`

## Instalación

```bash
git clone https://github.com/JaderFlorez/clinicode-api.git
cd clinicode-api
npm install
```

Crea un archivo `.env` en la raíz:

```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_anon
```

Ejecuta las migraciones en tu proyecto Supabase (SQL Editor):

```bash
# Pega el contenido de migraciones/migraciones.sql en el editor SQL de Supabase
```

## Scripts disponibles

```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Compilar TypeScript
npm start            # Producción
npm test             # Todas las pruebas
npm run unit-test    # Solo pruebas unitarias
npm run integration-test  # Solo pruebas de integración
```

## Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/pacientes` | Crear paciente |
| GET | `/pacientes` | Listar pacientes |
| GET | `/pacientes/:id` | Obtener por ID |
| PUT | `/pacientes/:id` | Actualizar |
| DELETE | `/pacientes/:id` | Eliminar |
| POST | `/medicos` | Crear médico |
| GET | `/medicos` | Listar médicos |
| POST | `/consultorios` | Crear consultorio |
| POST | `/asignacion-medico-consultorio` | Asignar médico con validación de traslape |
| POST | `/citas` | Crear cita médica |
| PUT | `/citas/:id/reprogramar` | Reprogramar cita |

Colección completa de pruebas disponible en `src/bruno/`.

## Documentación técnica

- [Visión general del sistema](docs/overview.md)
- [Arquitectura y decisiones técnicas](docs/arquitectura.md)
- [Modelo de base de datos](docs/base-de-datos.md)
- [Pruebas de endpoints](docs/pruebas.md)

## Autor

**Jader Andrés Flórez López**  
Backend Developer | Medellín, Colombia  
[LinkedIn](https://www.linkedin.com/in/jader-florez) · [GitHub](https://github.com/JaderFlorez)
