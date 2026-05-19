#!/usr/bin/env python3
"""
Escaneo y Registro de Entrada
Script para recrear el diagrama - Copiar en MagicDraw como referencia
"""

DIAGRAMA = {
  "diagram": {
    "id": "03_escaneo_entrada",
    "name": "Escaneo y Registro de Entrada",
    "type": "activity",
    "notation": "UWE",
    "tool": "MagicDraw with MagicUWE",
    "actor": "Cliente",
    "description": "Diagrama de actividad para el escaneo de código QR y registro de entrada al restaurante"
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
        "label": "Abrir aplicación de escaneo en el dispositivo móvil",
        "position": {
          "x": 300,
          "y": 120
        }
      },
      {
        "id": "N3",
        "type": "activity",
        "label": "Permitir cámara para escanear código QR",
        "position": {
          "x": 300,
          "y": 200
        }
      },
      {
        "id": "N4",
        "type": "activity",
        "label": "Escanear código QR del restaurante/mesa",
        "position": {
          "x": 300,
          "y": 270
        }
      },
      {
        "id": "N5",
        "type": "activity",
        "label": "Decodificar datos del QR",
        "position": {
          "x": 300,
          "y": 340
        }
      },
      {
        "id": "N6",
        "type": "activity",
        "label": "Validar código QR:\n- Verificar formato\n- Verificar hash\n- Verificar expiración",
        "position": {
          "x": 300,
          "y": 410
        }
      },
      {
        "id": "N7",
        "type": "activity",
        "label": "Obtener información del restaurante",
        "position": {
          "x": 300,
          "y": 480
        }
      },
      {
        "id": "N8",
        "type": "activity",
        "label": "Verificar capacidad actual vs. máxima",
        "position": {
          "x": 300,
          "y": 550
        }
      },
      {
        "id": "N9",
        "type": "activity",
        "label": "Registrar entrada con:\n- Timestamp actual\n- ID restaurante\n- ID código QR\n- ID cliente (opcional)",
        "position": {
          "x": 300,
          "y": 620
        }
      },
      {
        "id": "N10",
        "type": "activity",
        "label": "Incrementar contador de ocupación actual",
        "position": {
          "x": 300,
          "y": 690
        }
      },
      {
        "id": "N11",
        "type": "activity",
        "label": "Solicitar número de acompañantes",
        "position": {
          "x": 300,
          "y": 760
        }
      },
      {
        "id": "N12",
        "type": "activity",
        "label": "Validar número (1-10)",
        "position": {
          "x": 300,
          "y": 820
        }
      },
      {
        "id": "N13",
        "type": "activity",
        "label": "Registrar acompañantes en la entrada",
        "position": {
          "x": 300,
          "y": 890
        }
      },
      {
        "id": "N14",
        "type": "activity",
        "label": "Actualizar contador de ocupación (+ acompañantes)",
        "position": {
          "x": 300,
          "y": 950
        }
      },
      {
        "id": "N15",
        "type": "final_node",
        "label": "Fin - Entrada con acompañantes",
        "position": {
          "x": 300,
          "y": 1020
        }
      },
      {
        "id": "E1",
        "type": "error",
        "label": "Fin - Error",
        "position": {
          "x": 550,
          "y": 200
        }
      },
      {
        "id": "E2",
        "type": "error",
        "label": "Fin - Error",
        "position": {
          "x": 550,
          "y": 410
        }
      },
      {
        "id": "E3",
        "type": "error",
        "label": "Fin - Error",
        "position": {
          "x": 550,
          "y": 550
        }
      },
      {
        "id": "E4",
        "type": "final_node",
        "label": "Fin - Entrada registrada",
        "position": {
          "x": 80,
          "y": 760
        }
      },
      {
        "id": "E5",
        "type": "error",
        "label": "Mostrar error",
        "position": {
          "x": 550,
          "y": 820
        }
      }
    ],
    "decisions": [
      {
        "id": "D1",
        "type": "decision",
        "label": "¿Permiso concedido?",
        "position": {
          "x": 300,
          "y": 235
        },
        "outputs": [
          {
            "target": "E1",
            "condition": "Permiso denegado",
            "type": "error"
          },
          {
            "target": "N4",
            "condition": "Permiso concedido",
            "type": "success"
          }
        ]
      },
      {
        "id": "D2",
        "type": "decision",
        "label": "¿Código QR válido?",
        "position": {
          "x": 300,
          "y": 470
        },
        "outputs": [
          {
            "target": "E2",
            "condition": "Código inválido",
            "type": "error"
          },
          {
            "target": "N7",
            "condition": "Código válido",
            "type": "success"
          }
        ]
      },
      {
        "id": "D3",
        "type": "decision",
        "label": "¿Hay capacidad?",
        "position": {
          "x": 300,
          "y": 610
        },
        "outputs": [
          {
            "target": "E3",
            "condition": "Restaurante completo",
            "type": "error"
          },
          {
            "target": "N9",
            "condition": "Hay capacidad disponible",
            "type": "success"
          }
        ]
      },
      {
        "id": "D4",
        "type": "decision",
        "label": "¿Registrar acompañantes?",
        "position": {
          "x": 300,
          "y": 730
        },
        "outputs": [
          {
            "target": "E4",
            "condition": "No",
            "type": "success"
          },
          {
            "target": "N11",
            "condition": "Sí",
            "type": "success"
          }
        ]
      },
      {
        "id": "D5",
        "type": "decision",
        "label": "¿Número válido?",
        "position": {
          "x": 300,
          "y": 865
        },
        "outputs": [
          {
            "target": "E5",
            "condition": "Número inválido",
            "type": "error"
          },
          {
            "target": "N13",
            "condition": "Número válido",
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
      "condition": "Permiso concedido"
    },
    {
      "from": "D1",
      "to": "E1",
      "condition": "Permiso denegado"
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
      "to": "D2"
    },
    {
      "from": "D2",
      "to": "N7",
      "condition": "Código válido"
    },
    {
      "from": "D2",
      "to": "E2",
      "condition": "Código inválido"
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
      "condition": "Hay capacidad disponible"
    },
    {
      "from": "D3",
      "to": "E3",
      "condition": "Restaurante completo"
    },
    {
      "from": "N9",
      "to": "N10"
    },
    {
      "from": "N10",
      "to": "D4"
    },
    {
      "from": "D4",
      "to": "N11",
      "condition": "Sí"
    },
    {
      "from": "D4",
      "to": "E4",
      "condition": "No"
    },
    {
      "from": "N11",
      "to": "N12"
    },
    {
      "from": "N12",
      "to": "D5"
    },
    {
      "from": "D5",
      "to": "N13",
      "condition": "Número válido"
    },
    {
      "from": "D5",
      "to": "E5",
      "condition": "Número inválido"
    },
    {
      "from": "N13",
      "to": "N14"
    },
    {
      "from": "N14",
      "to": "N15"
    }
  ],
  "notes": [
    "El permiso de cámara es necesario para escanear",
    "Se valida hash y expiración del código QR",
    "Máximo 10 acompañantes por registro",
    "El contador de ocupación incluye acompañantes"
  ]
}

# Estructura de elementos para recrear:
# - Nodos: actividades, nodos inicial/final, errores
# - Decisiones: puntos de decisión con condiciones
# - Flujos: flechas entre elementos

ELEMENTOS = {
    "nodes": [
        {"id": "N1", "type": "initial_node", "label": """Inicio"""},
        {"id": "N2", "type": "activity", "label": """Abrir aplicación de escaneo en el dispositivo móvil"""},
        {"id": "N3", "type": "activity", "label": """Permitir cámara para escanear código QR"""},
        {"id": "N4", "type": "activity", "label": """Escanear código QR del restaurante/mesa"""},
        {"id": "N5", "type": "activity", "label": """Decodificar datos del QR"""},
        {"id": "N6", "type": "activity", "label": """Validar código QR:
- Verificar formato
- Verificar hash
- Verificar expiración"""},
        {"id": "N7", "type": "activity", "label": """Obtener información del restaurante"""},
        {"id": "N8", "type": "activity", "label": """Verificar capacidad actual vs. máxima"""},
        {"id": "N9", "type": "activity", "label": """Registrar entrada con:
- Timestamp actual
- ID restaurante
- ID código QR
- ID cliente (opcional)"""},
        {"id": "N10", "type": "activity", "label": """Incrementar contador de ocupación actual"""},
        {"id": "N11", "type": "activity", "label": """Solicitar número de acompañantes"""},
        {"id": "N12", "type": "activity", "label": """Validar número (1-10)"""},
        {"id": "N13", "type": "activity", "label": """Registrar acompañantes en la entrada"""},
        {"id": "N14", "type": "activity", "label": """Actualizar contador de ocupación (+ acompañantes)"""},
        {"id": "N15", "type": "final_node", "label": """Fin - Entrada con acompañantes"""},
        {"id": "E1", "type": "error", "label": """Fin - Error"""},
        {"id": "E2", "type": "error", "label": """Fin - Error"""},
        {"id": "E3", "type": "error", "label": """Fin - Error"""},
        {"id": "E4", "type": "final_node", "label": """Fin - Entrada registrada"""},
        {"id": "E5", "type": "error", "label": """Mostrar error"""}
    ],
    "decisions": [
        {"id": "D1", "label": """¿Permiso concedido?"""},
        {"id": "D2", "label": """¿Código QR válido?"""},
        {"id": "D3", "label": """¿Hay capacidad?"""},
        {"id": "D4", "label": """¿Registrar acompañantes?"""},
        {"id": "D5", "label": """¿Número válido?"""}
    ],
    "flows": [
        {"from": "N1", "to": "N2"}",
        {"from": "N2", "to": "N3"}",
        {"from": "N3", "to": "D1"}",
        {"from": "D1", "to": "N4", "condition": """Permiso concedido"""},
        {"from": "D1", "to": "E1", "condition": """Permiso denegado"""},
        {"from": "N4", "to": "N5"}",
        {"from": "N5", "to": "N6"}",
        {"from": "N6", "to": "D2"}",
        {"from": "D2", "to": "N7", "condition": """Código válido"""},
        {"from": "D2", "to": "E2", "condition": """Código inválido"""},
        {"from": "N7", "to": "N8"}",
        {"from": "N8", "to": "D3"}",
        {"from": "D3", "to": "N9", "condition": """Hay capacidad disponible"""},
        {"from": "D3", "to": "E3", "condition": """Restaurante completo"""},
        {"from": "N9", "to": "N10"}",
        {"from": "N10", "to": "D4"}",
        {"from": "D4", "to": "N11", "condition": """Sí"""},
        {"from": "D4", "to": "E4", "condition": """No"""},
        {"from": "N11", "to": "N12"}",
        {"from": "N12", "to": "D5"}",
        {"from": "D5", "to": "N13", "condition": """Número válido"""},
        {"from": "D5", "to": "E5", "condition": """Número inválido"""},
        {"from": "N13", "to": "N14"}",
        {"from": "N14", "to": "N15"}"
    ]
}

# Instrucciones para recrear en MagicDraw:
# 1. Abrir MagicDraw
# 2. Crear nuevo Activity Diagram
# 3. Seguiros nombres y posiciones de ELEMENTOS
# 4. Conectar con flujos indica2os
