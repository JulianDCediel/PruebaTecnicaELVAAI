import { useEffect, useState } from "react";
import {
    obtenerUsuarios,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
    cambiarPasswordUsuario,
    obtenerEstados,
    obtenerRoles,
} from "../api";

export default function Usuarios({ token, currentUserId }) {
    const [usuarios, setUsuarios] = useState([]);
    const [estados, setEstados] = useState([]);
    const [roles, setRoles] = useState([]);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [editarUsuarioSeleccionado, setEditarUsuarioSeleccionado] = useState(null);
    const [editarUsername, setEditarUsername] = useState("");
    const [editarEmail, setEditarEmail] = useState("");
    const [editarEstadoId, setEditarEstadoId] = useState("");
    const [editarRolId, setEditarRolId] = useState("");
    const [cambiarPasswordUsuarioSeleccionado, setCambiarPasswordUsuarioSeleccionado] = useState(null);
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const cargarUsuarios = async () => {
        setCargando(true);
        setError(null);

        try {
            const data = await obtenerUsuarios(token);
            setUsuarios(data);
        } catch {
            setError("Error cargando usuarios");
        }

        setCargando(false);
    };

    const cargarEstados = async () => {
        try {
            const data = await obtenerEstados(token);
            setEstados(data);
        } catch {
            setEstados([]);
        }
    };

    const cargarRoles = async () => {
        try {
            const data = await obtenerRoles(token);
            setRoles(data);
        } catch {
            setRoles([]);
        }
    };

    useEffect(() => {
        cargarUsuarios();
        cargarEstados();
        cargarRoles();
    }, [token]);

    const handleCrear = async () => {
        if (!username.trim() || !email.trim() || !password.trim()) return;

        try {
            await crearUsuario({ username, email, password }, token);
            setUsername("");
            setEmail("");
            setPassword("");
            cargarUsuarios();
        } catch {
            alert("Error creando usuario");
        }
    };

    const handleEditar = (usuario) => {
        console.log("Editando usuario:", usuario);
        setEditarUsuarioSeleccionado(usuario);
        setEditarUsername(usuario.username || "");
        setEditarEmail(usuario.email || "");
        setEditarEstadoId(usuario.estado_id || "");
        setEditarRolId(usuario.rol_id || "");
    };

    const handleCerrarModal = () => {
        setEditarUsuarioSeleccionado(null);
        setEditarUsername("");
        setEditarEmail("");
        setEditarEstadoId("");
        setEditarRolId("");
    };

    const handleGuardarEdicion = async () => {
        if (!editarUsername.trim() || !editarEmail.trim() || !editarUsuarioSeleccionado) return;

        try {
            await editarUsuario(
                editarUsuarioSeleccionado.id,
                {
                    username: editarUsername.trim(),
                    email: editarEmail.trim(),
                    estado_id: parseInt(editarEstadoId),
                    rol_id: parseInt(editarRolId),
                },
                token
            );
            handleCerrarModal();
            cargarUsuarios();
        } catch {
            alert("Error editando usuario");
        }
    };

    const handleEliminar = async (id) => {
        if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

        try {
            await eliminarUsuario(id, token);
            cargarUsuarios();
        } catch {
            alert("Error eliminando usuario");
        }
    };

    const handleCambiarPassword = (usuario) => {
        setCambiarPasswordUsuarioSeleccionado(usuario);
        setNuevaPassword("");
        setPasswordMessage("");
    };

    const handleGuardarPassword = async () => {
        if (!cambiarPasswordUsuarioSeleccionado || !nuevaPassword.trim()) return;

        try {
            await cambiarPasswordUsuario(cambiarPasswordUsuarioSeleccionado.id, nuevaPassword.trim(), token);
            setPasswordMessage("Contraseña cambiada correctamente.");
            setNuevaPassword("");
            cargarUsuarios();
        } catch (error) {
            setPasswordMessage(error?.message || "Error cambiando contraseña");
        }
    };

    const handleCerrarPasswordModal = () => {
        setCambiarPasswordUsuarioSeleccionado(null);
        setNuevaPassword("");
        setPasswordMessage("");
    };

    if (cargando) return <div className="loading-panel">Cargando usuarios...</div>;
    if (error) return <div className="error-panel">{error}</div>;

    return (
        <>
            <section className="page-panel">
                <div className="panel-card">
                    <div className="panel-header">
                        <div>
                            <p className="panel-label">Usuarios</p>
                            <h2 className="panel-title">Gestión de usuarios</h2>
                        </div>
                        <span className="status-pill">{usuarios.length} usuarios</span>
                    </div>

                    <div className="form-grid">
                        <input
                            className="panel-input"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            className="panel-input"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="panel-input"
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="button-primary" onClick={handleCrear}>
                            Crear usuario
                        </button>
                    </div>

                    <div className="panel-list">
                        {usuarios.map((u) => (
                            <div key={u.id} className="panel-item">
                                <div className="panel-item-info">
                                    <p className="panel-item-title">{u.username}</p>
                                    <p className="panel-item-meta">{u.email}</p>
                                </div>
                                <div className="panel-actions">
                                    <button
                                        className="button-secondary"
                                        onClick={() => handleEditar(u)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="button-secondary"
                                        onClick={() => handleCambiarPassword(u)}
                                    >
                                        Cambiar contraseña
                                    </button>
                                    <button
                                        className="button-danger"
                                        onClick={() => handleEliminar(u.id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {editarUsuarioSeleccionado && (
                <div className="modal-overlay" onClick={handleCerrarModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <p className="panel-label">Editar usuario</p>
                                <h2 className="panel-title">Actualiza username y email</h2>
                            </div>
                        </div>
                        <div className="form-grid">
                            <input
                                className="panel-input"
                                value={editarUsername}
                                onChange={(e) => setEditarUsername(e.target.value)}
                                placeholder="Username"
                            />
                            <input
                                className="panel-input"
                                value={editarEmail}
                                onChange={(e) => setEditarEmail(e.target.value)}
                                placeholder="Email"
                            />
                            <select
                                className="panel-input"
                                value={editarEstadoId}
                                onChange={(e) => setEditarEstadoId(e.target.value)}
                                disabled={editarUsuarioSeleccionado?.id === currentUserId}
                            >
                                <option value="">Seleccionar estado</option>
                                {estados.map((estado) => (
                                    <option key={estado.id} value={estado.id}>
                                        {estado.nombre}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="panel-input"
                                value={editarRolId}
                                onChange={(e) => setEditarRolId(e.target.value)}
                                disabled={editarUsuarioSeleccionado?.id === currentUserId}
                            >
                                <option value="">Seleccionar rol</option>
                                {roles.map((rol) => (
                                    <option key={rol.id} value={rol.id}>
                                        {rol.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button className="button-secondary" onClick={handleCerrarModal}>
                                Cancelar
                            </button>
                            <button className="button-primary" onClick={handleGuardarEdicion}>
                                Guardar cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {cambiarPasswordUsuarioSeleccionado && (
                <div className="modal-overlay" onClick={handleCerrarPasswordModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <p className="panel-label">Cambiar contraseña</p>
                                <h2 className="panel-title">Nueva contraseña para {cambiarPasswordUsuarioSeleccionado.username}</h2>
                            </div>
                        </div>
                        <div className="form-grid">
                            <input
                                className="panel-input"
                                type="password"
                                placeholder="Nueva contraseña"
                                value={nuevaPassword}
                                onChange={(e) => setNuevaPassword(e.target.value)}
                            />
                        </div>
                        {passwordMessage && (
                            <div className="panel-message">{passwordMessage}</div>
                        )}
                        <div className="modal-actions">
                            <button className="button-secondary" onClick={handleCerrarPasswordModal}>
                                Cancelar
                            </button>
                            <button className="button-primary" onClick={handleGuardarPassword}>
                                Guardar contraseña
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}