// index.js
// Arma el catálogo de profesionales de la portada con los veterinarios
// guardados en LocalStorage (se cargan desde veterinarios.html).

const CLAVE_VETERINARIOS = "veterinarios";

function obtenerVeterinarios() {
    const datos = localStorage.getItem(CLAVE_VETERINARIOS);
    if (datos === null) {
        return [];
    }
    return JSON.parse(datos);
}

function formatoMoneda(numero) {
    return numero.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}

function mostrarProfesionales() {
    const contenedor = document.getElementById("listaProfesionales");
    const veterinarios = obtenerVeterinarios();

    if (veterinarios.length === 0) {
        contenedor.innerHTML = '<div class="col-12"><div class="alert alert-info text-center">' +
            'Todavía no hay profesionales cargados. ' +
            '<a href="veterinarios.html">Cargar el primero</a></div></div>';
        return;
    }

    let html = "";
    for (let i = 0; i < veterinarios.length; i++) {
        const vet = veterinarios[i];
        html += '<div class="col-12 col-md-6 col-lg-3">' +
            '<div class="card h-100 shadow-sm border-0">' +
            '<img src="./assets/images/cat-dog.jpg" class="card-img-top object-fit-cover" height="200" alt="' + vet.nombre + '">' +
            '<div class="card-body d-flex flex-column">' +
            '<h5 class="card-title fw-bold">' + vet.nombre + '</h5>' +
            '<p class="card-text text-muted mb-2">' + vet.especializacion + '</p>' +
            '<div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">' +
            '<span class="badge bg-success fs-6">' + formatoMoneda(vet.valorConsulta) + '</span>' +
            '<button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalProfesional" ' +
            'onclick="verDetalle(\'' + vet.idVeterinario + '\')">Ver Detalle</button>' +
            '</div></div></div></div>';
    }
    contenedor.innerHTML = html;
}

// Completa el modal con los datos del veterinario elegido
function verDetalle(id) {
    const veterinarios = obtenerVeterinarios();
    for (let i = 0; i < veterinarios.length; i++) {
        if (veterinarios[i].idVeterinario === id) {
            document.getElementById("modalNombre").textContent = veterinarios[i].nombre;
            document.getElementById("modalMatricula").textContent = veterinarios[i].matricula;
            document.getElementById("modalEspecializacion").textContent = veterinarios[i].especializacion;
            document.getElementById("modalValor").textContent = formatoMoneda(veterinarios[i].valorConsulta);
        }
    }
}

mostrarProfesionales();
