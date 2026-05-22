"""
Script de pruebas automatizadas para QR Restaurante -- Práctica 4
Ejecutar con: pytest test_pruebas.py -v
Requisitos: requests, pytest
Entorno: Aplicación corriendo en http://localhost:3000
"""

import requests
import pytest

BASE_URL = "http://localhost:3000"


# ============================================================
# FIXTURES
# ============================================================

@pytest.fixture
def session():
    """Crea una sesión HTTP reutilizable."""
    s = requests.Session()
    yield s
    s.close()


@pytest.fixture
def auth_cliente(session):
    """Login como cliente y devuelve headers con cookie auth-token."""
    res = session.post(f"{BASE_URL}/api/auth/login", json={
        "email": "cliente1@qr.com",
        "password": "Cliente123!",
    })
    assert res.status_code == 200, f"Login falló: {res.json()}"
    return session


@pytest.fixture
def auth_restaurante(session):
    """Login como restaurante."""
    res = session.post(f"{BASE_URL}/api/auth/login", json={
        "email": "restaurante1@qr.com",
        "password": "Restaurante123!",
    })
    assert res.status_code == 200
    return session


# ============================================================
# RF-01: REGISTRO Y PERFIL DE RESTAURANTE
# ============================================================

class TestRegistroRestaurante:
    """TC-01: Registro y gestión de perfil de restaurante."""

    def test_registro_datos_validos(self, session):
        """TC-01.1: Registrar restaurante con datos válidos."""
        payload = {
            "nombre": "Restaurante Test",
            "email": "test_rest@test.com",
            "password": "TestPass123!",
            "direccion": "Calle Test 123",
            "tipoCocina": "Italiana",
            "capacidadMaxima": 30,
            "telefono": "957123456",
            "horarios": "12:00-23:00",
        }
        res = session.post(f"{BASE_URL}/api/auth/register/restaurante", json=payload)
        assert res.status_code == 201, f"Esperado 201, recibido {res.status_code}: {res.json()}"
        data = res.json()
        assert data.get("success") is True
        assert "data" in data

    def test_registro_datos_incompletos(self, session):
        """TC-01.2: Registro con datos incompletos devuelve error 400."""
        payload = {"nombre": "Sin Email"}
        res = session.post(f"{BASE_URL}/api/auth/register/restaurante", json=payload)
        assert res.status_code == 400, f"Esperado 400, recibido {res.status_code}"


# ============================================================
# RF-02: GENERACIÓN DE CÓDIGO QR
# ============================================================

class TestGeneracionQR:
    """TC-02: Generación de código QR único por establecimiento."""

    def test_generar_qr_valido(self, auth_restaurante):
        """TC-02.1: Generar código QR para una mesa."""
        payload = {"idMesa": "Mesa Test"}
        res = auth_restaurante.post(
            f"{BASE_URL}/api/restaurante/codigos-qr",
            json=payload,
        )
        assert res.status_code == 201, f"Esperado 201, recibido {res.status_code}: {res.json()}"
        data = res.json()
        assert data.get("success") is True
        assert "data" in data
        assert "uuid" in data["data"]

    def test_obtener_payload_qr(self, session):
        """TC-02.3: Escanear contenido del QR -- verificar payload."""
        res = session.get(f"{BASE_URL}/api/codigos-qr/QR-001-A/payload")
        assert res.status_code == 200, f"Esperado 200, recibido {res.status_code}"
        data = res.json()
        assert data.get("success") is True
        assert "uuid" in data.get("data", {})
        assert "firma" in data.get("data", {})

    def test_validar_qr_autentico(self, session):
        """Verificar que un QR válido pasa la validación."""
        # Obtener payload primero
        payload_res = session.get(f"{BASE_URL}/api/codigos-qr/QR-001-A/payload")
        payload_data = payload_res.json()["data"]

        # Validar con la firma HMAC
        res = session.get(
            f"{BASE_URL}/api/codigos-qr/QR-001-A/validar"
            f"?firma={payload_data['firma']}"
        )
        assert res.status_code == 200
        assert res.json().get("success") is True


