-- ==========================================
-- 1. CREACIÓN DE TABLAS DE CATÁLOGO
-- ==========================================

CREATE TABLE estados_tarea (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE estados_usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE roles_usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- ==========================================
-- 2. CREACIÓN DE TABLAS PRINCIPALES
-- ==========================================

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    estado_id INTEGER NOT NULL REFERENCES estados_usuario(id),
    rol_id INTEGER NOT NULL REFERENCES roles_usuario(id),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE tareas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(500),
    estado_id INTEGER NOT NULL REFERENCES estados_tarea(id),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id)
);

-- ==========================================
-- 3. INSERCIÓN DE DATOS INICIALES
-- ==========================================

-- Insertar Estados de Tarea
INSERT INTO estados_tarea (id, nombre) VALUES
    (1, 'pendiente'),
    (2, 'en_progreso'),
    (3, 'completado');

-- Insertar Estados de Usuario
INSERT INTO estados_usuario (id, nombre) VALUES
    (1, 'activo'),
    (2, 'inactivo');

-- Insertar Roles
INSERT INTO roles_usuario (id, nombre) VALUES
    (1, 'admin'),
    (2, 'usuario');

-- Sincronizar secuencias de IDs (Buena práctica en PostgreSQL al forzar IDs)
SELECT setval('estados_tarea_id_seq', (SELECT MAX(id) FROM estados_tarea));
SELECT setval('estados_usuario_id_seq', (SELECT MAX(id) FROM estados_usuario));
SELECT setval('roles_usuario_id_seq', (SELECT MAX(id) FROM roles_usuario));

-- ==========================================
-- 4. USUARIO ADMINISTRADOR POR DEFECTO
-- ==========================================

INSERT INTO usuarios (id, username, email, password, estado_id, rol_id)
VALUES (1, 'admin', 'admin@admin.com', 'admin123', 1, 1);

SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios));