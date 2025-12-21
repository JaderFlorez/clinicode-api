import { z } from "zod";

export const ServicioConsultarCitasPacienteEsquema = z.object({
  numero_documento: z
    .string()
    .nonempty("El número de documento del paciente es obligatorio")
    .regex(/^[0-9]+$/, "El número de documento debe contener solo números")
    .length(10, "El número de documento debe tener exactamente 10 dígitos"),
});

export type ConsultarCitasPacienteDTO = z.infer<typeof ServicioConsultarCitasPacienteEsquema>;
