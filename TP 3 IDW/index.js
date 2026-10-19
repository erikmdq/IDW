// Datos iniciales por si el LocalStorage todavía está vacío.
const listaInicial = [
    {
        nombre: "Carlos Gómez",
        especializacion: "Consulta general",
        valorConsulta: 12000,
        imagen: "./assets/images/carlos.jpg",
        matricula: 8745
    },
    {
        nombre: "María Gonzalez",
        especializacion: "Clínica General",
        valorConsulta: 15000,
        imagen: "./assets/images/maria.jpg",
        matricula: 9241
    },
    {
        nombre: "Julio Martínez",
        especializacion: "Cirugía",
        valorConsulta: 22000,
        imagen: "./assets/images/julio.jpg",
        matricula: 12693
    },
    {
        nombre: "Sofía Lopez",
        especializacion: "Dermatología",
        valorConsulta: 18000,
        imagen: "./assets/images/sofia.jpg",
        matricula: 15743
    }
];

// Función para leer LocalStorage o cargar la lista inicial
function obtenerVeterinarios() {
    const datosGuardados = localStorage.getItem('veterinarios');

    if (datosGuardados === null) {
        // Guarda los datos por defecto si la clave no existe
        localStorage.setItem('veterinarios', JSON.stringify(listaInicial));
        return listaInicial;
    }

    return JSON.parse(datosGuardados);
}

// Función para mostrar las tarjetas en la portada
function mostrarTarjetas() {
    const contenedor = document.getElementById('contenedor-profesionales');
    const veterinarios = obtenerVeterinarios();

function formatoMoneda(valor) {
    var numero = parseFloat(valor);

    return "$ " + numero.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

    contenedor.innerHTML = ''; //Limpiar el contenedor HTML

    veterinarios.forEach(function(vet) {
        //Se inserta la tarjeta de cada profesional. 
        // Muestra la imagen cargada o una imagen por defecto (cat-dog.jpg)
        contenedor.innerHTML += `
            <div class="col-md-3 mb-4">
                <div class="card h-100 shadow-sm text-center">
                    <img src="${vet.imagen || './assets/images/cat-dog.jpg'}" class="card-img-top" alt="${vet.nombre}" style="height: 180px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold">${vet.nombre}</h5>
                        <p class="card-text text-muted mb-2">${vet.especializacion}</p>
                        <p class="fw-bold text-success fs-5">${formatoMoneda(vet.valorConsulta)}</p>
                        <button class="btn btn-primary btn-sm mt-auto" onclick="alert('Profesional: ${vet.nombre}\\nMatrícula: ${vet.matricula}\\nEspecialidad: ${vet.especializacion}\\nConsulta: $${vet.valorConsulta}')">
                            Ver Detalle
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

// 4. Ejecutar la función al cargar el archivo
mostrarTarjetas();