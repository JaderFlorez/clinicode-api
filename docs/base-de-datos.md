# Modelo de Base de Datos

## Descripción General

La base de datos está construida sobre **PostgreSQL**, utilizando **Supabase** como plataforma de backend.

Se utilizan **UUIDs** como claves primarias en todas las entidades para facilitar la escalabilidad y evitar colisiones en entornos distribuidos.

## Definición del Esquema

El esquema de la base de datos se encuentra definido en el archivo `migraciones.sql` e incluye las siguientes tablas:

- `pacientes`
- `especialidades`
- `medicos`
- `consultorios`
- `disponibilidad_consultorio`
- `asignacion_medico_consultorio`
- `citas_medicas`

## Tipos Especiales

Se define un tipo `ENUM`:

- `estado_cita`
  - `Programada`
  - `Atendida`
  - `Cancelada`

## Relaciones

El modelo utiliza claves foráneas para mantener la integridad referencial entre las entidades, garantizando consistencia entre pacientes, médicos, consultorios y citas médicas.
