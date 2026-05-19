# Generación de Código QR

## Informacion del Diagrama

- **Actor**: Sistema / Restaurante
- **Descripcion**: Diagrama de actividad para generar códigos QR únicos por restaurante

---

## Elementos a Crear

### Nodos (Activities)

#### N1: initial_node
- **Etiqueta**: Inicio
- **Posicion**: (250, 50)

#### N2: activity
- **Etiqueta**: Solicitar generación de código QR
- **Posicion**: (250, 120)

#### N3: activity
- **Etiqueta**: Verificar que el restaurante está registrado y activo
- **Posicion**: (250, 200)

#### N4: activity
- **Etiqueta**: Generar identificador único (UUID) para el código QR
- **Posicion**: (250, 280)

#### N5: activity
- **Etiqueta**: Codificar información en formato QR:
- ID restaurante
- ID mesa/acceso
- Timestamp
- Hash de validación
- **Posicion**: (250, 350)

#### N6: activity
- **Etiqueta**: Generar imagen del código QR
- **Posicion**: (250, 420)

#### N7: activity
- **Etiqueta**: Almacenar código QR generado en la base de datos
- **Posicion**: (250, 490)

#### N8: activity
- **Etiqueta**: Entregar código QR al restaurante para impresión
- **Posicion**: (250, 560)

#### N9: final_node
- **Etiqueta**: Fin - Éxito
- **Posicion**: (250, 630)

#### E1: error
- **Etiqueta**: Fin - Error
- **Posicion**: (450, 200)

### Decisiones

#### D1: Decision
- **Etiqueta**: ¿Restaurante válido?
- **Posicion**: (250, 240)
- **Salidas**:

  - Si **Restaurante no válido** → ir a **E1**
  - Si **Restaurante válido** → ir a **N4**
---

## Flujos de Ejecucion

- N1 → N2
- N2 → N3
- N3 → D1
- D1 → N4 (si "Restaurante válido")
- D1 → E1 (si "Restaurante no válido")
- N4 → N5
- N5 → N6
- N6 → N7
- N7 → N8
- N8 → N9
---

## Notas

- El UUID se genera cryptográficamente seguro
- El hash de validación permite verificar autenticidad del QR
- El código QR incluye timestamp para controlar expiración