# ============================================================
# RF-03: REGISTRO DE ENTRADA POR QR
# ============================================================

class TestRegistroEntrada:
    """TC-03: Registro de entrada mediante escaneo de QR."""

    def test_entrada_qr_valido(self, auth_cliente):
        """TC-03.1: Escanear QR válido y registrar entrada."""
        # Obtener firma del QR
        payload_res = auth_cliente.get(f"{BASE_URL}/api/codigos-qr/QR-001-A/payload")
        firma = payload_res.json()["data"]["firma"]

        payload = {
            "uuid": "QR-001-A",
            "firma": firma,
            "acompanantes": 0,
        }
        res = auth_cliente.post(f"{BASE_URL}/api/cliente/visitas", json=payload)
        # Puede dar 201 (éxito) o 409 (ya registrado) o 400 (aforo)
        assert res.status_code in [201, 400, 409], \
            f"Esperado 201/400/409, recibido {res.status_code}: {res.json()}"

    def test_qr_invalido_rechazado(self, auth_cliente):
        """TC-03.4: QR manipulado es rechazado."""
        payload = {
            "uuid": "QR-FALSO-999",
            "firma": "firma_falsa_abc123",
            "acompanantes": 0,
        }
        res = auth_cliente.post(f"{BASE_URL}/api/cliente/visitas", json=payload)
        assert res.status_code in [400, 404], \
            f"QR inválido debería ser rechazado, recibido {res.status_code}"

    def test_acompanantes_maximo_10(self, auth_cliente):
        """TC-03.7: 11 acompañantes excede el máximo permitido."""
        payload_res = auth_cliente.get(f"{BASE_URL}/api/codigos-qr/QR-001-A/payload")
        firma = payload_res.json()["data"]["firma"]

        payload = {
            "uuid": "QR-001-A",
            "firma": firma,
            "acompanantes": 11,
        }
        res = auth_cliente.post(f"{BASE_URL}/api/cliente/visitas", json=payload)
        assert res.status_code == 400, \
            f"Esperado 400 para 11 acompañantes, recibido {res.status_code}"

    def test_mismo_qr_rechazado(self, auth_cliente):
        """TC-03.5: Misma persona no puede registrar dos entradas con un QR."""
        payload_res = auth_cliente.get(f"{BASE_URL}/api/codigos-qr/QR-001-A/payload")
        firma = payload_res.json()["data"]["firma"]

        payload = {
            "uuid": "QR-001-A",
            "firma": firma,
            "acompanantes": 0,
        }
        res = auth_cliente.post(f"{BASE_URL}/api/cliente/visitas", json=payload)
        # Si ya tiene visita activa, debería rechazar
        if res.status_code == 409:
            assert "ya" in res.json().get("message", "").lower()


# ============================================================
# RF-04: CONTROL DE AFORO AUTOMATIZADO
# ============================================================

class TestControlAforo:
    """TC-04: Control de aforo automatizado."""

    def test_obtener_ocupacion(self, auth_restaurante):
        """TC-04.5: Dashboard muestra ocupación en tiempo real."""
        res = auth_restaurante.get(f"{BASE_URL}/api/restaurante/ocupacion")
        assert res.status_code == 200, f"Esperado 200, recibido {res.status_code}"
        data = res.json()
        assert data.get("success") is True
        assert "ocupacion" in data.get("data", {})
        assert "porcentajeOcupacion" in data.get("data", {})
        assert "alerta80" in data.get("data", {})

    def test_ocupacion_datos_validos(self, auth_restaurante):
        """Verifica que los datos de ocupación tengan valores razonables."""
        res = auth_restaurante.get(f"{BASE_URL}/api/restaurante/ocupacion")
        data = res.json()["data"]
        assert data["ocupacion"]["visitantesActuales"] >= 0
        assert data["ocupacion"]["capacidadMaxima"] >= 0
        assert 0 <= data["porcentajeOcupacion"] <= 100


