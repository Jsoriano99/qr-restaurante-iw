# Escaneo y Registro de Entrada

## Informacion del Diagrama

- **Actor**: Cliente
- **Descripcion**: Diagrama de actividad para el escaneo de código QR y registro de entrada al restaurante

---

## Elementos a Crear

### Nodos (Activities)

#### N1: initial_node
- **Etiqueta**: Inicio
- **Posicion**: (300, 50)

#### N2: activity
- **Etiqueta**: Abrir aplicación de escaneo en el dispositivo móvil
- **Posicion**: (300, 120)

#### N3: activity
- **Etiqueta**: Permitir cámara para escanear código QR
- **Posicion**: (300, 200)

#### N4: activity
- **Etiqueta**: Escanear código QR del restaurante/mesa
- **Posicion**: (300, 270)

#### N5: activity
- **Etiqueta**: Decodificar datos del QR
- **Posicion**: (300, 340)

#### N6: activity
- **Etiqueta**: Validar código QR:
- Verificar formato
- Verificar hash
- Verificar expiración
- **Posicion**: (300, 410)

#### N7: activity
- **Etiqueta**: Obtener información del restaurante
- **Posicion**: (300, 480)

#### N8: activity
- **Etiqueta**: Verificar capacidad actual vs. máxima
- **Posicion**: (300, 550)

#### N9: activity
- **Etiqueta**: Registrar entrada con:
- Timestamp actual
- ID restaurante
- ID código QR
- ID cliente (opcional)
- **Posicion**: (300, 620)

#### N10: activity
- **Etiqueta**: Incrementar contador de ocupación actual
- **Posicion**: (300, 690)

#### N11: activity
- **Etiqueta**: Solicitar número de acompañantes
- **Posicion**: (300, 760)

#### N12: activity
- **Etiqueta**: Validar número (1-10)
- **Posicion**: (300, 820)

#### N13: activity
- **Etiqueta**: Registrar acompañantes en la entrada
- **Posicion**: (300, 890)

#### N14: activity
- **Etiqueta**: Actualizar contador de ocupación (+ acompañantes)
- **Posicion**: (300, 950)

#### N15: final_node
- **Etiqueta**: Fin - Entrada con acompañantes
- **Posicion**: (300, 1020)

#### E1: error
- **Etiqueta**: Fin - Error
- **Posicion**: (550, 200)

#### E2: error
- **Etiqueta**: Fin - Error
- **Posicion**: (550, 410)

#### E3: error
- **Etiqueta**: Fin - Error
- **Posicion**: (550, 550)

#### E4: final_node
- **Etiqueta**: Fin - Entrada registrada
- **Posicion**: (80, 760)

#### E5: error
- **Etiqueta**: Mostrar error
- **Posicion**: (550, 820)

### Decisiones

#### D1: Decision
- **Etiqueta**: ¿Permiso concedido?
- **Posicion**: (300, 235)
- **Salidas**:

  - Si **Permiso denegado** → ir a **E1**
  - Si **Permiso concedido** → ir a **N4**
#### D2: Decision
- **Etiqueta**: ¿Código QR válido?
- **Posicion**: (300, 470)
- **Salidas**:

  - Si **Código inválido** → ir a **E2**
  - Si **Código válido** → ir a **N7**
#### D3: Decision
- **Etiqueta**: ¿Hay capacidad?
- **Posicion**: (300, 610)
- **Salidas**:

  - Si **Restaurante completo** → ir a **E3**
  - Si **Hay capacidad disponible** → ir a **N9**
#### D4: Decision
- **Etiqueta**: ¿Registrar acompañantes?
- **Posicion**: (300, 730)
- **Salidas**:

  - Si **No** → ir a **E4**
  - Si **Sí** → ir a **N11**
#### D5: Decision
- **Etiqueta**: ¿Número válido?
- **Posicion**: (300, 865)
- **Salidas**:

  - Si **Número inválido** → ir a **E5**
  - Si **Número válido** → ir a **N13**
---

## Flujos de Ejecucion

- N1 → N2
- N2 → N3
- N3 → D1
- D1 → N4 (si "Permiso concedido")
- D1 → E1 (si "Permiso denegado")
- N4 → N5
- N5 → N6
- N6 → D2
- D2 → N7 (si "Código válido")
- D2 → E2 (si "Código inválido")
- N7 → N8
- N8 → D3
- D3 → N9 (si "Hay capacidad disponible")
- D3 → E3 (si "Restaurante completo")
- N9 → N10
- N10 → D4
- D4 → N11 (si "Sí")
- D4 → E4 (si "No")
- N11 → N12
- N12 → D5
- D5 → N13 (si "Número válido")
- D5 → E5 (si "Número inválido")
- N13 → N14
- N14 → N15
---

## Notas

- El permiso de cámara es necesario para escanear
- Se valida hash y expiración del código QR
- Máximo 10 acompañantes por registro
- El contador de ocupación incluye acompañantes
