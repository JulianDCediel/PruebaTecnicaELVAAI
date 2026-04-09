import { useState } from "react";
import { login } from "../api";

export default function Login({ setAuth }) {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        setCargando(true);
        setError(null);

        try {
            const data = await login({
                username: usuario,
                password: password,
            });

            if (data?.access_token) {
                localStorage.setItem("auth", JSON.stringify(data));
                setAuth(data);
            } else {
                setError("Credenciales incorrectas");
            }
        } catch (error) {
            setError(error?.message || "Error del servidor");
        }

        setCargando(false);
    };

    return (
        <div className="login-page">
            <section className="panel-card">
                <div className="panel-header">
                    <div>
                        <p className="panel-label">Iniciar sesión</p>
                        <h2 className="panel-title">Bienvenido</h2>
                    </div>
                </div>

                <div className="form-grid">
                    <input
                        className="panel-input"
                        id="usuario"
                        placeholder="Ingresa tu usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                    <input
                        className="panel-input"
                        id="password"
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="button-primary" onClick={handleLogin} disabled={cargando}>
                        {cargando ? "Cargando..." : "Entrar"}
                    </button>
                </div>

                <p className="login-help">Gestor de tareas -  Prueba Tecnica ElvaAI</p>
                {error && <div className="error-panel">{error}</div>}
            </section>
        </div>
    );
}