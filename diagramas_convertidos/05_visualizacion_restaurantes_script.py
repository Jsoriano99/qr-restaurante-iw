#!/usr/bin/env python3
"""
Visualización de Restaurantes Disponibles
Script para recrear el diagrama - Copiar en MagicDraw como referencia
"""

DIAGRAMA = {
  "diagram": {
    "id": "05_visualizacion_restaurantes",
    "name": "Visualización de Restaurantes Disponibles",
    "type": "activity",
    "notation": "UWE",
    "tool": "MagicDraw with MagicUWE",
    "actor": "Cliente",
    "description": "Diagrama de actividad para visualizar y filtrar restaurantes disponibles"
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
        "label": "Abrir lista de restaurantes",
        "position": {
          "x": 300,
          "y": 120
        }
      },
      {
        "id": "N3",
        "type": "activity",
        "label": "Seleccionar tipo de comida (opcional)",
        "position": {
          "x": 300,
          "y": 200
        }
      },
      {
        "id": "N4",
        "type": "activity",
        "label": "Seleccionar zona/barrio (opcional)",
        "position": {
          "x": 300,
          "y": 270
        }
      },
      {
        "id": "N5",
        "type": "activity",
        "label": "Establecer radio de búsqueda (opcional)",
        "position": {
          "x": 300,
          "y": 340
        }
      },
      {
        "id": "N6",
        "type": "activity",
        "label": "Filtrar por disponibilidad:\n- Con puestos disponibles\n- Con espacio suficiente",
        "position": {
          "x": 300,
          "y": 410
        }
      },
      {
        "id": "N7",
        "type": "activity",
        "label": "Consultar base de datos de restaurantes",
        "position": {
          "x": 300,
          "y": 480
        }
      },
      {
        "id": "N8",
        "type": "activity",
        "label": "Calcular distancia desde ubicación actual",
        "position": {
          "x": 300,
          "y": 550
        }
      },
      {
        "id": "N9",
        "type": "activity",
        "label": "Ordenar por:\n- Distancia\n- Valoración\n- Disponibilidad",
        "position": {
          "x": 300,
          "y": 620
        }
      },
      {
        "id": "N10",
        "type": "activity",
        "label": "Mostrar lista de restaurantes con información:\n- Nombre\n- Tipo de comida\n- Distancia\n- Capacidad/ocupación\n- Valoración media\n- Disponibilidad",
        "position": {
          "x": 300,
          "y": 690
        }
      },
      {
        "id": "N11",
        "type": "activity",
        "label": "Seleccionar restaurante para ver detalles",
        "position": {
          "x": 300,
          "y": 760
        }
      },
      {
        "id": "N12",
        "type": "final_node",
        "label": "Fin",
        "position": {
          "x": 300,
          "y": 830
        }
      }
    ],
    "decisions": [
      {
        "id": "D1",
        "type": "decision",
        "label": "¿Aplicar filtros?",
        "position": {
          "x": 300,
          "y": 165
        },
        "outputs": [
          {
            "target": "N7",
            "condition": "No",
            "type": "success"
          },
          {
            "target": "N3",
            "condition": "Sí",
            "type": "success"
          }
        ]
      },
      {
        "id": "D2",
        "type": "decision",
        "label": "¿Ver más detalles o volver?",
        "position": {
          "x": 300,
          "y": 800
        },
        "outputs": [
          {
            "target": "N10",
            "condition": "Volver",
            "type": "success"
          },
          {
            "target": "N12",
            "condition": "Fin",
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
      "to": "D1"
    },
    {
      "from": "D1",
      "to": "N3",
      "condition": "Sí"
    },
    {
      "from": "D1",
      "to": "N7",
      "condition": "No"
    },
    {
      "from": "N3",
      "to": "N4"
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
    },
    {
      "from": "N9",
      "to": "N10"
    },
    {
      "from": "N10",
      "to": "N11"
    },
    {
      "from": "N11",
      "to": "D2"
    },
    {
      "from": "D2",
      "to": "N10",
      "condition": "Volver"
    },
    {
      "from": "D2",
      "to": "N12",
      "condition": "Fin"
    }
  ],
  "notes": [
    "Los filtros son opcionales",
    "La distancia se calcula usando GPS del dispositivo",
    "Se ordenan por defecto por distancia"
  ]
}

# Estructura de elementos para recrear:
# - Nodos: actividades, nodos inicial/final, errores
# - Decisiones: puntos de decisión con condiciones
# - Flujos: flechas entre elementos

ELEMENTOS = {
    "nodes": [
        {"id": "N1", "type": "initial_node", "label": """Inicio"""},
        {"id": "N2", "type": "activity", "label": """Abrir lista de restaurantes"""},
        {"id": "N3", "type": "activity", "label": """Seleccionar tipo de comida (opcional)"""},
        {"id": "N4", "type": "activity", "label": """Seleccionar zona/barrio (opcional)"""},
        {"id": "N5", "type": "activity", "label": """Establecer radio de búsqueda (opcional)"""},
        {"id": "N6", "type": "activity", "label": """Filtrar por disponibilidad:
- Con puestos disponibles
- Con espacio suficiente"""},
        {"id": "N7", "type": "activity", "label": """Consultar base de datos de restaurantes"""},
        {"id": "N8", "type": "activity", "label": """Calcular distancia desde ubicación actual"""},
        {"id": "N9", "type": "activity", "label": """Ordenar por:
- Distancia
- Valoración
- Disponibilidad"""},
        {"id": "N10", "type": "activity", "label": """Mostrar lista de restaurantes con información:
- Nombre
- Tipo de comida
- Distancia
- Capacidad/ocupación
- Valoración media
- Disponibilidad"""},
        {"id": "N11", "type": "activity", "label": """Seleccionar restaurante para ver detalles"""},
        {"id": "N12", "type": "final_node", "label": """Fin"""}
    ],
    "decisions": [
        {"id": "D1", "label": """¿Aplicar filtros?"""},
        {"id": "D2", "label": """¿Ver más detalles o volver?"""}
    ],
    "flows": [
        {"from": "N1", "to": "N2"}",
        {"from": "N2", "to": "D1"}",
        {"from": "D1", "to": "N3", "condition": """Sí"""},
        {"from": "D1", "to": "N7", "condition": """No"""},
        {"from": "N3", "to": "N4"}",
        {"from": "N4", "to": "N5"}",
        {"from": "N5", "to": "N6"}",
        {"from": "N6", "to": "N7"}",
        {"from": "N7", "to": "N8"}",
        {"from": "N8", "to": "N9"}",
        {"from": "N9", "to": "N10"}",
        {"from": "N10", "to": "N11"}",
        {"from": "N11", "to": "D2"}",
        {"from": "D2", "to": "N10", "condition": """Volver"""},
        {"from": "D2", "to": "N12", "condition": """Fin"""}
    ]
}

# Instrucciones para recrear en MagicDraw:
# 1. Abrir MagicDraw
# 2. Crear nuevo Activity Diagram
# 3. Seguiros nombres y posiciones de ELEMENTOS
# 4. Conectar con flujos indica2os
