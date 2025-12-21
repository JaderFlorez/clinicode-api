CREATE TYPE "estado_cita" AS ENUM (
  'Programada',
  'Atendida',
  'Cancelada'
);

CREATE TABLE "pacientes" (
  "id_paciente" uuid PRIMARY KEY,
  "tipo_documento" varchar(10),
  "numero_documento" varchar(20) UNIQUE NOT NULL,
  "nombres" varchar(100),
  "apellidos" varchar(100),
  "fecha_nacimiento" date,
  "telefono" varchar(20),
  "correo" varchar(100),
  "direccion" varchar(150)
);

CREATE TABLE "especialidades" (
  "id_especialidad" uuid PRIMARY KEY,
  "nombre" varchar(100) UNIQUE NOT NULL,
  "descripcion" text
);

CREATE TABLE "medicos" (
  "id_medico" uuid PRIMARY KEY,
  "nombres" varchar(100),
  "apellidos" varchar(100),
  "numero_licencia" varchar(50) UNIQUE NOT NULL,
  "id_especialidad" uuid NOT NULL,
  "telefono" varchar(20),
  "correo" varchar(100)
);

CREATE TABLE "consultorios" (
  "id_consultorio" uuid PRIMARY KEY,
  "nombre" varchar(50),
  "ubicacion" varchar(100),
  "disponible" boolean DEFAULT true
);

CREATE TABLE "disponibilidad_consultorio" (
  "id_disponibilidad" uuid PRIMARY KEY,
  "id_consultorio" uuid NOT NULL,
  "dia_semana" varchar(15),
  "hora_inicio" time,
  "hora_fin" time,
  "disponible" boolean DEFAULT true
);

CREATE TABLE "citas_medicas" (
  "id_cita" uuid PRIMARY KEY,
  "id_paciente" uuid NOT NULL,
  "id_medico" uuid NOT NULL,
  "id_consultorio" uuid NOT NULL,
  "fecha_cita" timestamp,
  "motivo" varchar(200),
  "estado" estado_cita DEFAULT 'Programada'
);

CREATE TABLE asignacion_medico_consultorio (
  id_asignacion UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_medico UUID REFERENCES medicos(id_medico),
  id_consultorio UUID REFERENCES consultorios(id_consultorio),
  dias_disponibles TEXT[],
  hora_inicio TIME,
  hora_fin TIME,
  creada_en TIMESTAMP DEFAULT NOW()
);


ALTER TABLE "medicos" ADD FOREIGN KEY ("id_especialidad") REFERENCES "especialidades" ("id_especialidad");

ALTER TABLE "disponibilidad_consultorio" ADD FOREIGN KEY ("id_consultorio") REFERENCES "consultorios" ("id_consultorio");

ALTER TABLE "citas_medicas" ADD FOREIGN KEY ("id_paciente") REFERENCES "pacientes" ("id_paciente");

ALTER TABLE "citas_medicas" ADD FOREIGN KEY ("id_medico") REFERENCES "medicos" ("id_medico");

ALTER TABLE "citas_medicas" ADD FOREIGN KEY ("id_consultorio") REFERENCES "consultorios" ("id_consultorio");
