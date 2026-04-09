import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Tareas from "./pages/Tareas";
import Usuarios from "./pages/Usuarios";
import { obtenerPerfilUsuario } from "./api";

function App() {
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem("auth");
    return savedAuth ? JSON.parse(savedAuth) : null;
  });
  const [activeTab, setActiveTab] = useState("tareas");

  useEffect(() => {
    const loadProfile = async () => {
      if (auth?.access_token && !auth.id) {
        try {
          const profile = await obtenerPerfilUsuario(auth.access_token);
          const updatedAuth = { ...auth, ...profile };
          setAuth(updatedAuth);
          localStorage.setItem("auth", JSON.stringify(updatedAuth));
        } catch (error) {
          console.error("Error obteniendo perfil:", error);
        }
      }
    };

    loadProfile();
  }, [auth?.access_token]);

  useEffect(() => {
    if (!auth) return;
    setActiveTab(auth.rol === "admin" ? "tareas" : "tareas");
  }, [auth]);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
  };

  return (
    <div className="app-shell">
      {!auth ? (
        <Login setAuth={setAuth} />
      ) : (
        <>
          <header className="app-header">
            <div className="app-brand">
              <div className="brand-pill">PT</div>
              <div>
                <p className="app-brand-title">
                  {auth.rol === "admin" ? "Panel de Administración" : "Panel de Usuario"}
                </p>
                <p className="app-brand-subtitle">
                  {auth.rol === "admin" ? "Accede a la administración completa" : "Gestiona tus tareas"}
                </p>
              </div>
            </div>

            <div className="app-actions">
              {auth.rol === "admin" && (
                <nav className="app-nav">
                  <button
                    className={activeTab === "tareas" ? "nav-link active" : "nav-link"}
                    onClick={() => setActiveTab("tareas")}
                  >
                    Tareas
                  </button>
                  <button
                    className={activeTab === "usuarios" ? "nav-link active" : "nav-link"}
                    onClick={() => setActiveTab("usuarios")}
                  >
                    Usuarios
                  </button>
                </nav>
              )}

              <button className="logout-button" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          </header>

          <main className="app-main">
            {activeTab === "tareas" || auth.rol !== "admin" ? (
              <Tareas token={auth.access_token} role={auth.rol} />
            ) : (
              <Usuarios token={auth.access_token} currentUserId={auth.id} />
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default App;