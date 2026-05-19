#!/usr/bin/env python3
"""
Valoración de Restaurante
Script para recrear el diagrama - Copiar en MagicDraw como referencia
"""

DIAGRAMA = {
  "diagram": {
    "id": "07_valoracion",
    "name": "Valoración de Restaurante",
    "type": "activity",
    "notation": "UWE",
    "tool": "MagicDraw with MagicUWE",
    "actor": "Cliente",
    "description": "Diagrama de actividad para valorar un restaurante después de una visita"
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
        "label": "Acceder a registro de valoración tras visita",
        "position": {
          "x": 300,
          "y": 120
        }
      },
      {
        "id": "N3",
        "type": "activity",
        "label": "Seleccionar puntuación (1-5 estrellas)",
        "position": {
          "x": 300,
          "y": 190
        }
      },
      {
        "id": "N4",
        "type": "activity",
        "label": "Escribir comentario (máx. 500 caracteres)",
        "position": {
          "x": 300,
          "y": 260
        }
      },
      {
        "id": "N5",
        "type": "activity",
        "label": "Validar contenido:\n- Longitud correcta\n- Sin contenido ofensivo",
        "position": {
          "x": 300,
          "y": 330
        }
      },
      {
        "id": "N6",
        "type": "activity",
        "label": "Guardar valoración en base de datos:\n- ID restaurante\n- ID cliente\n- Puntuación\n- Comentario (opt)\n- Timestamp",
        "position": {
          "x": 300,
          "y": 400
        }
      },
      {
        "id": "N7",
        "type": "activity",
        "label": "Recalcular valoración media del restaurante",
        "position": {
          "x": 300,
          "y": 470
        }
      },
      {
        "id": "N8",
        "type": "activity",
        "label": "Confirmar valoración enviada",
        "position": {
          "x": 300,
          "y": 540
        }
      },
      {
        "id": "N9",
        "type": "final_node",
        "label": "Fin - Valoración registrada",
        "position": {
          "x": 300,
          "y": 610
        }
      },
      {
        "id": "E1",
        "type": "error",
        "label": "Mostrar error",
        "position": {
          "x": 550,
          "y": 330
        }
      }
    ],
    "decisions": [
      {
        "id": "D1",
        "type": "decision",
        "label": "¿Añadir comentario?",
        "position": {
          "x": 300,
          "y": 225
        },
        "outputs": [
          {
            "target": "N6",
            "condition": "No",
            "type": "success"
          },
          {
            "target": "N4",
            "condition": "Sí",
            "type": "success"
          }
        ]
      },
      {
        "id": "D2",
        "type": "decision",
        "label": "¿Contenido válido?",
        "position": {
          "x": 300,
          "y": 365
        },
        "outputs": [
          {
            "target": "E1",
            "condition": "Contenido inválido",
            "type": "error"
          },
          {
            "target": "N6",
            "condition": "Contenido válido",
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
      "to": "N6",
      "condition": "No"
    },
    {
      "from": "D1",
      "to": "N4",
      "condition": "Sí"
    },
    {
      "from": "N4",
      "to": "N5"
    },
    {
      "from": "N5",
      "to": "D2"
    },
    {
      "from": "D2",
      "to": "N6",
      "condition": "Contenido válido"
    },
    {
      "from": "D2",
      "to": "E1",
      "condition": "Contenido inválido"
    },
    {
      "from": "E1",
      "to": "N4",
      "condition": "Repetir comentario"
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
    "La puntuación es de 1 a 5 estrellas",
    "El comentario es opcional, máximo 500 caracteres",
    "Se filtra contenido ofensivo automáticamente",
    "La valoración media se recalcula en tiempo real"
  ]
}

# Estructura de elementos para recrear:
# - Nodos: actividades, nodos inicial/final, errores
# - Decisiones: puntos de decisión con condiciones
# - Flujos: flechas entre elementos

ELEMENTOS = {
    "nodes": [
        {"id": "N1", "type": "initial_node", "label": """Inicio"""},
        {"id": "N2", "type": "activity", "label": """Acceder a registro de valoración tras visita"""},
        {"id": "N3", "type": "activity", "label": """Seleccionar puntuación (1-5 estrellas)"""},
        {"id": "N4", "type": "activity", "label": """Escribir comentario (máx. 500 caracteres)"""},
        {"id": "N5", "type": "activity", "label": """Validar contenido:
- Longitud correcta
- Sin contenido ofensivo"""},
        {"id": "N6", "type": "activity", "label": """Guardar valoración en base de datos:
- ID restaurante
- ID cliente
- Puntuación
- Comentario (opt)
- Timestamp"""},
        {"id": "N7", "type": "activity", "label": """Recalcular valoración media del restaurante"""},
        {"id": "N8", "type": "activity", "label": """Confirmar valoración enviada"""},
        {"id": "N9", "type": "final_node", "label": """Fin - Valoración registrada"""},
        {"id": "E1", "type": "error", "label": """Mostrar error"""}
    ],
    "decisions": [
        {"id": "D1", "label": """¿Añadir comentario?"""},
        {"id": "D2", "label": """¿Contenido válido?"""}
    ],
    "flows": [
        {"from": "N1", "to": "N2"}",
        {"from": "N2", "to": "N3"}",
        {"from": "N3", "to": "D1"}",
        {"from": "D1", "to": "N6", "condition": """No"""},
        {"from": "D1", "to": "N4", "condition": """Sí"""},
        {"from": "N4", "to": "N5"}",
        {"from": "N5", "to": "D2"}",
        {"from": "D2", "to": "N6", "condition": """Contenido válido"""},
        {"from": "D2", "to": "E1", "condition": """Contenido inválido"""},
        {"from": "E1", "to": "N4", "condition": """Repetir comentario"""},
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
