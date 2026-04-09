# Task Manager — Prueba Técnica Fullstack · ElvaAI

Aplicación fullstack de gestión de tareas con autenticación JWT, control de roles y lógica de análisis de datos.

**Stack:** FastAPI · PostgreSQL · React (Vite) · JavaScript puro

---

## Tabla de contenidos

- [Requisitos previos](#requisitos-previos)
- [Instalación y ejecución](#instalación-y-ejecución)
  - [Base de datos](#1-base-de-datos)
  - [Backend](#2-backend)
  - [Frontend](#3-frontend)
- [Credenciales de prueba](#credenciales-de-prueba)
- [Endpoints de la API](#endpoints-de-la-api)
  - [Autenticación](#autenticación)
  - [Usuarios](#usuarios)
  - [Tareas](#tareas)
- [Módulo de lógica (Tarea 4)](#módulo-de-lógica-tarea-4)
- [Base de datos — diseño relacional](#base-de-datos--diseño-relacional)
- [Decisiones técnicas](#decisiones-técnicas)
- [Mejoras con más tiempo](#mejoras-con-más-tiempo)
- [Autor](#autor)

---

---

## Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| Python | 3.11+ |
| Node.js | 18+ |
| PostgreSQL | 14+ |

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/JulianDCediel/PruebaTecnicaELVAAI.git
cd PruebaTecnicaELVAAI
```

---

### 2. Base de datos

#### Crear la base de datos en PostgreSQL

Desde pgAdmin o psql:

```sql
abrir una terminal
ejecutar: psql -U postgres
ingresar contraseña
ejecutar: CREATE DATABASE pruebaTecnicaElVA;
```

#### Dejar que el backend la inicialice solo

El backend crea todas las tablas y siembra los datos iniciales automáticamente al arrancar por primera vez esto con la funcion inicializar_datos() en el archivo main.


Esto crea las 5 tablas con sus datos iniciales:
- `estados_tarea` → pendiente, en_progreso, completado
- `estados_usuario` → activo, inactivo
- `roles_usuario` → admin, usuario
- `usuarios`
- `tareas`

---

### 3. Backend

```bash
cd BackEnd

# Crear entorno virtual
python -m venv .venv

# Activar — Windows
.venv\Scripts\activate

# Activar — Linux / Mac
source .venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

#### variables de entorno

EL archivo .env no lo puse en el gitignore porque tiene datos locales , en esta parte remplazar: :admin por la contraseña respectiva del usuario postgres que se use localmente 

```env
DATABASE_URL=postgresql://postgres:admin@localhost:5432/pruebaTecnicaElVA
JWT_SECRET=Token_Prueba_Tecnica
JWT_ALGORITHM=HS512
JWT_EXPIRE_MINUTES=60
```

#### Ejecutar el servidor

```bash
uvicorn app.main:app --reload --port 8000
```

La API queda disponible en `http://localhost:8000`.
Documentación interactiva (Swagger UI) en `http://localhost:8000/docs`.

---

### 4. Frontend

```bash
cd FrontEnd
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

> Asegúrate de que el backend esté corriendo antes de abrir el frontend.

---

## Credenciales de prueba

```
Usuario: admin
Contraseña: admin123
```

Estas credenciales se crean automáticamente al iniciar el servidor por primera vez.

---



## Endpoints de la API

Documentación interactiva completa en `http://localhost:8000/docs`.

### Usuarios

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/usuarios/login` | ❌ | Obtener token JWT |
| POST | `/usuarios/` | ❌ | Registrar nuevo usuario |
| GET | `/usuarios/` | ✅ | Listar todos los usuarios |
| GET | `/usuarios/me` | ✅ | Perfil del usuario autenticado |
| GET | `/usuarios/{usuario_id}` | ✅ | Obtener usuario por ID |
| PUT | `/usuarios/{usuario_id}` | ✅ | Actualizar usuario |
| DELETE | `/usuarios/{usuario_id}` | ✅ | Eliminar usuario |
| PATCH | `/usuarios/{usuario_id}/password` | ✅ | Cambiar contraseña |
| GET | `/usuarios/roles` | ✅ | Listar roles disponibles |
| GET | `/usuarios/estados` | ✅ | Listar estados de usuario |

---

#### POST `/usuarios/login`

Devuelve el token JWT para usar en los endpoints protegidos.

**Body (JSON):**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Respuesta (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

> Usa el token en el header: `Authorization: Bearer <token>`

---

#### POST `/usuarios/`

Registra un nuevo usuario. No requiere autenticación.

**Body (JSON):**
```json
{
  "username": "julian",
  "email": "julian@elvaai.com",
  "password": "secreto123",
  "rol_id": 2
}
```

**Respuesta (201):**
```json
{
  "id": 3,
  "username": "julian",
  "email": "julian@elvaai.com",
  "estado": { "id": 1, "nombre": "activo" },
  "rol": { "id": 2, "nombre": "usuario" },
  "fecha_creacion": "2026-04-09T10:00:00-05:00"
}
```

---

#### GET `/usuarios/me`

Devuelve el perfil del usuario que tiene el token activo.

**Respuesta (200):**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@admin.com",
  "estado": { "id": 1, "nombre": "activo" },
  "rol": { "id": 1, "nombre": "admin" },
  "fecha_creacion": "2026-04-07T22:47:30-05:00"
}
```

---

#### PATCH `/usuarios/{usuario_id}/password`

Cambia la contraseña de un usuario.

**Body (JSON):**
```json
{
  "password_actual": "admin123",
  "password_nueva": "nueva_clave_segura"
}
```

**Respuesta (200):**
```json
{ "mensaje": "Contraseña actualizada correctamente" }
```

---

#### GET `/usuarios/roles`

Devuelve los roles disponibles en el sistema.

**Respuesta (200):**
```json
[
  { "id": 1, "nombre": "admin" },
  { "id": 2, "nombre": "usuario" }
]
```

---

#### GET `/usuarios/estados`

Devuelve los estados de usuario disponibles.

**Respuesta (200):**
```json
[
  { "id": 1, "nombre": "activo" },
  { "id": 2, "nombre": "inactivo" }
]
```

---

### Tareas

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/tareas/` | ✅ | Crear nueva tarea |
| GET | `/tareas/` | ✅ | Listar tareas del usuario autenticado |
| GET | `/tareas/all` | ✅ | Listar todas las tareas del sistema |
| GET | `/tareas/{tarea_id}` | ✅ | Obtener tarea por ID |
| PUT | `/tareas/{tarea_id}` | ✅ | Actualizar título y descripción |
| DELETE | `/tareas/{tarea_id}` | ✅ | Eliminar tarea |
| PATCH | `/tareas/{tarea_id}/estado/{estado_id}` | ✅ | Cambiar estado de la tarea |

---

#### POST `/tareas/`

**Body (JSON):**
```json
{
  "titulo": "Revisar pull request",
  "descripcion": "Revisar los cambios del branch feature/login",
  "estado_id": 1
}
```

**Respuesta (201):**
```json
{
  "id": 9,
  "titulo": "Revisar pull request",
  "descripcion": "Revisar los cambios del branch feature/login",
  "estado": { "id": 1, "nombre": "pendiente" },
  "usuario_id": 1,
  "fecha_creacion": "2026-04-09T10:00:00-05:00"
}
```

---

#### GET `/tareas/`

Devuelve solo las tareas del usuario autenticado. Acepta filtro opcional por estado:

```
GET /tareas/                         → todas las tareas propias
GET /tareas/?estado_id=1             → solo pendientes
GET /tareas/?estado_id=2             → solo en progreso
GET /tareas/?estado_id=3             → solo completadas
GET /tareas/?skip=0&limit=10         → paginación
```

**Respuesta (200):**
```json
[
  {
    "id": 6,
    "titulo": "practica",
    "descripcion": "practica de laboratorio",
    "estado": { "id": 1, "nombre": "pendiente" },
    "usuario_id": 1,
    "fecha_creacion": "2026-04-08T13:14:34-05:00"
  }
]
```

---

#### PATCH `/tareas/{tarea_id}/estado/{estado_id}`

Cambia el estado de una tarea sin modificar el resto de los campos.

| `estado_id` | Estado |
|---|---|
| 1 | pendiente |
| 2 | en_progreso |
| 3 | completado |

Ejemplo — marcar tarea 6 como completada:
```
PATCH /tareas/6/estado/3
```

**Respuesta (200):**
```json
{
  "id": 6,
  "titulo": "practica",
  "estado": { "id": 3, "nombre": "completado" },
  "usuario_id": 1,
  "fecha_creacion": "2026-04-08T13:14:34-05:00"
}
```

---

#### PUT `/tareas/{tarea_id}`

Actualiza título y descripción de una tarea.

**Body (JSON):**
```json
{
  "titulo": "practica actualizada",
  "descripcion": "nueva descripción"
}
```

---

#### DELETE `/tareas/{tarea_id}`

Elimina una tarea. **Respuesta (204):** sin cuerpo.

---

## Módulo de lógica (Tarea 4)

Ubicación: `logic/ProblemaLogica.js`

Función `resumirTareas(tareas)` que recibe un array de tareas y devuelve:

```js
{
  conteoPorEstado: { pendiente: 2, en_progreso: 1, completado: 1 },
  tareaMasReciente: { id: 4, titulo: "...", ... },
  titulosOrdenados: ["Arreglar bicicleta", "Comprar leche", ...]
}
```

El ordenamiento alfabético se implementó con **el metodo de ordenamiento por seleccion**.

Para ejecutar los tests:

```bash
node logic/taskSummary.js
```

Incluye 3 casos de prueba:
1. Array con tareas mixtas — verifica conteo, tarea más reciente y orden alfabético
2. Array vacío — verifica valores por defecto
3. Una sola tarea — verifica que `mostRecent` no es null


---

## Base de datos — diseño relacional

Los catálogos (`estados_tarea`, `estados_usuario`, `roles_usuario`) están normalizados como tablas independientes. Esto permite agregar nuevos estados o roles en el futuro con un simple `INSERT`, sin modificar código Python ni hacer migraciones de columna.

---

## Decisiones técnicas

### ¿Por qué FastAPI?

Elegi fast Api porque anteriormente realice una prueba tecnica parecida que esta en mi github:https://github.com/JulianDCediel/PruebaTecnica al ya tener este lo tome como base, y en este momento estoy usando fast Api para un proyecto de la univirsidad y en comparacion con Django o flask, me parece que sirve mas ya que digamos que tiende el Swagger UI en /docs para ver los endpoints, tiene el Pydantic para las validaciones y pues es mas sencillo pero sirve muy bien.

### ¿Por qué PostgreSQL?

Elegi PostgreSQL casi por el mismo motivo que fas Api, es la base que use para la prueba tecnica que era parecida ademas de que es la base de datos que mas he utilizado en general, y personalmente me parece mejor usar Pgadmin que para MySql el workbench. 


### ¿Por qué bcrypt para hashing de contraseñas?

Elegio bcrypt para cambiar con la prueba tecnica que ya tenia en github ya que en esa utilice argon2, y queria probar este ademas de que es el que estoy usando para mi proyecto de la universidad 


### ¿Por qué separar en capas (routes / services / models)?

Cada capa tiene una única responsabilidad: las rutas solo validan la request y devuelven la response; los services contienen la lógica de negocio; los models definen la estructura de datos. Esto facilita el testing unitario y el mantenimiento, esto lo realizo asi porque es las estructura la cual en un curso de udemy me explicaron y separa muy bien los archivos.

### ¿Por qué normalizar los estados y roles en tablas separadas?

En lugar de usar un `ENUM` de PostgreSQL o un `Boolean`, los estados y roles son filas en tablas de catálogo. Esto permite agregar un estado nuevo (`archivado`, `en_revision`) o un rol nuevo (`moderador`) con un `INSERT`, sin alterar el esquema ni hacer migraciones, esto porque aprendi en la universidad que siempre hay que tener las bases de datos normalizadas.

### ¿Por qué ordenaminto por seleccion para los títulos?

La prueba pedía demostrar comprensión de algoritmos de ordenamiento.En la universidad aprendi varios metodos de ordenamintos, pero el que mas uso y mas me gusta es el de seleccion.

### Decisiones del Back
Para los endpoints de los usuarios decici que los asdministradores fueran los que gestionan las usuarios, que un usuario normal no pueda crear ni modificar los datos, ademas de que un usuario administrador no puede cambiar su propio estado ni rol.
---

## Mejoras con más tiempo

- **Tests automatizados** con pytest + httpx para el backend y Vitest para el frontend
- **Migraciones con Alembic** para gestionar cambios de esquema de forma versionada, esto en la prueba tecnica que ya habia realizado de la cual me guie lo utilice pero, como con otras partes en esta decidi realizarlo cambiando algunas cosas respecto a este para probar.
- **Dashboard con gráficas** del estado de tareas por usuario
- **Deploy en la nube** — backend en Railway, frontend en Vercel

---

## Autor

**Julian Cediel**
GitHub: [@JulianDCediel](https://github.com/JulianDCediel)
