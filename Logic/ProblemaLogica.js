function resumirTareas(tareas) {
    if (!tareas || tareas.length === 0) {
        return {
            conteoPorEstado: {},
            tareaMasReciente: null,
            titulosOrdenados: []
        };
    }

    const resumen = {
        conteoPorEstado: {},
        tareaMasReciente: tareas[0],
        titulosOrdenados: []
    };

    tareas.forEach(tarea => {
        //Conteo por estado
        const estadoActual = tarea.estado;
        resumen.conteoPorEstado[estadoActual] = (resumen.conteoPorEstado[estadoActual] || 0) + 1;

        //tarea más reciente
        const fechaTareaActual = new Date(tarea.fecha_creacion);
        const fechaMasReciente = new Date(resumen.tareaMasReciente.fecha_creacion);

        if (fechaTareaActual > fechaMasReciente) {
            resumen.tareaMasReciente = tarea;
        }

        //títulos para el ordenamiento
        resumen.titulosOrdenados.push(tarea.titulo);
    });

    // 4. Ordenar títulos alfabéticamente
    const n = resumen.titulosOrdenados.length;
    for (let i = 0; i < n - 1; i++) {
        let Pmenor = i;
        for (let j = i + 1; j < n; j++) {
            if (resumen.titulosOrdenados[j].toLowerCase() < resumen.titulosOrdenados[Pmenor].toLowerCase()) {
                Pmenor = j;
            }
        }
        const temporal = resumen.titulosOrdenados[i];
        resumen.titulosOrdenados[i] = resumen.titulosOrdenados[Pmenor];
        resumen.titulosOrdenados[Pmenor] = temporal;
    }

    return resumen;
}

// ==========================================
// CASOS DE PRUEBA (Manuales)
// ==========================================

const tareasDePrueba = [
    { id: 1, titulo: "Z-Finalizar API", estado: "completado", fecha_creacion: "2026-04-01T10:00:00Z" },
    { id: 2, titulo: "A-Diseñar DB", estado: "en_progreso", fecha_creacion: "2026-04-05T15:30:00Z" },
    { id: 3, titulo: "M-Configurar React", estado: "completado", fecha_creacion: "2026-04-03T12:00:00Z" },
    { id: 4, titulo: "B-Escribir Tests", estado: "pendiente", fecha_creacion: "2026-04-02T09:00:00Z" }
];

console.log("--- PRUEBAS DE LÓGICA (PUNTO 4) ---");

// Prueba 1: Funcionamiento con datos normales
console.log("Resultado de Prueba 1:", resumirTareas(tareasDePrueba));

// Prueba 2: Funcionamiento con un solo elemento
console.log("Resultado de Prueba 2:", resumirTareas([tareasDePrueba[0]]));

// Prueba 3: Funcionamiento con array vacío
console.log("Resultado de Prueba 3:", resumirTareas([]));