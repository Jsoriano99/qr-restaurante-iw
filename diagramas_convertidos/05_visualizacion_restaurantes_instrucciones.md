# Visualización de Restaurantes Disponibles

## Informacion del Diagrama

- **Actor**: Cliente
- **Descripcion**: Diagrama de actividad para visualizar y filtrar restaurantes disponibles

---

## Elementos a Crear

### Nodos (Activities)

#### N1: initial_node
- **Etiqueta**: Inicio
- **Posicion**: (300, 50)

#### N2: activity
- **Etiqueta**: Abrir lista de restaurantes
- **Posicion**: (300, 120)

#### N3: activity
- **Etiqueta**: Seleccionar tipo de comida (opcional)
- **Posicion**: (300, 200)

#### N4: activity
- **Etiqueta**: Seleccionar zona/barrio (opcional)
- **Posicion**: (300, 270)

#### N5: activity
- **Etiqueta**: Establecer radio de búsqueda (opcional)
- **Posicion**: (300, 340)

#### N6: activity
- **Etiqueta**: Filtrar por disponibilidad:
- Con puestos disponibles
- Con espacio suficiente
- **Posicion**: (300, 410)

#### N7: activity
- **Etiqueta**: Consultar base de datos de restaurantes
- **Posicion**: (300, 480)

#### N8: activity
- **Etiqueta**: Calcular distancia desde ubicación actual
- **Posicion**: (300, 550)

#### N9: activity
- **Etiqueta**: Ordenar por:
- Distancia
- Valoración
- Disponibilidad
- **Posicion**: (300, 620)

#### N10: activity
- **Etiqueta**: Mostrar lista de restaurantes con información:
- Nombre
- Tipo de comida
- Distancia
- Capacidad/ocupación
- Valoración media
- Disponibilidad
- **Posicion**: (300, 690)

#### N11: activity
- **Etiqueta**: Seleccionar restaurante para ver detalles
- **Posicion**: (300, 760)

#### N12: final_node
- **Etiqueta**: Fin
- **Posicion**: (300, 830)

### Decisiones

#### D1: Decision
- **Etiqueta**: ¿Aplicar filtros?
- **Posicion**: (300, 165)
- **Salidas**:

  - Si **No** → ir a **N7**
  - Si **Sí** → ir a **N3**
#### D2: Decision
- **Etiqueta**: ¿Ver más detalles o volver?
- **Posicion**: (300, 800)
- **Salidas**:

  - Si **Volver** → ir a **N10**
  - Si **Fin** → ir a **N12**
---

## Flujos de Ejecucion

- N1 → N2
- N2 → D1
- D1 → N3 (si "Sí")
- D1 → N7 (si "No")
- N3 → N4
- N4 → N5
- N5 → N6
- N6 → N7
- N7 → N8
- N8 → N9
- N9 → N10
- N10 → N11
- N11 → D2
- D2 → N10 (si "Volver")
- D2 → N12 (si "Fin")
---

## Notas

- Los filtros son opcionales
- La distancia se calcula usando GPS del dispositivo
- Se ordenan por defecto por distancia
