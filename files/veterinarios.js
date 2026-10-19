// veterinarios.js
// Alta, baja, modificación y listado de veterinarios usando LocalStorage.

const CLAVE_VETERINARIOS = "veterinarios";

// Elementos de la página
const formulario = document.getElementById("formVeterinario");
const campoId = document.getElementById("idVeterinario");
const campoMatricula = document.getElementById("matricula");
const campoNombre = document.getElementById("nombre");
const campoEspecializacion = document.getElementById("especializacion");
const campoValor = document.getElementById("valorConsulta");
const botonGuardar = document.getElementById("botonGuardar");
const botonCancelar = document.getElementById("botonCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");
const divMensaje = document.getElementById("mensaje");
const tabla = document.getElementById("tablaVeterinarios");
const total = document.getElementById("totalVeterinarios");

// ---------- LocalStorage ----------

function obtenerVeterinarios() {
    const datos = localStorage.getItem(CLAVE_VETERINARIOS);
    if (datos === null) {
        return [];
    }
    return JSON.parse(datos);
}

function guardarVeterinarios(lista) {
    localStorage.setItem(CLAVE_VETERINARIOS, JSON.stringify(lista));
}

// ---------- Auxiliares ----------

function generarId() {
    return Date.now().toString() + Math.floor(Math.random() * 1000);
}

function formatoMoneda(numero) {
    return numero.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}

function mostrarMensaje(texto) {
    divMensaje.textContent = texto;
    divMensaje.classList.remove("d-none");
}

function ocultarMensaje() {
    divMensaje.classList.add("d-none");
}

function limpiarFormulario() {
    formulario.reset();
    campoId.value = "";
    tituloFormulario.textContent = "Registrar veterinario";
    botonGuardar.textContent = "Guardar";
    botonCancelar.classList.add("d-none");
    ocultarMensaje();
}

// ---------- Listar ----------

function listarVeterinarios() {
    const lista = obtenerVeterinarios();
    let filas = "";

    for (let i = 0; i < lista.length; i++) {
        const vet = lista[i];
        filas += "<tr>" +
            "<td>" + vet.matricula + "</td>" +
            "<td>" + vet.nombre + "</td>" +
            "<td>" + vet.especializacion + "</td>" +
            "<td>" + "$" + vet.valorConsulta + "</td>" +
            '<td class="text-center">' +
            '<button class="btn btn-warning btn-sm me-1" onclick="editarVeterinario(\'' + vet.idVeterinario + '\')">Editar</button>' +
            '<button class="btn btn-danger btn-sm" onclick="eliminarVeterinario(\'' + vet.idVeterinario + '\')">Eliminar</button>' +
            "</td>" +
            "</tr>";
    }

    if (lista.length === 0) {
        filas = '<tr><td colspan="5" class="text-center text-muted">No hay veterinarios registrados.</td></tr>';
    }

    tabla.innerHTML = filas;
    total.textContent = lista.length;
}

// ---------- Alta y modificación ----------

function guardarFormulario(evento) {
    evento.preventDefault();

    const matricula = Number(campoMatricula.value);
    const nombre = campoNombre.value.trim();
    const especializacion = campoEspecializacion.value;
    const valorConsulta = Number(campoValor.value);

    // Validaciones
    if (campoMatricula.value === "" || !Number.isInteger(matricula) || matricula <= 0) {
        mostrarMensaje("La matrícula debe ser un número entero mayor a 0.");
        return;
    }
    if (nombre === "") {
        mostrarMensaje("Ingrese el nombre del veterinario.");
        return;
    }
    if (especializacion === "") {
        mostrarMensaje("Seleccione una especialización.");
        return;
    }
    if (campoValor.value === "" || valorConsulta <= 0) {
        mostrarMensaje("El valor de la consulta debe ser un número mayor a 0.");
        return;
    }

    const lista = obtenerVeterinarios();

    // La matrícula no se puede repetir
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].matricula === matricula && lista[i].idVeterinario !== campoId.value) {
            mostrarMensaje("Ya existe un veterinario con esa matrícula.");
            return;
        }
    }

    if (campoId.value === "") {
        // Alta: se genera el id automáticamente
        const nuevo = {
            idVeterinario: generarId(),
            matricula: matricula,
            nombre: nombre,
            especializacion: especializacion,
            valorConsulta: valorConsulta
        };
        lista.push(nuevo);
    } else {
        // Modificación: se busca por id y se actualizan los datos
        for (let i = 0; i < lista.length; i++) {
            if (lista[i].idVeterinario === campoId.value) {
                lista[i].matricula = matricula;
                lista[i].nombre = nombre;
                lista[i].especializacion = especializacion;
                lista[i].valorConsulta = valorConsulta;
            }
        }
    }

    guardarVeterinarios(lista);
    listarVeterinarios();
    limpiarFormulario();
}

// ---------- Editar ----------

function editarVeterinario(id) {
    const lista = obtenerVeterinarios();

    for (let i = 0; i < lista.length; i++) {
        if (lista[i].idVeterinario === id) {
            campoId.value = lista[i].idVeterinario;
            campoMatricula.value = lista[i].matricula;
            campoNombre.value = lista[i].nombre;
            campoEspecializacion.value = lista[i].especializacion;
            campoValor.value = lista[i].valorConsulta;
        }
    }

    tituloFormulario.textContent = "Editar veterinario";
    botonGuardar.textContent = "Guardar cambios";
    botonCancelar.classList.remove("d-none");
    ocultarMensaje();
    formulario.scrollIntoView();
}

// ---------- Eliminar ----------

function eliminarVeterinario(id) {
    const confirmado = confirm("¿Está seguro de que desea eliminar este veterinario?");
    if (confirmado === false) {
        return;
    }

    const lista = obtenerVeterinarios();
    const nuevaLista = [];

    for (let i = 0; i < lista.length; i++) {
        if (lista[i].idVeterinario !== id) {
            nuevaLista.push(lista[i]);
        }
    }

    guardarVeterinarios(nuevaLista);
    listarVeterinarios();

    // Si se estaba editando el que se borró, se limpia el formulario
    if (campoId.value === id) {
        limpiarFormulario();
    }
}

// ---------- Eventos ----------

formulario.addEventListener("submit", guardarFormulario);
botonCancelar.addEventListener("click", limpiarFormulario);

// Al cargar la página se muestran los datos guardados
listarVeterinarios();
