# Registro de Salida

## Informacion del Diagrama

- **Actor**: Cliente
- **Descripcion**: Diagrama de actividad para el registro de salida del restaurante

---

## Elementos a Crear

### Nodos (Activities)

#### N1: initial_node
- **Etiqueta**: Inicio
- **Posicion**: (300, 50)

#### N2: activity
- **Etiqueta**: Acceder a Mis Visitas en la aplicación
- **Posicion**: (300, 120)

#### N3: activity
- **Etiqueta**: Seleccionar visita activa (restaurante con entrada sin salida)
- **Posicion**: (300, 190)

#### N4: activity
- **Etiqueta**: Confirmar selección de restaurante
- **Posicion**: (300, 260)

#### N5: activity
- **Etiqueta**: Confirmar número de acompañantes originales
- **Posicion**: (300, 330)

#### N6: activity
- **Etiqueta**: Registrar timestamp de salida
- **Posicion**: (300, 400)

#### N7: activity
- **Etiqueta**: Calcular duración de la visita (salida - entrada)
- **Posicion**: (300, 470)

#### N8: activity
- **Etiqueta**: Actualizar registro:
- Timestamp salida
- Duración calculada
- Estado: completado
- **Posicion**: (300, 540)

#### N9: activity
- **Etiqueta**: Decrementar contador de ocupación actual
- **Posicion**: (300, 610)

#### N10: activity
- **Etiqueta**: Ir a valoración
- **Posicion**: (300, 750)

#### N11: final_node
- **Etiqueta**: Fin - Salida registrada
- **Posicion**: (300, 820)

#### E1: final_node
- **Etiqueta**: Fin - Valoración
- **Posicion**: (300, 820)

### Decisiones

#### D1: Decision
- **Etiqueta**: ¿El cliente tuvo acompañantes?
- **Posicion**: (300, 295)
- **Salidas**:

  - Si **No** → ir a **N6**
  - Si **Sí** → ir a **N5**
#### D2: Decision
- **Etiqueta**: ¿Desea valorar el restaurante?
- **Posicion**: (300, 680)
- **Salidas**:

  - Si **No** → ir a **N11**
  - Si **Sí** → ir a **N10**
---

## Flujos de Ejecucion

- N1 → N2
- N2 → N3
- N3 → N4
- N4 → D1
- D1 → N6 (si "No")
- D1 → N5 (si "Sí")
- N5 → N6
- N6 → N7
- N7 → N8
- N8 → N9
- N9 → D2
- D2 → N11 (si "No")
- D2 → N10 (si "Sí")
---

## Notas

- Solo se muestran visitas sin salida registrada
- La duración se calcula en minutos
- Al decrementar, también se descuenta el número de acompañantes
