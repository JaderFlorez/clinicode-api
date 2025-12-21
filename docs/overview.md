# Sistema Clínico API – Visión General

## Propósito y Alcance

El **Sistema Clínico API** es una aplicación backend diseñada para gestionar las operaciones fundamentales de una clínica, enfocándose en la administración de pacientes, médicos, consultorios y la programación de citas médicas.

El alcance del proyecto se centra en establecer una base sólida y funcional, implementando el **CRUD (Crear, Leer, Actualizar, Eliminar)** completo para las siguientes entidades:

| Entidad                         | Descripción |
|--------------------------------|-------------|
| Paciente                       | Gestión de identificación y datos de contacto. |
| Médico                         | Información profesional, especialidad y número de licencia. |
| Consultorio                   | Identificación, ubicación interna y disponibilidad básica. |
| Cita Médica                   | Programación de citas vinculando paciente, médico y consultorio. |
| Asignación médico-consultorio | Asignación de consultorios evitando traslapes de horarios. |

## Estado del Proyecto

| Característica     | Estado   | Notas |
|--------------------|----------|-------|
| CRUD de entidades  | COMPLETO | Implementado para todas las entidades principales. |
| Conexión a DB      | ESTABLE  | Integración funcional con Supabase. |
| Validaciones       | BÁSICAS  | Implementadas mediante DTOs. |
