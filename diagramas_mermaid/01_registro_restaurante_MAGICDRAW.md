# 01_registro_restaurante - Guía para MagicDraw

## Diagrama de Actividad - UWE

### Instrucciones para crear en MagicDraw:

1. Abrir MagicDraw
2. Crear nuevo proyecto
3. New Diagram → Activity Diagram
4. Crear los siguientes elementos en orden:

---

## Elementos a crear:

### 1. Nodo Inicial (Initial Node)
- **Símbolo**: Círculo negrofilled
- **Nombre**: "Inicio"
- **Posición**: x=250, y=50

### 2. Actividad 1
- **Símbolo**: Rectángulo rounded
- **Nombre**: "Acceder al formulario de registro de restaurante"
- **Posición**: x=250, y=120

### 3. Actividad 2  
- **Símbolo**: Rectángulo rounded
- **Nombre**: "Introducir datos del restaurante:\n- Nombre\n- Dirección\n- Tipo de cocina\n- Capacidad máxima\n- Horario"
- **Posición**: x=250, y=200

### 4. Actividad 3
- **Símbolo**: Rectángulo rounded
- **Nombre**: "Validar datos completados"
- **Posición**: x=250, y=280

### 5. Decisión (Decision Node)
- **Símbolo**: Diamante
- **Nombre**: "¿Datos válidos?"
- **Posición**: x=250, y=320
- **Condiciones de salida**:
  - Si "Datos válidos" → Ir a actividad 5
  - Si "Datos incompletos o inválidos" → Ir a nodo de error

### 6. Nodo de Error
- **Símbolo**: Círculo con X
- **Nombre**: "Mostrar error"
- **Posición**: x=450, y=280
- **Flecha**: Volver a "Introducir datos del restaurante" con etiqueta "Repetir desde entrada"

### 7. Actividad 5
- **Símbolo**: Rectángulo rounded
- **Nombre**: "Guardar restaurante en la base de datos"
- **Posición**: x=250, y=360

### 8. Actividad 6
- **Símbolo**: Rectángulo rounded
- **Nombre**: "Generar código QR único"
- **Posición**: x=250, y=430

### 9. Actividad 7
- **Símbolo**: Rectángulo rounded
- **Nombre**: "Asignar identificador único al restaurante"
- **Posición**: x=250, y=500

### 10. Actividad 8
- **Símbolo**: Rectángulo rounded
- **Nombre**: "Confirmar registro exitoso al restaurante"
- **Posición**: x=250, y=570

### 11. Nodo Final (Final Node)
- **Símbolo**: Círculo doble (filled + hollow)
- **Nombre**: "Fin"
- **Posición**: x=250, y=640

---

## Conexiones (Flows):

1. Inicio → Acceder al formulario (flecha.simple)
2. Acceder al formulario → Introducir datos
3. Introducir datos → Validar datos
4. Validar datos → Decisión "¿Datos válidos?"
5. Decisión → "Guardar restaurante" (condición: "Datos válidos")
6. "Mostrar error" → "Introducir datos" (condición: "Repetir desde entrada")
7. Guardar restaurante → Generar QR
8. Generar QR → Asignar ID
9. Asignar ID → Confirmar registro
10. Confirmar registro → Fin

---

## Estilo recomendado:

- Usar swimlanes opcionales para separar actors
- Colores sugeridos:
  - Inicial: Verde
  - Final: Rojo
  - Decisión: Amarillo
  - Actividades: Azul claro
  - Error: Naranja

---

## Notas del diagrama original:

- Los datos incluyen: nombre, dirección, tipo de cocina, capacidad máxima y horario
- Se genera UUID único para el código QR
- El restaurante recibe confirmación por email