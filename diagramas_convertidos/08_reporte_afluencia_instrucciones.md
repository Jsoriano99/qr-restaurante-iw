# Reporte de Afluencia

## Informacion del Diagrama

- **Actor**: Administrador
- **Descripcion**: Diagrama de actividad para generar reportes de afluencia del restaurante

---

## Elementos a Crear

### Nodos (Activities)

#### N1: initial_node
- **Etiqueta**: Inicio
- **Posicion**: (300, 50)

#### N2: activity
- **Etiqueta**: Acceder a sección de reportes
- **Posicion**: (300, 120)

#### N3: activity
- **Etiqueta**: Seleccionar tipo de reporte:
- Por restaurante
- Por fecha/rango
- Por horario
- Comparativo
- **Posicion**: (300, 190)

#### N4: activity
- **Etiqueta**: Seleccionar período:
- Hoy
- Última semana
- Último mes
- Rango personalizado
- **Posicion**: (300, 260)

#### N5: activity
- **Etiqueta**: Generar consulta de datos en base de datos
- **Posicion**: (300, 330)

#### N6: activity
- **Etiqueta**: Procesar y calcular métricas:
- Total entradas
- Total salidas
- Duración media
- Peak hours
- Acompañantes media
- **Posicion**: (300, 400)

#### N7: activity
- **Etiqueta**: Generar PDF
- **Posicion**: (550, 480)

#### N8: activity
- **Etiqueta**: Generar Excel
- **Posicion**: (550, 540)

#### N9: activity
- **Etiqueta**: Generar CSV
- **Posicion**: (550, 600)

#### N10: activity
- **Etiqueta**: Mostrar reporte con gráficos y estadísticas
- **Posicion**: (300, 480)

#### N11: final_node
- **Etiqueta**: Fin
- **Posicion**: (300, 550)

### Decisiones

#### D1: Decision
- **Etiqueta**: ¿Exportar reporte?
- **Posicion**: (300, 440)
- **Salidas**:

  - Si **No** → ir a **N10**
  - Si **Sí - PDF** → ir a **N7**
  - Si **Sí - Excel** → ir a **N8**
  - Si **Sí - CSV** → ir a **N9**
---

## Flujos de Ejecucion

- N1 → N2
- N2 → N3
- N3 → N4
- N4 → N5
- N5 → N6
- N6 → D1
- D1 → N10 (si "No")
- D1 → N7 (si "Sí - PDF")
- D1 → N8 (si "Sí - Excel")
- D1 → N9 (si "Sí - CSV")
- N7 → N10
- N8 → N10
- N9 → N10
- N10 → N11
---

## Notas

- Los reportes incluyen gráficos visuals
- Está disponible exportación en PDF, Excel y CSV
- El rango personalizado permite select fechas específicas
