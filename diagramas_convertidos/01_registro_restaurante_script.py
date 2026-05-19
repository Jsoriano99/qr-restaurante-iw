#!/usr/bin/env python3
"""
Registro de Restaurante
Script para recrear el diagrama - Copiar en MagicDraw como referencia
"""

DIAGRAMA = {
  "diagram": {
    "id": "01_registro_restaurante",
    "name": "Registro de Restaurante",
    "type": "activity",
    "notation": "UWE",
    "tool": "MagicDraw with MagicUWE",
    "actor": "Administrador / Restaurante",
    "description": "Diagrama de actividad para el registro de un nuevo restaurante en el sistema"
  },
  "elements": {
    "nodes": [
      {
        "id": "N1",
        "type": "initial_node",
        "label": "Inicio",
        "position": {
          "x": 250,
          "y": 50
        }
      },
      {
        "id": "N2",
        "type": "activity",
        "label": "Acceder al formulario de registro de restaurante",
        "position": {
          "x": 250,
          "y": 120
        }
      },
      {
        "id": "N3",
        "type": "activity",
        "label": "Introducir datos del restaurante:\n- Nombre\n- Dirección\n- Tipo de cocina\n- Capacidad máxima\n- Horario",
        "position": {
          "x": 250,
          "y": 200
        }
      },
      {
        "id": "N4",
        "type": "activity",
        "label": "Validar datos completados",
        "position": {
          "x": 250,
          "y": 280
        }
      },
      {
        "id": "N5",
        "type": "activity",
        "label": "Guardar restaurante en la base de datos",
        "position": {
          "x": 250,
          "y": 360
        }
      },
      {
        "id": "N6",
        "type": "activity",
        "label": "Generar código QR único",
        "position": {
          "x": 250,
          "y": 430
        }
      },
      {
        "id": "N7",
        "type": "activity",
        "label": "Asignar identificador único al restaurante",
        "position": {
          "x": 250,
          "y": 500
        }
      },
      {
        "id": "N8",
        "type": "activity",
        "label": "Confirmar registro exitoso al restaurante",
        "position": {
          "x": 250,
          "y": 570
        }
      },
      {
        "id": "N9",
        "type": "final_node",
        "label": "Fin",
        "position": {
          "x": 250,
          "y": 640
        }
      },
      {
        "id": "E1",
        "type": "error",
        "label": "Mostrar error",
        "position": {
          "x": 450,
          "y": 280
        }
      }
    ],
    "decisions": [
      {
        "id": "D1",
        "type": "decision",
        "label": "¿Datos válidos?",
        "position": {
          "x": 250,
          "y": 320
        },
        "inputs": [
          "N4"
        ],
        "outputs": [
          {
            "target": "E1",
            "condition": "Datos incompletos o inválidos",
            "type": "error"
          },
          {
            "target": "N5",
            "condition": "Datos válidos",
            "type": "success"
          }
        ]
      }
    ],
    "swimlanes": [
      {
        "id": "SL1",
        "name": "Cliente/Sistema",
        "position": {
          "x": 50,
          "y": 0
        }
      }
    ]
  },
  "flows": [
    {
      "from": "N1",
      "to": "N2"
    },
    {
      "from": "N2",
      "to": "N3"
    },
    {
      "from": "N3",
      "to": "N4"
    },
    {
      "from": "D1",
      "to": "N5",
      "condition": "Datos válidos"
    },
    {
      "from": "E1",
      "to": "N3",
      "condition": "Repetir desde entrada"
    },
    {
      "from": "N5",
      "to": "N6"
    },
    {
      "from": "N6",
      "to": "N7"
    },
    {
      "from": "N7",
      "to": "N8"
    },
    {
      "from": "N8",
      "to": "N9"
    }
  ],
  "notes": [
    "Los datos incluyen: nombre, dirección, tipo de cocina, capacidad máxima y horario",
    "Se genera UUID único para el código QR",
    "El restaurante recibe confirmación por email"
  ]
}

# Estructura de elementos para recrear:
# - Nodos: actividades, nodos inicial/final, errores
# - Decisiones: puntos de decisión con condiciones
# - Flujos: flechas entre elementos

ELEMENTOS = {
    "nodes": [
        {"id": "N1", "type": "initial_node", "label": """Inicio"""},
        {"id": "N2", "type": "activity", "label": """Acceder al formulario de registro de restaurante"""},
        {"id": "N3", "type": "activity", "label": """Introducir datos del restaurante:
- Nombre
- Dirección
- Tipo de cocina
- Capacidad máxima
- Horario"""},
        {"id": "N4", "type": "activity", "label": """Validar datos completados"""},
        {"id": "N5", "type": "activity", "label": """Guardar restaurante en la base de datos"""},
        {"id": "N6", "type": "activity", "label": """Generar código QR único"""},
        {"id": "N7", "type": "activity", "label": """Asignar identificador único al restaurante"""},
        {"id": "N8", "type": "activity", "label": """Confirmar registro exitoso al restaurante"""},
        {"id": "N9", "type": "final_node", "label": """Fin"""},
        {"id": "E1", "type": "error", "label": """Mostrar error"""}
    ],
    "decisions": [
        {"id": "D1", "label": """¿Datos válidos?"""}
    ],
    "flows": [
        {"from": "N1", "to": "N2"}",
        {"from": "N2", "to": "N3"}",
        {"from": "N3", "to": "N4"}",
        {"from": "D1", "to": "N5", "condition": """Datos válidos"""},
        {"from": "E1", "to": "N3", "condition": """Repetir desde entrada"""},
        {"from": "N5", "to": "N6"}",
        {"from": "N6", "to": "N7"}",
        {"from": "N7", "to": "N8"}",
        {"from": "N8", "to": "N9"}"
    ]
}

# Instrucciones para recrear en MagicDraw:
# 1. Abrir MagicDraw
# 2. Crear nuevo Activity Diagram
# 3. Seguiros nombres y posiciones de ELEMENTOS
# 4. Conectar con flujos indica2os
