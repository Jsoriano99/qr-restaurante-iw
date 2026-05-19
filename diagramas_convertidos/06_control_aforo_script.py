#!/usr/bin/env python3
"""
Control de Aforo en Tiempo Real
Script para recrear el diagrama - Copiar en MagicDraw como referencia
"""

DIAGRAMA = {
  "diagram": {
    "id": "06_control_aforo",
    "name": "Control de Aforo en Tiempo Real",
    "type": "activity",
    "notation": "UWE",
    "tool": "MagicDraw with MagicUWE",
    "actor": "Restaurante / Administrador",
    "description": "Diagrama de actividad para el control de afición en tiempo real del restaurante"
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
        "label": "Acceder al panel de control de ocupación",
        "position": {
          "x": 300,
          "y": 120
        }
      },
      {
        "id": "N3",
        "type": "activity",
        "label": "Obtener datos de ocupación:\n- Capacidad máxima\n- Ocupación actual\n- % ocupación\n- Historial última hora",
        "position": {
          "x": 300,
          "y": 200
        }
      },
      {
        "id": "N4",
        "type": "activity",
        "label": "Generar notificación de alerta",
        "position": {
          "x": 550,
          "y": 280
        }
      },
      {
        "id": "N5",
        "type": "activity",
        "label": "Notificar al restaurante:\n'Capacidad casi llena'",
        "position": {
          "x": 550,
          "y": 340
        }
      },
      {
        "id": "N6",
        "type": "activity",
        "label": "Limitar nuevas entradas",
        "position": {
          "x": 550,
          "y": 420
        }
      },
      {
        "id": "N7",
        "type": "activity",
        "label": "Continuar normalmente",
        "position": {
          "x": 300,
          "y": 280
        }
      },
      {
        "id": "N8",
        "type": "activity",
        "label": "Mostrar gráfico de ocupación en tiempo real",
        "position": {
          "x": 300,
          "y": 350
        }
      },
      {
        "id": "N9",
        "type": "activity",
        "label": "Mostrar gráfico histórico:\n- Por día\n- Por hora\n- Tendencia",
        "position": {
          "x": 300,
          "y": 450
        }
      },
      {
        "id": "N10",
        "type": "final_node",
        "label": "Fin",
        "position": {
          "x": 300,
          "y": 520
        }
      }
    ],
    "decisions": [
      {
        "id": "D1",
        "type": "decision",
        "label": "¿Ocupación > 80%?",
        "position": {
          "x": 300,
          "y": 240
        },
        "outputs": [
          {
            "target": "N4",
            "condition": "Sí",
            "type": "alert"
          },
          {
            "target": "N7",
            "condition": "No",
            "type": "success"
          }
        ]
      },
      {
        "id": "D2",
        "type": "decision",
        "label": "¿Activar modo restrictivo?",
        "position": {
          "x": 550,
          "y": 380
        },
        "outputs": [
          {
            "target": "N6",
            "condition": "Sí",
            "type": "restrictive"
          },
          {
            "target": "N7",
            "condition": "No",
            "type": "normal"
          }
        ]
      },
      {
        "id": "D3",
        "type": "decision",
        "label": "¿Ver histórico de afluencia?",
        "position": {
          "x": 300,
          "y": 400
        },
        "outputs": [
          {
            "target": "N9",
            "condition": "Sí",
            "type": "success"
          },
          {
            "target": "N10",
            "condition": "No",
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
      "condition": "Sí"
    },
    {
      "from": "D1",
      "to": "N7",
      "condition": "No"
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
      "condition": "Sí"
    },
    {
      "from": "D2",
      "to": "N7",
      "condition": "No"
    },
    {
      "from": "N6",
      "to": "N8"
    },
    {
      "from": "N7",
      "to": "N8"
    },
    {
      "from": "N8",
      "to": "D3"
    },
    {
      "from": "D3",
      "to": "N9",
      "condition": "Sí"
    },
    {
      "from": "D3",
      "to": "N10",
      "condition": "No"
    },
    {
      "from": "N9",
      "to": "N10"
    }
  ],
  "notes": [
    "El umbral de 80% es configurable",
    "El modo restrictivo limita nuevas entradas",
    "El histórico muestra datos de los últimos 30 días"
  ]
}

# Estructura de elementos para recrear:
# - Nodos: actividades, nodos inicial/final, errores
# - Decisiones: puntos de decisión con condiciones
# - Flujos: flechas entre elementos

ELEMENTOS = {
    "nodes": [
        {"id": "N1", "type": "initial_node", "label": """Inicio"""},
        {"id": "N2", "type": "activity", "label": """Acceder al panel de control de ocupación"""},
        {"id": "N3", "type": "activity", "label": """Obtener datos de ocupación:
- Capacidad máxima
- Ocupación actual
- % ocupación
- Historial última hora"""},
        {"id": "N4", "type": "activity", "label": """Generar notificación de alerta"""},
        {"id": "N5", "type": "activity", "label": """Notificar al restaurante:
'Capacidad casi llena'"""},
        {"id": "N6", "type": "activity", "label": """Limitar nuevas entradas"""},
        {"id": "N7", "type": "activity", "label": """Continuar normalmente"""},
        {"id": "N8", "type": "activity", "label": """Mostrar gráfico de ocupación en tiempo real"""},
        {"id": "N9", "type": "activity", "label": """Mostrar gráfico histórico:
- Por día
- Por hora
- Tendencia"""},
        {"id": "N10", "type": "final_node", "label": """Fin"""}
    ],
    "decisions": [
        {"id": "D1", "label": """¿Ocupación > 80%?"""},
        {"id": "D2", "label": """¿Activar modo restrictivo?"""},
        {"id": "D3", "label": """¿Ver histórico de afluencia?"""}
    ],
    "flows": [
        {"from": "N1", "to": "N2"}",
        {"from": "N2", "to": "N3"}",
        {"from": "N3", "to": "D1"}",
        {"from": "D1", "to": "N4", "condition": """Sí"""},
        {"from": "D1", "to": "N7", "condition": """No"""},
        {"from": "N4", "to": "N5"}",
        {"from": "N5", "to": "D2"}",
        {"from": "D2", "to": "N6", "condition": """Sí"""},
        {"from": "D2", "to": "N7", "condition": """No"""},
        {"from": "N6", "to": "N8"}",
        {"from": "N7", "to": "N8"}",
        {"from": "N8", "to": "D3"}",
        {"from": "D3", "to": "N9", "condition": """Sí"""},
        {"from": "D3", "to": "N10", "condition": """No"""},
        {"from": "N9", "to": "N10"}"
    ]
}

# Instrucciones para recrear en MagicDraw:
# 1. Abrir MagicDraw
# 2. Crear nuevo Activity Diagram
# 3. Seguiros nombres y posiciones de ELEMENTOS
# 4. Conectar con flujos indica2os
