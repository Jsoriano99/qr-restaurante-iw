#!/usr/bin/env python3
"""
Reporte de Afluencia
Script para recrear el diagrama - Copiar en MagicDraw como referencia
"""

DIAGRAMA = {
  "diagram": {
    "id": "08_reporte_afluencia",
    "name": "Reporte de Afluencia",
    "type": "activity",
    "notation": "UWE",
    "tool": "MagicDraw with MagicUWE",
    "actor": "Administrador",
    "description": "Diagrama de actividad para generar reportes de afluencia del restaurante"
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
        "label": "Acceder a sección de reportes",
        "position": {
          "x": 300,
          "y": 120
        }
      },
      {
        "id": "N3",
        "type": "activity",
        "label": "Seleccionar tipo de reporte:\n- Por restaurante\n- Por fecha/rango\n- Por horario\n- Comparativo",
        "position": {
          "x": 300,
          "y": 190
        }
      },
      {
        "id": "N4",
        "type": "activity",
        "label": "Seleccionar período:\n- Hoy\n- Última semana\n- Último mes\n- Rango personalizado",
        "position": {
          "x": 300,
          "y": 260
        }
      },
      {
        "id": "N5",
        "type": "activity",
        "label": "Generar consulta de datos en base de datos",
        "position": {
          "x": 300,
          "y": 330
        }
      },
      {
        "id": "N6",
        "type": "activity",
        "label": "Procesar y calcular métricas:\n- Total entradas\n- Total salidas\n- Duración media\n- Peak hours\n- Acompañantes media",
        "position": {
          "x": 300,
          "y": 400
        }
      },
      {
        "id": "N7",
        "type": "activity",
        "label": "Generar PDF",
        "position": {
          "x": 550,
          "y": 480
        }
      },
      {
        "id": "N8",
        "type": "activity",
        "label": "Generar Excel",
        "position": {
          "x": 550,
          "y": 540
        }
      },
      {
        "id": "N9",
        "type": "activity",
        "label": "Generar CSV",
        "position": {
          "x": 550,
          "y": 600
        }
      },
      {
        "id": "N10",
        "type": "activity",
        "label": "Mostrar reporte con gráficos y estadísticas",
        "position": {
          "x": 300,
          "y": 480
        }
      },
      {
        "id": "N11",
        "type": "final_node",
        "label": "Fin",
        "position": {
          "x": 300,
          "y": 550
        }
      }
    ],
    "decisions": [
      {
        "id": "D1",
        "type": "decision",
        "label": "¿Exportar reporte?",
        "position": {
          "x": 300,
          "y": 440
        },
        "outputs": [
          {
            "target": "N10",
            "condition": "No",
            "type": "success"
          },
          {
            "target": "N7",
            "condition": "Sí - PDF",
            "type": "export"
          },
          {
            "target": "N8",
            "condition": "Sí - Excel",
            "type": "export"
          },
          {
            "target": "N9",
            "condition": "Sí - CSV",
            "type": "export"
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
      "to": "N5"
    },
    {
      "from": "N5",
      "to": "N6"
    },
    {
      "from": "N6",
      "to": "D1"
    },
    {
      "from": "D1",
      "to": "N10",
      "condition": "No"
    },
    {
      "from": "D1",
      "to": "N7",
      "condition": "Sí - PDF"
    },
    {
      "from": "D1",
      "to": "N8",
      "condition": "Sí - Excel"
    },
    {
      "from": "D1",
      "to": "N9",
      "condition": "Sí - CSV"
    },
    {
      "from": "N7",
      "to": "N10"
    },
    {
      "from": "N8",
      "to": "N10"
    },
    {
      "from": "N9",
      "to": "N10"
    },
    {
      "from": "N10",
      "to": "N11"
    }
  ],
  "notes": [
    "Los reportes incluyen gráficos visuals",
    "Está disponible exportación en PDF, Excel y CSV",
    "El rango personalizado permite select fechas específicas"
  ]
}

# Estructura de elementos para recrear:
# - Nodos: actividades, nodos inicial/final, errores
# - Decisiones: puntos de decisión con condiciones
# - Flujos: flechas entre elementos

ELEMENTOS = {
    "nodes": [
        {"id": "N1", "type": "initial_node", "label": """Inicio"""},
        {"id": "N2", "type": "activity", "label": """Acceder a sección de reportes"""},
        {"id": "N3", "type": "activity", "label": """Seleccionar tipo de reporte:
- Por restaurante
- Por fecha/rango
- Por horario
- Comparativo"""},
        {"id": "N4", "type": "activity", "label": """Seleccionar período:
- Hoy
- Última semana
- Último mes
- Rango personalizado"""},
        {"id": "N5", "type": "activity", "label": """Generar consulta de datos en base de datos"""},
        {"id": "N6", "type": "activity", "label": """Procesar y calcular métricas:
- Total entradas
- Total salidas
- Duración media
- Peak hours
- Acompañantes media"""},
        {"id": "N7", "type": "activity", "label": """Generar PDF"""},
        {"id": "N8", "type": "activity", "label": """Generar Excel"""},
        {"id": "N9", "type": "activity", "label": """Generar CSV"""},
        {"id": "N10", "type": "activity", "label": """Mostrar reporte con gráficos y estadísticas"""},
        {"id": "N11", "type": "final_node", "label": """Fin"""}
    ],
    "decisions": [
        {"id": "D1", "label": """¿Exportar reporte?"""}
    ],
    "flows": [
        {"from": "N1", "to": "N2"}",
        {"from": "N2", "to": "N3"}",
        {"from": "N3", "to": "N4"}",
        {"from": "N4", "to": "N5"}",
        {"from": "N5", "to": "N6"}",
        {"from": "N6", "to": "D1"}",
        {"from": "D1", "to": "N10", "condition": """No"""},
        {"from": "D1", "to": "N7", "condition": """Sí - PDF"""},
        {"from": "D1", "to": "N8", "condition": """Sí - Excel"""},
        {"from": "D1", "to": "N9", "condition": """Sí - CSV"""},
        {"from": "N7", "to": "N10"}",
        {"from": "N8", "to": "N10"}",
        {"from": "N9", "to": "N10"}",
        {"from": "N10", "to": "N11"}"
    ]
}

# Instrucciones para recrear en MagicDraw:
# 1. Abrir MagicDraw
# 2. Crear nuevo Activity Diagram
# 3. Seguiros nombres y posiciones de ELEMENTOS
# 4. Conectar con flujos indica2os
