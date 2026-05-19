# Registro de Restaurante

## Informacion del Diagrama

- **Actor**: Administrador / Restaurante
- **Descripcion**: Diagrama de actividad para el registro de un nuevo restaurante en el sistema

---

## Elementos a Crear

### Nodos (Activities)

#### N1: initial_node
- **Etiqueta**: Inicio
- **Posicion**: (250, 50)

#### N2: activity
- **Etiqueta**: Acceder al formulario de registro de restaurante
- **Posicion**: (250, 120)

#### N3: activity
- **Etiqueta**: Introducir datos del restaurante:
- Nombre
- Dirección
- Tipo de cocina
- Capacidad máxima
- Horario
- **Posicion**: (250, 200)

#### N4: activity
- **Etiqueta**: Validar datos completados
- **Posicion**: (250, 280)

#### N5: activity
- **Etiqueta**: Guardar restaurante en la base de datos
- **Posicion**: (250, 360)

#### N6: activity
- **Etiqueta**: Generar código QR único
- **Posicion**: (250, 430)

#### N7: activity
- **Etiqueta**: Asignar identificador único al restaurante
- **Posicion**: (250, 500)

#### N8: activity
- **Etiqueta**: Confirmar registro exitoso al restaurante
- **Posicion**: (250, 570)

#### N9: final_node
- **Etiqueta**: Fin
- **Posicion**: (250, 640)

#### E1: error
- **Etiqueta**: Mostrar error
- **Posicion**: (450, 280)

### Decisiones

#### D1: Decision
- **Etiqueta**: ¿Datos válidos?
- **Posicion**: (250, 320)
- **Salidas**:

  - Si **Datos incompletos o inválidos** → ir a **E1**
  - Si **Datos válidos** → ir a **N5**
---

## Flujos de Ejecucion

- N1 → N2
- N2 → N3
- N3 → N4
- D1 → N5 (si "Datos válidos")
- E1 → N3 (si "Repetir desde entrada")
- N5 → N6
- N6 → N7
- N7 → N8
- N8 → N9
---

## Notas

- Los datos incluyen: nombre, dirección, tipo de cocina, capacidad máxima y horario
- Se genera UUID único para el código QR
- El restaurante recibe confirmación por email
