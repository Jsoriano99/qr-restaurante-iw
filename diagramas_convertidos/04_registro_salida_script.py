#!/usr/bin/env python3
"""
Registro de Salida
Script para recrear el diagrama - Copiar en MagicDraw como referencia
"""

DIAGRAMA = {
  "diagram": {
    "id": "04_registro_salida",
    "name": "Registro de Salida",
    "type": "activity",
    "notation": "UWE",
    "tool": "MagicDraw with MagicUWE",
    "actor": "Cliente",
    "description": "Diagrama de actividad para el registro de salida del restaurante"
  },
  "elements": {
    "nodes": [
      {
        "id": "N1",
        "type": "initial_node",
        "label": "Inicio",
        "position": {
          "x": 300,
          "y": 50
        }
      },
      {
        "id": "N2",
        "type": "activity",
        "label": "Acceder a Mis Visitas en la aplicación",
        "position": {
          "x": 300,
          "y": 120
        }
      },
      {
        "id": "N3",
        "type": "activity",
        "label": "Seleccionar visita activa (restaurante con entrada sin salida)",
        "position": {
          "x": 300,
          "y": 190
        }
      },
      {
        "id": "N4",
        "type": "activity",
        "label": "Confirmar selección de restaurante",
        "position": {
          "x": 300,
          "y": 260
        }
      },
      {
        "id": "N5",
        "type": "activity",
        "label": "Confirmar número de acompañantes originales",
        "position": {
          "x": 300,
          "y": 330
        }
      },
      {
        "id": "N6",
        "type": "activity",
        "label": "Registrar timestamp de salida",
        "position": {
          "x": 300,
          "y": 400
        }
      },
      {
        "id": "N7",
        "type": "activity",
        "label": "Calcular duración de la visita (salida - entrada)",
        "position": {
          "x": 300,
          "y": 470
        }
      },
      {
        "id": "N8",
        "type": "activity",
        "label": "Actualizar registro:\n- Timestamp salida\n- Duración calculada\n- Estado: completado",
        "position": {
          "x": 300,
          "y": 540
        }
      },
      {
        "id": "N9",
        "type": "activity",
        "label": "Decrementar contador de ocupación actual",
        "position": {
          "x": 300,
          "y": 610
        }
      },
      {
        "id": "N10",
        "type": "activity",
        "label": "Ir a valoración",
        "position": {
          "x": 300,
          "y": 750
        }
      },
      {
        "id": "N11",
        "type": "final_node",
        "label": "Fin - Salida registrada",
        "position": {
          "x": 300,
          "y": 820
        }
      },
      {
        "id": "E1",
        "type": "final_node",
        "label": "Fin - Valoración",
        "position": {
          "x": 300,
          "y": 820
        }
      }
    ],
    "decisions": [
      {
        "id": "D1",
        "type": "decision",
        "label": "¿El cliente tuvo acompañantes?",
        "position": {
          "x": 300,
          "y": 295
        },
        "outputs": [
          {
            "target": "N6",
            "condition": "No",
            "type": "success"
          },
          {
            "target": "N5",
            "condition": "Sí",
            "type": "success"
          }
        ]
      },
      {
        "id": "D2",
        "type": "decision",
        "label": "¿Desea valorar el restaurante?",
        "position": {
          "x": 300,
          "y": 680
        },
        "outputs": [
          {
            "target": "N11",
            "condition": "No",
            "type": "success"
          },
          {
            "target": "N10",
            "condition": "Sí",
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
      "to": "N4"
    },
    {
      "from": "N4",
      "to": "D1"
    },
    {
      "from": "D1",
      "to": "N6",
      "condition": "No"
    },
    {
      "from": "D1",
      "to": "N5",
      "condition": "Sí"
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
    },
    {
      "from": "N9",
      "to": "D2"
    },
    {
      "from": "D2",
      "to": "N11",
      "condition": "No"
    },
    {
      "from": "D2",
      "to": "N10",
      "condition": "Sí"
    }
  ],
  "notes": [
    "Solo se muestran visitas sin salida registrada",
    "La duración se calcula en minutos",
    "Al decrementar, también se descuenta el número de acompañantes"
  ]
}

# Estructura de elementos para recrear:
# - Nodos: actividades, nodos inicial/final, errores
# - Decisiones: puntos de decisión con condiciones
# - Flujos: flechas entre elementos

ELEMENTOS = {
    "nodes": [
        {"id": "N1", "type": "initial_node", "label": """Inicio"""},
        {"id": "N2", "type": "activity", "label": """Acceder a Mis Visitas en la aplicación"""},
        {"id": "N3", "type": "activity", "label": """Seleccionar visita activa (restaurante con entrada sin salida)"""},
        {"id": "N4", "type": "activity", "label": """Confirmar selección de restaurante"""},
        {"id": "N5", "type": "activity", "label": """Confirmar número de acompañantes originales"""},
        {"id": "N6", "type": "activity", "label": """Registrar timestamp de salida"""},
        {"id": "N7", "type": "activity", "label": """Calcular duración de la visita (salida - entrada)"""},
        {"id": "N8", "type": "activity", "label": """Actualizar registro:
- Timestamp salida
- Duración calculada
- Estado: completado"""},
        {"id": "N9", "type": "activity", "label": """Decrementar contador de ocupación actual"""},
        {"id": "N10", "type": "activity", "label": """Ir a valoración"""},
        {"id": "N11", "type": "final_node", "label": """Fin - Salida registrada"""},
        {"id": "E1", "type": "final_node", "label": """Fin - Valoración"""}
    ],
    "decisions": [
        {"id": "D1", "label": """¿El cliente tuvo acompañantes?"""},
        {"id": "D2", "label": """¿Desea valorar el restaurante?"""}
    ],
    "flows": [
        {"from": "N1", "to": "N2"}",
        {"from": "N2", "to": "N3"}",
        {"from": "N3", "to": "N4"}",
        {"from": "N4", "to": "D1"}",
        {"from": "D1", "to": "N6", "condition": """No"""},
        {"from": "D1", "to": "N5", "condition": """Sí"""},
        {"from": "N5", "to": "N6"}",
        {"from": "N6", "to": "N7"}",
        {"from": "N7", "to": "N8"}",
        {"from": "N8", "to": "N9"}",
        {"from": "N9", "to": "D2"}",
        {"from": "D2", "to": "N11", "condition": """No"""},
        {"from": "D2", "to": "N10", "condition": """Sí"""}
    ]
}

# Instrucciones para recrear en MagicDraw:
# 1. Abrir MagicDraw
# 2. Crear nuevo Activity Diagram
# 3. Seguiros nombres y posiciones de ELEMENTOS
# 4. Conectar con flujos indica2os
