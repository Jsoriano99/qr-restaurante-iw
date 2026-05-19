#!/usr/bin/env python3
"""
Generación de Código QR
Script para recrear el diagrama - Copiar en MagicDraw como referencia
"""

DIAGRAMA = {
  "diagram": {
    "id": "02_generacion_qr",
    "name": "Generación de Código QR",
    "type": "activity",
    "notation": "UWE",
    "tool": "MagicDraw with MagicUWE",
    "actor": "Sistema / Restaurante",
    "description": "Diagrama de actividad para generar códigos QR únicos por restaurante"
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
        "label": "Solicitar generación de código QR",
        "position": {
          "x": 250,
          "y": 120
        }
      },
      {
        "id": "N3",
        "type": "activity",
        "label": "Verificar que el restaurante está registrado y activo",
        "position": {
          "x": 250,
          "y": 200
        }
      },
      {
        "id": "N4",
        "type": "activity",
        "label": "Generar identificador único (UUID) para el código QR",
        "position": {
          "x": 250,
          "y": 280
        }
      },
      {
        "id": "N5",
        "type": "activity",
        "label": "Codificar información en formato QR:\n- ID restaurante\n- ID mesa/acceso\n- Timestamp\n- Hash de validación",
        "position": {
          "x": 250,
          "y": 350
        }
      },
      {
        "id": "N6",
        "type": "activity",
        "label": "Generar imagen del código QR",
        "position": {
          "x": 250,
          "y": 420
        }
      },
      {
        "id": "N7",
        "type": "activity",
        "label": "Almacenar código QR generado en la base de datos",
        "position": {
          "x": 250,
          "y": 490
        }
      },
      {
        "id": "N8",
        "type": "activity",
        "label": "Entregar código QR al restaurante para impresión",
        "position": {
          "x": 250,
          "y": 560
        }
      },
      {
        "id": "N9",
        "type": "final_node",
        "label": "Fin - Éxito",
        "position": {
          "x": 250,
          "y": 630
        }
      },
      {
        "id": "E1",
        "type": "error",
        "label": "Fin - Error",
        "position": {
          "x": 450,
          "y": 200
        }
      }
    ],
    "decisions": [
      {
        "id": "D1",
        "type": "decision",
        "label": "¿Restaurante válido?",
        "position": {
          "x": 250,
          "y": 240
        },
        "inputs": [
          "N3"
        ],
        "outputs": [
          {
            "target": "E1",
            "condition": "Restaurante no válido",
            "type": "error"
          },
          {
            "target": "N4",
            "condition": "Restaurante válido",
            "type": "success"
          }
        ]
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
      "to": "D1"
    },
    {
      "from": "D1",
      "to": "N4",
      "condition": "Restaurante válido"
    },
    {
      "from": "D1",
      "to": "E1",
      "condition": "Restaurante no válido"
    },
    {
      "from": "N4",
      "to": "N5"
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
    "El UUID se genera cryptográficamente seguro",
    "El hash de validación permite verificar autenticidad del QR",
    "El código QR incluye timestamp para controlar expiración"
  ]
}

# Estructura de elementos para recrear:
# - Nodos: actividades, nodos inicial/final, errores
# - Decisiones: puntos de decisión con condiciones
# - Flujos: flechas entre elementos

ELEMENTOS = {
    "nodes": [
        {"id": "N1", "type": "initial_node", "label": """Inicio"""},
        {"id": "N2", "type": "activity", "label": """Solicitar generación de código QR"""},
        {"id": "N3", "type": "activity", "label": """Verificar que el restaurante está registrado y activo"""},
        {"id": "N4", "type": "activity", "label": """Generar identificador único (UUID) para el código QR"""},
        {"id": "N5", "type": "activity", "label": """Codificar información en formato QR:
- ID restaurante
- ID mesa/acceso
- Timestamp
- Hash de validación"""},
        {"id": "N6", "type": "activity", "label": """Generar imagen del código QR"""},
        {"id": "N7", "type": "activity", "label": """Almacenar código QR generado en la base de datos"""},
        {"id": "N8", "type": "activity", "label": """Entregar código QR al restaurante para impresión"""},
        {"id": "N9", "type": "final_node", "label": """Fin - Éxito"""},
        {"id": "E1", "type": "error", "label": """Fin - Error"""}
    ],
    "decisions": [
        {"id": "D1", "label": """¿Restaurante válido?"""}
    ],
    "flows": [
        {"from": "N1", "to": "N2"}",
        {"from": "N2", "to": "N3"}",
        {"from": "N3", "to": "D1"}",
        {"from": "D1", "to": "N4", "condition": """Restaurante válido"""},
        {"from": "D1", "to": "E1", "condition": """Restaurante no válido"""},
        {"from": "N4", "to": "N5"}",
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
