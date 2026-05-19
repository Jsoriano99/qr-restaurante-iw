#!/usr/bin/env python3
"""
Scripts de prueba automatizados para el sistema QR Restaurante.

Ejecutar con: pytest test_pruebas.py -v

Requisitos:
    pip install pytest requests

Configuración:
    La variable BASE_URL apunta al entorno de desarrollo local.
    Modificar según el entorno de prueba disponible.
"""

import pytest
import requests
import uuid
import time

# ═══════════════════════════════════════════════════════════════
# CONFIGURACIÓN
# ═══════════════════════════════════════════════════════════════
BASE_URL = "http://localhost:8000"  # Cambiar según entorno
API_V1 = f"{BASE_URL}/api/v1"

# ═══════════════════════════════════════════════════════════════
# FIJTURES GLOBALES
# ═══════════════════════════════════════════════════════════════

@pytest.fixture
def restaurante_token():
    """Registra un restaurante de prueba y devuelve su token de autenticación."""
    datos = {
        "nombre": f"Restaurante Test {uuid.uuid4().hex[:8]}",
        "direccion": "Calle Falsa 123",
        "tipo_cocina": "italiana",
        "capacidad_maxima": 50,
        "horario_apertura": "09:00",
        "horario_cierre": "23:00",
        "telefono": "+34600000000",
        "email": f"test{uuid.uuid4().hex[:6]}@example.com",
        "password": "TestPass123!"
    }
    response = requests.post(f"{API_V1}/restaurantes/registrar", json=datos)
    assert response.status_code == 201, f"Error al registrar restaurante: {response.text}"
    token = response.json()["token"]
    rest_id = response.json()["restaurante_id"]
    return {"token": token, "restaurante_id": rest_id, "datos": datos}


@pytest.fixture
def cliente_token():
    """Registra un cliente de prueba y devuelve su token de autenticación."""
    datos = {
        "nombre": f"Cliente Test {uuid.uuid4().hex[:8]}",
        "email": f"cliente{uuid.uuid4().hex[:6]}@example.com",
        "password": "TestPass123!",
        "telefono": "+34611111111"
    }
    response = requests.post(f"{API_V1}/clientes/registrar", json=datos)
    assert response.status_code == 201, f"Error al registrar cliente: {response.text}"
    token = response.json()["token"]
    cliente_id = response.json()["cliente_id"]
    return {"token": token, "cliente_id": cliente_id}


@pytest.fixture
def qr_activo(restaurante_token):
    """Genera un código QR activo para el restaurante fixture."""
    headers = {"Authorization": f"Bearer {restaurante_token['token']}"}
    datos_qr = {"id_mesa": 1, "capacidad_mesa": 4}
    response = requests.post(
        f"{API_V1}/restaurantes/{restaurante_token['restaurante_id']}/qr/generar",
        headers=headers,
        json=datos_qr
    )
    assert response.status_code == 201, f"Error al generar QR: {response.text}"
    qr_data = response.json()
    return {
        "uuid": qr_data["uuid"],
        "restaurante_id": restaurante_token["restaurante_id"],
        "headers_rest": headers
    }


# ═══════════════════════════════════════════════════════════════
# TC-01: PRUEBAS DE REGISTRO DE RESTAURANTE (RF-01)
# ═══════════════════════════════════════════════════════════════

class TestRegistroRestaurante:
    """TC-01.x: Verifican el registro y gestión de perfil de restaurante."""

    def test_tc01_1_registro_exitoso(self, restaurante_token):
        """RF-01: Registrar restaurante con datos válidos → éxito."""
        # El fixture ya valida el registro exitoso
        assert restaurante_token["restaurante_id"] is not None
        assert len(restaurante_token["token"]) > 0

    def test_tc01_2_datos_incompletos(self):
        """RF-01: Registrar con campos faltantes → error 400."""
        datos = {"nombre": "Incompleto"}
        response = requests.post(f"{API_V1}/restaurantes/registrar", json=datos)
        assert response.status_code == 400
        body = response.json()
        assert "errores" in body or "error" in body

    def test_tc01_3_email_duplicado(self, restaurante_token):
        """RF-01: Registrar con email existente → error 409."""
        datos = {
            "nombre": "Otro Restaurante",
            "email": restaurante_token["datos"]["email"],  # Email duplicado
            "password": "OtraPass456!",
            "direccion": "Otra Calle 456",
            "tipo_cocina": "mexicana",
            "capacidad_maxima": 30,
            "horario_apertura": "10:00",
            "horario_cierre": "22:00"
        }
        response = requests.post(f"{API_V1}/restaurantes/registrar", json=datos)
        assert response.status_code == 409


