# Arquitectura y Decisiones Técnicas

## Arquitectura Hexagonal (Ports and Adapters)

El proyecto sigue la **Arquitectura Hexagonal**, también conocida como *Ports and Adapters*.  
Esta arquitectura permite desacoplar la lógica de negocio de las dependencias externas como frameworks web o bases de datos.

### Beneficios clave

- **Separación de responsabilidades**
- **Alta testabilidad**
- **Facilidad de mantenimiento**
- **Flexibilidad tecnológica**

La lógica de negocio no depende de Fastify ni de Supabase, lo que permite cambiar estas tecnologías sin afectar el núcleo del sistema.

## Stack Tecnológico

| Componente     | Tecnología |
|---------------|------------|
| Lenguaje      | TypeScript |
| Runtime       | Node.js |
| Framework Web | Fastify |
| Base de Datos | Supabase (PostgreSQL) |
| Validación    | DTOs |
| Pruebas API   | Bruno |

## Validaciones

Las validaciones se realizan mediante **DTOs (Data Transfer Objects)**, los cuales aseguran que los datos recibidos desde las capas externas cumplan con el formato y las reglas esperadas antes de ingresar a la lógica de negocio.
