const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// LOGIN
export const login = async (datos) => {
    const res = await fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    });

    const body = await res.json().catch(() => null);
    if (!res.ok) {
        if (res.status === 401 || res.status === 400) {
            throw new Error(body?.detail || body?.message || "Credenciales incorrectas");
        }
        throw new Error(body?.detail || body?.message || "Error del servidor");
    }

    return body;
};

// TAREAS
export const obtenerTareas = async (token, skip = 0, limit = 5) => {
    const res = await fetch(`${API_URL}/tareas/?skip=${skip}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error();
    return res.json();
};

export const obtenerTareasAll = async (token, skip = 0, limit = 5) => {
    const res = await fetch(`${API_URL}/tareas/all?skip=${skip}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error();
    return res.json();
};

export const crearTarea = async (tarea, token) => {
    const res = await fetch(`${API_URL}/tareas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tarea),
    });

    if (!res.ok) throw new Error();
    return res.json();
};

export const cambiarEstado = async (id, estado, token) => {
    const res = await fetch(`${API_URL}/tareas/${id}/estado/${estado}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error();
    return res.json();
};

export const editarTarea = async (id, datos, token) => {
    const res = await fetch(`${API_URL}/tareas/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
    });

    if (!res.ok) throw new Error();
    return res.json();
};

export const eliminarTarea = async (id, token) => {
    await fetch(`${API_URL}/tareas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
};

// USUARIOS
export const obtenerUsuarios = async (token) => {
    const res = await fetch(`${API_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error();
    return res.json();
};

export const crearUsuario = async (usuario, token) => {
    const res = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuario),
    });

    if (!res.ok) throw new Error();
    return res.json();
};

export const editarUsuario = async (id, usuario, token) => {
    const res = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuario),
    });

    if (!res.ok) throw new Error();
    return res.json();
};

export const eliminarUsuario = async (id, token) => {
    await fetch(`${API_URL}/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const cambiarPasswordUsuario = async (id, nuevaPassword, token) => {
    const res = await fetch(`${API_URL}/usuarios/${id}/password`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nueva_password: nuevaPassword }),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail || body?.message || "Error cambiando contraseña");
    }
    return res.json();
};

export const obtenerEstados = async (token) => {
    const res = await fetch(`${API_URL}/usuarios/estados`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error();
    return res.json();
};

export const obtenerRoles = async (token) => {
    const res = await fetch(`${API_URL}/usuarios/roles`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error();
    return res.json();
};

export const obtenerPerfilUsuario = async (token) => {
    const res = await fetch(`${API_URL}/usuarios/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error();
    return res.json();
};