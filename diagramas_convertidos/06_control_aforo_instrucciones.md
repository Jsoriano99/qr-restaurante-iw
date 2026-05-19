# Control de Aforo en Tiempo Real

## Informacion del Diagrama

- **Actor**: Restaurante / Administrador
- **Descripcion**: Diagrama de actividad para el control de afición en tiempo real del restaurante

---

## Elementos a Crear

### Nodos (Activities)

#### N1: initial_node
- **Etiqueta**: Inicio
- **Posicion**: (300, 50)

#### N2: activity
- **Etiqueta**: Acceder al panel de control de ocupación
- **Posicion**: (300, 120)

#### N3: activity
- **Etiqueta**: Obtener datos de ocupación:
- Capacidad máxima
- Ocupación actual
- % ocupación
- Historial última hora
- **Posicion**: (300, 200)

#### N4: activity
- **Etiqueta**: Generar notificación de alerta
- **Posicion**: (550, 280)

#### N5: activity
- **Etiqueta**: Notificar al restaurante:
'Capacidad casi llena'
- **Posicion**: (550, 340)

#### N6: activity
- **Etiqueta**: Limitar nuevas entradas
- **Posicion**: (550, 420)

#### N7: activity
- **Etiqueta**: Continuar normalmente
- **Posicion**: (300, 280)

#### N8: activity
- **Etiqueta**: Mostrar gráfico de ocupación en tiempo real
- **Posicion**: (300, 350)

#### N9: activity
- **Etiqueta**: Mostrar gráfico histórico:
- Por día
- Por hora
- Tendencia
- **Posicion**: (300, 450)

#### N10: final_node
- **Etiqueta**: Fin
- **Posicion**: (300, 520)

### Decisiones

#### D1: Decision
- **Etiqueta**: ¿Ocupación > 80%?
- **Posicion**: (300, 240)
- **Salidas**:

  - Si **Sí** → ir a **N4**
  - Si **No** → ir a **N7**
#### D2: Decision
- **Etiqueta**: ¿Activar modo restrictivo?
- **Posicion**: (550, 380)
- **Salidas**:

  - Si **Sí** → ir a **N6**
  - Si **No** → ir a **N7**
#### D3: Decision
- **Etiqueta**: ¿Ver histórico de afluencia?
- **Posicion**: (300, 400)
- **Salidas**:

  - Si **Sí** → ir a **N9**
  - Si **No** → ir a **N10**
---

## Flujos de Ejecucion

- N1 → N2
- N2 → N3
- N3 → D1
- D1 → N4 (si "Sí")
- D1 → N7 (si "No")
- N4 → N5
- N5 → D2
- D2 → N6 (si "Sí")
- D2 → N7 (si "No")
- N6 → N8
- N7 → N8
- N8 → D3
- D3 → N9 (si "Sí")
- D3 → N10 (si "No")
- N9 → N10
---

## Notas

- El umbral de 80% es configurable
- El modo restrictivo limita nuevas entradas
- El histórico muestra datos de los últimos 30 días