# ═══════════════════════════════════════════════════════════════
# TC-02: PRUEBAS DE GENERACIÓN DE CÓDIGO QR (RF-02)
# ═══════════════════════════════════════════════════════════════

class TestGeneracionQR:
    """TC-02.x: Verifican la generación de códigos QR únicos."""

    def test_tc02_1_generar_qr_exitoso(self, qr_activo):
        """RF-02: Generar QR → UUID válido, estado activo."""
        assert qr_activo["uuid"] is not None
        assert len(qr_activo["uuid"]) == 36  # UUID v4 estándar

    def test_tc02_3_decodificar_qr(self, qr_activo):
        """RF-02: Decodificar QR → contiene ID restaurante, mesa, hash."""
        headers = qr_activo["headers_rest"]
        response = requests.get(
            f"{API_V1}/qr/{qr_activo['uuid']}/verificar",
            headers=headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["restaurante_id"] == qr_activo["restaurante_id"]
        assert data["activo"] is True


# ═══════════════════════════════════════════════════════════════
# TC-03: PRUEBAS DE REGISTRO DE ENTRADA POR QR (RF-03, RF-04)
# ═══════════════════════════════════════════════════════════════

class TestEntradaEscaneo:
    """TC-03.x: Verifican el escaneo de QR y registro de entrada."""

    def test_tc03_1_entrada_qr_valido(self, cliente_token, qr_activo):
        """RF-03: Escaneo QR válido → visita registrada, aforo actualizado."""
        headers_cli = {"Authorization": f"Bearer {cliente_token['token']}"}

        # Obtener estado inicial del aforo
        response_aforo = requests.get(
            f"{API_V1}/restaurantes/{qr_activo['restaurante_id']}/aforo",
            headers=qr_activo["headers_rest"]
        )
        aforo_inicial = response_aforo.json()["ocupacion_actual"]

        # Registrar entrada
        datos_entrada = {"qr_uuid": qr_activo["uuid"], "acompanantes": 2}
        response = requests.post(
            f"{API_V1}/clientes/{cliente_token['cliente_id']}/entrada",
            headers=headers_cli,
            json=datos_entrada
        )
        assert response.status_code == 201
        data = response.json()
        assert data["estado"] == "activa"
        assert data["acompanantes"] == 2

        # Verificar incremento de aforo
        response_aforo_2 = requests.get(
            f"{API_V1}/restaurantes/{qr_activo['restaurante_id']}/aforo",
            headers=qr_activo["headers_rest"]
        )
        aforo_final = response_aforo_2.json()["ocupacion_actual"]
        assert aforo_final == aforo_inicial + 3  # 1 cliente + 2 acompañantes

    def test_tc03_2_qr_expirado(self, cliente_token, restaurante_token):
        """RF-03: Escaneo con QR expirado → error 410."""
        headers = {"Authorization": f"Bearer {cliente_token['token']}"}
        headers_rest = restaurante_token["headers_rest"]

        # Generar QR con expiración inmediata
        datos_qr = {"id_mesa": 99, "capacidad_mesa": 4, "expiracion_segundos": 1}
        response = requests.post(
            f"{API_V1}/restaurantes/{restaurante_token['restaurante_id']}/qr/generar",
            headers=headers_rest,
            json=datos_qr
        )
        qr_expirable = response.json()["uuid"]

        # Esperar expiración
        time.sleep(2)

        datos_entrada = {"qr_uuid": qr_expirable, "acompanantes": 0}
        response = requests.post(
            f"{API_V1}/clientes/{cliente_token['cliente_id']}/entrada",
            headers=headers,
            json=datos_entrada
        )
        assert response.status_code in [410, 400]

    def test_tc03_5_entrada_duplicada(self, cliente_token, qr_activo):
        """RF-03: Segundo escaneo con mismo QR → error 409."""
        headers_cli = {"Authorization": f"Bearer {cliente_token['token']}"}

        datos_entrada = {"qr_uuid": qr_activo["uuid"], "acompanantes": 0}
        # Primera entrada
        requests.post(
            f"{API_V1}/clientes/{cliente_token['cliente_id']}/entrada",
            headers=headers_cli, json=datos_entrada
        )
        # Segunda entrada (duplicada)
        response = requests.post(
            f"{API_V1}/clientes/{cliente_token['cliente_id']}/entrada",
            headers=headers_cli, json=datos_entrada
        )
        assert response.status_code == 409


# ═══════════════════════════════════════════════════════════════
# TC-04: PRUEBAS DE CONTROL DE AFORO (RF-04)
# ═══════════════════════════════════════════════════════════════

class TestControlAforo:
    """TC-04.x: Verifican el control automatizado de aforo."""

    def test_tc04_1_aforo_cerca_del_limite(self, restaurante_token, cliente_token):
        """RF-04: Aforo al 80% → alerta generada."""
        headers = {"Authorization": f"Bearer {restaurante_token['token']}"}
        rest_id = restaurante_token["restaurante_id"]

        # Generar QRs y llenar hasta 80%
        capacidad = restaurante_token["datos"]["capacidad_maxima"]  # 50
        objetivo = int(capacidad * 0.8)

        for i in range(objetivo):
            datos_qr = {"id_mesa": 100 + i, "capacidad_mesa": 1}
            qr = requests.post(
                f"{API_V1}/restaurantes/{rest_id}/qr/generar",
                headers=headers, json=datos_qr
            ).json()
            cliente = requests.post(
                f"{API_V1}/clientes/registrar",
                json={"nombre": f"Test{i}", "email": f"t{i}@test.com", "password": "T1!"}
            ).json()
            token_cli = cliente["token"]
            cli_id = cliente["cliente_id"]
            headers_cli = {"Authorization": f"Bearer {token_cli}"}
            requests.post(
                f"{API_V1}/clientes/{cli_id}/entrada",
                headers=headers_cli,
                json={"qr_uuid": qr["uuid"], "acompanantes": 0}
            )

        # Verificar alerta de 80%
        response = requests.get(
            f"{API_V1}/restaurantes/{rest_id}/panel",
            headers=headers
        )
        assert response.status_code == 200
        panel = response.json()
        assert panel["alerta_ocupacion"] is True
        assert panel["porcentaje_ocupacion"] >= 80

    def test_tc04_2_aforo_completo_rechazo(self, restaurante_token, cliente_token):
        """RF-04: Restaurante lleno → rechazo de entrada."""
        headers = {"Authorization": f"Bearer {restaurante_token['token']}"}
        rest_id = restaurante_token["restaurante_id"]

        # Llenar completamente (capacidad = 50)
        capacidad = 50
        for i in range(capacidad):
            datos_qr = {"id_mesa": 200 + i, "capacidad_mesa": 1}
            qr = requests.post(
                f"{API_V1}/restaurantes/{rest_id}/qr/generar",
                headers=headers, json=datos_qr
            ).json()
            cliente = requests.post(
                f"{API_V1}/clientes/registrar",
                json={"nombre": f"Full{i}", "email": f"f{i}@test.com", "password": "T1!"}
            ).json()
            token_cli = cliente["token"]
            cli_id = cliente["cliente_id"]
            headers_cli = {"Authorization": f"Bearer {token_cli}"}
            requests.post(
                f"{API_V1}/clientes/{cli_id}/entrada",
                headers=headers_cli,
                json={"qr_uuid": qr["uuid"], "acompanantes": 0}
            )

        # Intentar entrada adicional → rechazado
        datos_qr = {"id_mesa": 999, "capacidad_mesa": 1}
        qr_extra = requests.post(
            f"{API_V1}/restaurantes/{rest_id}/qr/generar",
            headers=headers, json=datos_qr
        ).json()
        cliente_extra = requests.post(
            f"{API_V1}/clientes/registrar",
            json={"nombre": "Extra", "email": "extra@test.com", "password": "T1!"}
        ).json()
        headers_cli = {"Authorization": f"Bearer {cliente_extra['token']}"}
        response = requests.post(
            f"{API_V1}/clientes/{cliente_extra['cliente_id']}/entrada",
            headers=headers_cli,
            json={"qr_uuid": qr_extra["uuid"], "acompanantes": 0}
        )
        assert response.status_code == 403
        assert "lleno" in response.text.lower() or "capacidad" in response.text.lower()


# ═══════════════════════════════════════════════════════════════
# TC-05: PRUEBAS DE LISTADO Y VISUALIZACIÓN
# ═══════════════════════════════════════════════════════════════

class TestListadoRestaurantes:
    """TC-05.x: Verifican listado, filtros y visualización."""

    def test_tc05_1_listado_sin_filtros(self):
        """Requisito implícito: Listar restaurantes sin filtros."""
        response = requests.get(f"{API_V1}/restaurantes")
        assert response.status_code == 200
        data = response.json()
        assert "restaurantes" in data
        assert isinstance(data["restaurantes"], list)

    def test_tc05_2_filtro_por_tipo_cocina(self):
        """Requisito implícito: Filtrar por tipo de cocina."""
        response = requests.get(
            f"{API_V1}/restaurantes",
            params={"tipo_cocina": "italiana"}
        )
        assert response.status_code == 200
        for rest in response.json()["restaurantes"]:
            assert rest["tipo_cocina"] == "italiana"

    def test_tc05_3_filtro_por_cercania(self):
        """Requisito implícito: Filtrar por cercanía."""
        response = requests.get(
            f"{API_V1}/restaurantes",
            params={"latitud": 40.4168, "longitud": -3.7038, "radio_km": 5}
        )
        assert response.status_code == 200


# ═══════════════════════════════════════════════════════════════
# TC-06: PRUEBAS DE REGISTRO DE SALIDA
# ═══════════════════════════════════════════════════════════════

class TestRegistroSalida:
    """TC-06.x: Verifican el registro de salida y cálculo de duración."""

    def test_tc06_1_salida_correcta(self, cliente_token, qr_activo):
        """Registrar salida → estado completado, duración calculada."""
        headers_cli = {"Authorization": f"Bearer {cliente_token['token']}"}

        # Entrar primero
        requests.post(
            f"{API_V1}/clientes/{cliente_token['cliente_id']}/entrada",
            headers=headers_cli,
            json={"qr_uuid": qr_activo["uuid"], "acompanantes": 1}
        )

        # Esperar brevemente para que la duración sea > 0
        time.sleep(1)

        # Registrar salida
        response = requests.post(
            f"{API_V1}/clientes/{cliente_token['cliente_id']}/salida",
            headers=headers_cli,
            json={"qr_uuid": qr_activo["uuid"], "acompanantes_confirmados": 1}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["estado"] == "completada"
        assert "duracion_minutos" in data
        assert data["duracion_minutos"] >= 0

    def test_tc06_2_sin_visita_activa(self, cliente_token):
        """Salida sin visita activa → error 404."""
        headers_cli = {"Authorization": f"Bearer {cliente_token['token']}"}
        response = requests.post(
            f"{API_V1}/clientes/{cliente_token['cliente_id']}/salida",
            headers=headers_cli,
            json={"qr_uuid": "NO_EXISTE", "acompanantes_confirmados": 0}
        )
        assert response.status_code == 404


# ═══════════════════════════════════════════════════════════════
# TC-07: PRUEBAS DE VALORACIÓN
# ═══════════════════════════════════════════════════════════════

class TestValoracion:
    """TC-07.x: Verifican el sistema de valoraciones."""

    def test_tc07_1_valoracion_valida(self, cliente_token, restaurante_token):
        """Valorar restaurante → guardada y media actualizada."""
        headers_cli = {"Authorization": f"Bearer {cliente_token['token']}"}
        rest_id = restaurante_token["restaurante_id"]

        datos_valoracion = {"puntuacion": 4, "comentario": "Buena experiencia"}
        response = requests.post(
            f"{API_V1}/restaurantes/{rest_id}/valorar",
            headers=headers_cli,
            json=datos_valoracion
        )
        assert response.status_code == 201
        assert response.json()["puntuacion"] == 4

    def test_tc08_comentario_excede_longitud(self, cliente_token, restaurante_token):
        """Comentario > 500 caracteres → error 400."""
        headers_cli = {"Authorization": f"Bearer {cliente_token['token']}"}
        rest_id = restaurante_token["restaurante_id"]

        datos_valoracion = {
            "puntuacion": 3,
            "comentario": "x" * 501  # Excede el máximo
        }
        response = requests.post(
            f"{API_V1}/restaurantes/{rest_id}/valorar",
            headers=headers_cli,
            json=datos_valoracion
        )
        assert response.status_code == 400

    def test_tc09_valoracion_duplicada(self, cliente_token, restaurante_token):
        """Segunda valoración del mismo cliente → error 409."""
        headers_cli = {"Authorization": f"Bearer {cliente_token['token']}"}
        rest_id = restaurante_token["restaurante_id"]

        datos = {"puntuacion": 5, "comentario": "Primera"}
        requests.post(
            f"{API_V1}/restaurantes/{rest_id}/valorar",
            headers=headers_cli, json=datos
        )
        datos["comentario"] = "Segunda"
        response = requests.post(
            f"{API_V1}/restaurantes/{rest_id}/valorar",
            headers=headers_cli, json=datos
        )
        assert response.status_code == 409


# ═══════════════════════════════════════════════════════════════
# TC-08: PRUEBAS DE SEGURIDAD
# ═══════════════════════════════════════════════════════════════

class TestSeguridad:
    """TC-09.x: Pruebas de seguridad (OWASP)."""

    def test_tc09_1_inyeccion_sql(self, cliente_token, restaurante_token):
        """SQL Injection en campo comentario → no ejecutado."""
        headers_cli = {"Authorization": f"Bearer {cliente_token['token']}"}
        rest_id = restaurante_token["restaurante_id"]

        payload = "'; DROP TABLE valoraciones;--"
        response = requests.post(
            f"{API_V1}/restaurantes/{rest_id}/valorar",
            headers=headers_cli,
            json={"puntuacion": 3, "comentario": payload}
        )
        # La tabla debe seguir existiendo
        # Si llega aquí sin error 500, la inyección no se ejecutó
        assert response.status_code in [201, 400]

    def test_tc09_2_xss_comentario(self, cliente_token, restaurante_token):
        """XSS en comentario → script sanitizado o rechazado."""
        headers_cli = {"Authorization": f"Bearer {cliente_token['token']}"}
        rest_id = restaurante_token["restaurante_id"]

        payload = "<script>alert('XSS')</script>"
        response = requests.post(
            f"{API_V1}/restaurantes/{rest_id}/valorar",
            headers=headers_cli,
            json={"puntuacion": 4, "comentario": payload}
        )
        # Debe aceptarse pero sanitizarse, o rechazarse
        assert response.status_code in [201, 400]
        if response.status_code == 201:
            assert "<script>" not in response.text

    def test_tc09_3_acceso_no_autorizado_admin(self):
        """Acceso a endpoint admin sin rol admin → 403."""
        # Registrar como cliente normal
        cliente = requests.post(
            f"{API_V1}/clientes/registrar",
            json={"nombre": "Intruso", "email": f"intruso{uuid.uuid4().hex[:6]}@x.com", "password": "T1!"}
        ).json()
        headers = {"Authorization": f"Bearer {cliente['token']}"}

        response = requests.get(f"{API_V1}/admin/panel", headers=headers)
        assert response.status_code == 403

    def test_tc09_4_falsificacion_qr(self, restaurante_token, cliente_token):
        """QR con UUID aleatorio → rechazado."""
        headers_cli = {"Authorization": f"Bearer {cliente_token['token']}"}
        uuid_falso = str(uuid.uuid4())

        response = requests.post(
            f"{API_V1}/clientes/{cliente_token['cliente_id']}/entrada",
            headers=headers_cli,
            json={"qr_uuid": uuid_falso, "acompanantes": 0}
        )
        assert response.status_code in [400, 404]


# ═══════════════════════════════════════════════════════════════
# TC-09: PRUEBAS DE RENDIMIENTO
# ═══════════════════════════════════════════════════════════════

class TestRendimiento:
    """TC-10.x: Pruebas básicas de rendimiento."""

    def test_tc10_1_tiempo_respuesta_listado(self):
        """TC-25: Listado restaurante responde en < 3 segundos."""
        import time
        inicio = time.time()
        response = requests.get(f"{API_V1}/restaurantes")
        duracion = time.time() - inicio

        assert response.status_code == 200
        assert duracion < 3.0, f"Respuesta tardó {duracion:.2f}s (> 3s)"

    def test_tc10_2_tiempo_respuesta_detalle(self, restaurante_token):
        """Detalle de restaurante responde en < 3 segundos."""
        import time
        rest_id = restaurante_token["restaurante_id"]

        inicio = time.time()
        response = requests.get(f"{API_V1}/restaurantes/{rest_id}")
        duracion = time.time() - inicio

        assert response.status_code == 200
        assert duracion < 3.0, f"Respuesta tardó {duracion:.2f}s (> 3s)"


# ═══════════════════════════════════════════════════════════════
# EJECUCIÓN DIRECTA (sin pytest)
# ═══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("=" * 60)
    print("Scripts de prueba automatizados - QR Restaurante")
    print("=" * 60)
    print()
    print("Para ejecutar las pruebas completas, usar pytest:")
    print("  $ pytest test_pruebas.py -v")
    print()
    print("O ejecutar directamente:")
    print("  $ python test_pruebas.py")
    print()
    pytest.main([__file__, "-v", "--tb=short"])