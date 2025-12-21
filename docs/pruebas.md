# Pruebas de Endpoints

## Herramienta Utilizada

Para probar los endpoints de la API se utiliza **Bruno**, un cliente de API de código abierto.

## Requisitos

- Servidor en ejecución
- Variables de entorno configuradas

## Ejecución del Servidor

```bash
npm run dev
```
## Pruebas Manuales

Puedes crear o importar una colección en **Bruno** y probar los siguientes endpoints base:

- `POST /pacientes`
- `GET /pacientes/:id`
- `POST /medicos`
- `GET /medicos`
- `POST /citas`

### Aspectos Validados

Las pruebas permiten verificar:

- Respuestas correctas del servidor
- Validaciones de datos
- Integridad de las relaciones entre entidades