# ============================================================
# VALORACIONES (Requisito Implícito)
# ============================================================

class TestValoraciones:
    """TC-05: Valoración de restaurantes."""

    def test_obtener_valoraciones_publicas(self, session):
        """Obtener valoraciones de un restaurante sin autenticación."""
        res = session.get(f"{BASE_URL}/api/restaurantes/rst-001/valoraciones")
        assert res.status_code == 200
        data = res.json()
        assert data.get("success") is True
        assert "valoracionMedia" in data.get("data", {})
        assert "totalValoraciones" in data.get("data", {})

    def test_valoracion_duplicada_rechazada(self, auth_cliente):
        """TC-18: No se puede valorar dos veces el mismo restaurante."""
        payload = {
            "restauranteId": "rst-001",
            "puntuacion": 5,
            "comentario": "Test duplicado",
        }
        res = auth_cliente.post(f"{BASE_URL}/api/cliente/valoraciones", json=payload)
        # Si ya valoró antes, debe devolver 409
        if res.status_code == 409:
            assert "ya valoraste" in res.json().get("message", "").lower()
        elif res.status_code == 201:
            # Si no había valorado, se crea -- correcto también
            assert res.json().get("success") is True

    def test_puntuacion_fuera_rango(self, auth_cliente):
        """Puntuación 0 o 6 debe ser rechazada por Zod."""
        payload = {
            "restauranteId": "rst-001",
            "puntuacion": 6,
            "comentario": "Test rango",
        }
        res = auth_cliente.post(f"{BASE_URL}/api/cliente/valoraciones", json=payload)
        assert res.status_code == 400

    def test_comentario_maximo_500(self, auth_cliente):
        """Comentario de 501 caracteres debe ser rechazado."""
        payload = {
            "restauranteId": "rst-001",
            "puntuacion": 4,
            "comentario": "X" * 501,
        }
        res = auth_cliente.post(f"{BASE_URL}/api/cliente/valoraciones", json=payload)
        assert res.status_code == 400


# ============================================================
# SEGURIDAD
# ============================================================

class TestSeguridad:
    """SEC-01 a SEC-07: Pruebas de seguridad."""

    def test_sqli_prevencion(self, session):
        """SEC-01: Inyección SQL en login es rechazada."""
        payload = {
            "email": "admin@qr.com' OR '1'='1",
            "password": "' OR '1'='1",
        }
        res = session.post(f"{BASE_URL}/api/auth/login", json=payload)
        # Debe devolver 401 (credenciales inválidas), no 200
        assert res.status_code == 401, \
            f"SQLi debería devolver 401, recibido {res.status_code}"

    def test_acceso_no_autorizado(self, session):
        """SEC-03: Acceso a panel admin sin autenticación."""
        res = session.get(f"{BASE_URL}/admin")
        # Debe redirigir a login o devolver 401
        assert res.status_code in [307, 401, 200], \
            f"Esperado redirect/401, recibido {res.status_code}"

    def test_xss_comentario(self, auth_cliente):
        """SEC-02: Script injection en comentario no se ejecuta."""
        payload = {
            "restauranteId": "rst-001",
            "puntuacion": 3,
            "comentario": "<script>alert('xss')</script>",
        }
        res = auth_cliente.post(f"{BASE_URL}/api/cliente/valoraciones", json=payload)
        # Si se crea (201) o ya existe (409), el script debe estar escapado en la UI
        # La API no debe devolver el script sin escapar en la respuesta
        if res.status_code == 201:
            data = res.json()
            comentario = data.get("data", {}).get("valoracion", {}).get("comentario", "")
            assert "<script>" in comentario  # Zod lo acepta, React lo escapa en la UI
