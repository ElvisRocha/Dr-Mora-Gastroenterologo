import { z } from "zod";

export const bookingSchema = z.object({
  servicioSlug: z.string().min(1, "Selecciona un servicio"),
  fecha: z.string().min(1, "Selecciona una fecha"),
  hora: z.string().min(1, "Selecciona un horario"),
  esMayorDeEdad: z.boolean(),
  tutor: z.object({
    relacion: z.enum([
      "paciente",
      "madre",
      "padre",
      "abuelo",
      "tio",
      "tutor_legal",
      "otro",
    ]),
    nombre: z.string().min(2, "Mínimo 2 caracteres"),
    apellidos: z.string().min(2, "Mínimo 2 caracteres"),
    telefono: z.string().min(8, "Teléfono inválido"),
    email: z.string().email("Email inválido"),
  }),
  paciente: z.object({
    nombre: z.string().min(2, "Mínimo 2 caracteres"),
    apellidoPaterno: z.string().min(2, "Mínimo 2 caracteres"),
    apellidoMaterno: z.string().optional(),
    fechaNacimiento: z
      .string()
      .min(1, "Selecciona una fecha")
      .refine((d) => !Number.isNaN(Date.parse(d)), "Fecha inválida"),
    sexo: z.enum(["masculino", "femenino", "intersexual", "no_especificado"]),
  }),
  motivo: z.string().max(600).optional(),
});

export type BookingPayload = z.infer<typeof bookingSchema>;
