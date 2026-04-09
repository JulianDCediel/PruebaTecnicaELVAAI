import { useEffect, useState } from "react";
import {
    obtenerTareas,
    obtenerTareasAll,
    obtenerUsuarios,
    crearTarea,
    cambiarEstado,
    editarTarea,
    eliminarTarea,
} from "../api";

export default function Tareas({ token, role }) {
    const [tareas, setTareas] = useState([]);
    const [tareasTotal, setTareasTotal] = useState([]);
    const [allTareas, setAllTareas] = useState([]);
    const [allTareasTotal, setAllTareasTotal] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [editarTareaSeleccionada, setEditarTareaSeleccionada] = useState(null);
    const [editarTitulo, setEditarTitulo] = useState("");
    const [editarDescripcion, setEditarDescripcion] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [statusFilterAll, setStatusFilterAll] = useState("all");
    const [userFilter, setUserFilter] = useState("all");

    const [cargando, setCargando] = useState(true);
    const [cargandoAll, setCargandoAll] = useState(false);
    const [error, setError] = useState(null);
    const [errorAll, setErrorAll] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageAll, setCurrentPageAll] = useState(1);

    const cargarTareas = async (page = 1) => {
        setCargando(true);
        setError(null);
        const skip = (page - 1) * 5;
        try {
            const tareastotal = await obtenerTareas(token, 0, 100);
            setTareasTotal(tareastotal);
            const data = await obtenerTareas(token, skip, 5);
            setTareas(data);
            setCurrentPage(page);
        } catch {
            setError("Error cargando tareas");
        }

        setCargando(false);
    };

    const cargarTareasAll = async (page = 1) => {
        setCargandoAll(true);
        setErrorAll(null);
        const skip = (page - 1) * 5;
        try {
            const data = await obtenerTareasAll(token, skip, 5);
            const tareasalltotal = await obtenerTareasAll(token, 0, 100);
            setAllTareasTotal(tareasalltotal);
            setAllTareas(data);
            setCurrentPageAll(page);
        } catch {
            setErrorAll("Error cargando todas las tareas");
        }

        setCargandoAll(false);
    };

    const cargarUsuarios = async () => {
        try {
            const data = await obtenerUsuarios(token);
            setUsuarios(data);
        } catch {
            setUsuarios([]);
        }
    };

    useEffect(() => {
        cargarTareas(1);
        if (role === "admin") {
            cargarTareasAll(1);
            cargarUsuarios();
        }
    }, [token, role]);

    const handleCrear = async () => {
        if (!titulo.trim()) return;

        try {
            await crearTarea({ titulo, descripcion }, token);
            setTitulo("");
            setDescripcion("");
            cargarTareas(currentPage);
            if (role === "admin") cargarTareasAll(currentPageAll);
        } catch {
            alert("Error creando tarea");
        }
    };

    const handleCambiarEstado = async (id, estado) => {
        try {
            await cambiarEstado(id, estado, token);
            cargarTareas(currentPage);
            if (role === "admin") cargarTareasAll(currentPageAll);
        } catch {
            alert("Error actualizando estado");
        }
    };

    const handleEditar = (tarea) => {
        setEditarTareaSeleccionada(tarea);
        setEditarTitulo(tarea.titulo || "");
        setEditarDescripcion(tarea.descripcion || tarea.description || "");
    };

    const handleCerrarModal = () => {
        setEditarTareaSeleccionada(null);
        setEditarTitulo("");
        setEditarDescripcion("");
    };

    const handleGuardarEdicion = async () => {
        if (!editarTitulo.trim() || !editarTareaSeleccionada) return;

        const estadoActual =
            editarTareaSeleccionada.estado_tarea?.id ?? editarTareaSeleccionada.estado ?? 1;

        try {
            await editarTarea(
                editarTareaSeleccionada.id,
                {
                    titulo: editarTitulo.trim(),
                    descripcion: editarDescripcion.trim(),
                    estado: estadoActual,
                },
                token
            );
            handleCerrarModal();
            cargarTareas(currentPage);
            if (role === "admin") cargarTareasAll(currentPageAll);
        } catch {
            alert("Error editando tarea");
        }
    };

    const handleEliminar = async (id) => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta tarea?")) return;

        try {
            await eliminarTarea(id, token);
            if ((tareasTotal.length - 1) > 5) {
                cargarTareas(currentPage);
            } else {
                cargarTareas(1);
            }

            if (role === "admin" && (allTareasTotal.length - 1) > 5) {
                cargarTareasAll(currentPageAll);
            } else {
                cargarTareasAll(1);
            }
        } catch {
            alert("Error eliminando tarea");
        }
    };

    const statusOptions = [
        { id: "all", nombre: "Todos" },
        { id: 1, nombre: "Pendiente" },
        { id: 2, nombre: "En progreso" },
        { id: 3, nombre: "Completada" },
    ];

    const handleNextPage = () => {
        if (tareas.length === 5) {
            cargarTareas(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            cargarTareas(currentPage - 1);
        }
    };

    const handleNextPageAll = () => {
        if (allTareas.length === 5) {
            cargarTareasAll(currentPageAll + 1);
        }
    };

    const handlePrevPageAll = () => {
        if (currentPageAll > 1) {
            cargarTareasAll(currentPageAll - 1);
        }
    };

    const formatearFechaCreacion = (tarea) => {
        const fecha = tarea.fecha_creacion;
        if (!fecha) return null;
        const date = new Date(fecha);
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getUserName = (id) => {
        if (!id) return "Desconocido";
        const user = usuarios.find((u) => String(u.id) === String(id));
        return user?.username || user?.name || user?.email || `Usuario ${id}`;
    };

    const getTaskUserName = (t) => {
        const userId = t.usuario_id || t.user_id;
        return userId ? getUserName(userId) : "Desconocido";
    };

    const userOptions = [
        { value: "all", label: "Todos los usuarios" },
        ...usuarios.map((u) => ({
            value: String(u.id),
            label: u.username || u.name || u.email || String(u.id),
        })),
    ];

    const filteredTasks = tareas.filter((t) =>
        statusFilter === "all" ||
        String(t.estado_tarea?.id ?? t.estado) === String(statusFilter)
    );

    const filteredAllTasks = allTareas.filter((t) => {
        const statusMatch = statusFilterAll === "all" ||
            String(t.estado_tarea?.id ?? t.estado) === String(statusFilterAll);
        const userId = t.usuario_id || t.user_id;
        const userMatch = userFilter === "all" || String(userId) === String(userFilter);
        return statusMatch && userMatch;
    });

    if (cargando) return <div className="loading-panel">Cargando tareas...</div>;
    if (error) return <div className="error-panel">{error}</div>;

    return (
        <>
            <section className="page-panel">
                <div className="panel-card">
                    <div className="panel-header">
                        <div>
                            <p className="panel-label">Tareas</p>
                            <h2 className="panel-title">Gestión de tareas</h2>
                        </div>
                        <span className="status-pill">{tareas.length} tareas</span>
                    </div>

                    <div className="form-grid">
                        <input
                            className="panel-input"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Título de la tarea"
                        />
                        <textarea
                            className="panel-input"
                            rows={3}
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Descripción (opcional)"
                        />
                        <button className="button-primary" onClick={handleCrear}>
                            Crear tarea
                        </button>
                    </div>

                    <div className="form-grid">
                        <select
                            className="panel-input"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            {statusOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.nombre}
                                </option>
                            ))}
                        </select>
                        <div />
                    </div>

                    <div className="panel-list">
                        {filteredTasks.length === 0 ? (
                            <div className="panel-item">No hay tareas que coincidan con el filtro.</div>
                        ) : (
                            filteredTasks.map((t) => (
                                <div key={t.id} className="panel-item">
                                    <div className="panel-item-info">
                                        <p className="panel-item-title">{t.titulo}</p>
                                        {(t.descripcion || t.description) && (
                                            <p className="panel-item-description">{t.descripcion || t.description}</p>
                                        )}
                                        {formatearFechaCreacion(t) && (
                                            <p className="panel-item-meta">Creada: {formatearFechaCreacion(t)}</p>
                                        )}
                                        <p className="panel-item-meta">Estado: {t.estado_tarea?.nombre || "Sin estado"}</p>
                                    </div>
                                    <div className="panel-actions">
                                        <button
                                            className="button-secondary"
                                            onClick={() => handleCambiarEstado(t.id, 1)}
                                        >
                                            Pendiente
                                        </button>
                                        <button
                                            className="button-secondary"
                                            onClick={() => handleCambiarEstado(t.id, 2)}
                                        >
                                            En progreso
                                        </button>
                                        <button
                                            className="button-secondary"
                                            onClick={() => handleCambiarEstado(t.id, 3)}
                                        >
                                            Completar
                                        </button>
                                        <button
                                            className="button-secondary"
                                            onClick={() => handleEditar(t)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="button-danger"
                                            onClick={() => handleEliminar(t.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {(tareasTotal.length > 5) && (
                        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px', padding: '10px' }}>
                            <button
                                className="button-secondary"
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                style={{ padding: '8px 16px', borderRadius: '4px' }}
                            >
                                Anterior
                            </button>
                            <span style={{ fontSize: '14px', color: '#666' }}>Página {currentPage}</span>
                            <button
                                className="button-secondary"
                                onClick={handleNextPage}
                                disabled={tareas.length < 5}
                                style={{ padding: '8px 16px', borderRadius: '4px' }}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </div>
            </section>
            {role === "admin" && (
                <section className="page-panel">
                    <div className="panel-card">
                        <div className="panel-header">
                            <div>
                                <p className="panel-label">Todas las tareas</p>
                                <h2 className="panel-title">Tareas de todos los usuarios</h2>
                            </div>
                            <span className="status-pill">{allTareas.length} tareas</span>
                        </div>

                        {cargandoAll ? (
                            <div className="loading-panel">Cargando todas las tareas...</div>
                        ) : errorAll ? (
                            <div className="error-panel">{errorAll}</div>
                        ) : (
                            <>
                                <div className="form-grid">
                                    <select
                                        className="panel-input"
                                        value={statusFilterAll}
                                        onChange={(e) => setStatusFilterAll(e.target.value)}
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className="panel-input"
                                        value={userFilter}
                                        onChange={(e) => setUserFilter(e.target.value)}
                                    >
                                        {userOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="panel-list">
                                    {filteredAllTasks.length === 0 ? (
                                        <div className="panel-item">No hay tareas que coincidan con los filtros.</div>
                                    ) : (
                                        filteredAllTasks.map((t) => {
                                            const usuario = getTaskUserName(t);
                                            return (
                                                <div key={t.id} className="panel-item">
                                                    <div className="panel-item-info">
                                                        <p className="panel-item-title">{t.titulo}</p>
                                                        {(t.descripcion || t.description) && (
                                                            <p className="panel-item-description">{t.descripcion || t.description}</p>
                                                        )}
                                                        {formatearFechaCreacion(t) && (
                                                            <p className="panel-item-meta">
                                                                Creada: {formatearFechaCreacion(t)}
                                                            </p>
                                                        )}
                                                        <p className="panel-item-meta">
                                                            Usuario: {usuario} · Estado: {t.estado_tarea?.nombre || "Sin estado"}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {(allTareasTotal.length > 5) && (
                                    <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px', padding: '10px' }}>
                                        <button
                                            className="button-secondary"
                                            onClick={handlePrevPageAll}
                                            disabled={currentPageAll === 1}
                                            style={{ padding: '8px 16px', borderRadius: '4px' }}
                                        >
                                            Anterior
                                        </button>
                                        <span style={{ fontSize: '14px', color: '#666' }}>Página {currentPageAll}</span>
                                        <button
                                            className="button-secondary"
                                            onClick={handleNextPageAll}
                                            disabled={allTareas.length < 5}
                                            style={{ padding: '8px 16px', borderRadius: '4px' }}
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            )}
            {editarTareaSeleccionada && (
                <div className="modal-overlay" onClick={handleCerrarModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <p className="panel-label">Editar tarea</p>
                                <h2 className="panel-title">Actualiza título y descripción</h2>
                            </div>
                        </div>
                        <div className="form-grid">
                            <input
                                className="panel-input"
                                value={editarTitulo}
                                onChange={(e) => setEditarTitulo(e.target.value)}
                                placeholder="Título"
                            />
                            <textarea
                                className="panel-input"
                                rows={4}
                                value={editarDescripcion}
                                onChange={(e) => setEditarDescripcion(e.target.value)}
                                placeholder="Descripción"
                            />
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
        </>
    );
}