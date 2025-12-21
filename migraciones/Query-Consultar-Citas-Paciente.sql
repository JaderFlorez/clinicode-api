SELECT 
  c.id_cita,
  c.fecha_cita,
  c.estado,
  c.motivo,
  m.nombres AS nombre_medico,
  m.apellidos AS apellido_medico,
  e.nombre AS especialidad_medico,
  con.nombre AS nombre_consultorio,
  con.ubicacion AS ubicacion_consultorio
FROM citas_medicas c
JOIN medicos m ON c.id_medico = m.id_medico
JOIN especialidades e ON m.id_especialidad = e.id_especialidad
JOIN consultorios con ON c.id_consultorio = con.id_consultorio
WHERE c.id_paciente = '#####'::uuid
ORDER BY c.fecha_cita ASC;
