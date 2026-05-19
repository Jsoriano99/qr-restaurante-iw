# Valoración de Restaurante

## Informacion del Diagrama

- **Actor**: Cliente
- **Descripcion**: Diagrama de actividad para valorar un restaurante después de una visita

---

## Elementos a Crear

### Nodos (Activities)

#### N1: initial_node
- **Etiqueta**: Inicio
- **Posicion**: (300, 50)

#### N2: activity
- **Etiqueta**: Acceder a registro de valoración tras visita
- **Posicion**: (300, 120)

#### N3: activity
- **Etiqueta**: Seleccionar puntuación (1-5 estrellas)
- **Posicion**: (300, 190)

#### N4: activity
- **Etiqueta**: Escribir comentario (máx. 500 caracteres)
- **Posicion**: (300, 260)

#### N5: activity
- **Etiqueta**: Validar contenido:
- Longitud correcta
- Sin contenido ofensivo
- **Posicion**: (300, 330)

#### N6: activity
- **Etiqueta**: Guardar valoración en base de datos:
- ID restaurante
- ID cliente
- Puntuación
- Comentario (opt)
- Timestamp
- **Posicion**: (300, 400)

#### N7: activity
- **Etiqueta**: Recalcular valoración media del restaurante
- **Posicion**: (300, 470)

#### N8: activity
- **Etiqueta**: Confirmar valoración enviada
- **Posicion**: (300, 540)

#### N9: final_node
- **Etiqueta**: Fin - Valoración registrada
- **Posicion**: (300, 610)

#### E1: error
- **Etiqueta**: Mostrar error
- **Posicion**: (550, 330)

### Decisiones

#### D1: Decision
- **Etiqueta**: ¿Añadir comentario?
- **Posicion**: (300, 225)
- **Salidas**:

  - Si **No** → ir a **N6**
  - Si **Sí** → ir a **N4**
#### D2: Decision
- **Etiqueta**: ¿Contenido válido?
- **Posicion**: (300, 365)
- **Salidas**:

  - Si **Contenido inválido** → ir a **E1**
  - Si **Contenido válido** → ir a **N6**
---

## Flujos de Ejecucion

- N1 → N2
- N2 → N3
- N3 → D1
- D1 → N6 (si "No")
- D1 → N4 (si "Sí")
- N4 → N5
- N5 → D2
- D2 → N6 (si "Contenido válido")
- D2 → E1 (si "Contenido inválido")
- E1 → N4 (si "Repetir comentario")
- N6 → N7
- N7 → N8
- N8 → N9
---

## Notas

- La puntuación es de 1 a 5 estrellas
- El comentario es opcional, máximo 500 caracteres
- Se filtra contenido ofensivo automáticamente
- La valoración media se recalcula en tiempo real
