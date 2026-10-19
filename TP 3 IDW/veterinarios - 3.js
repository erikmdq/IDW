// 1. Selección de elementos del HTML
var form = document.getElementById('form-veterinario');
var inputMatricula = document.getElementById('matricula');
var inputNombre = document.getElementById('nombre');
var selectEspecializacion = document.getElementById('especializacion');
var inputValorConsulta = document.getElementById('valorConsulta');
var inputPosicion = document.getElementById('posicion-editar');

var tituloForm = document.getElementById('titulo-form');
var btnGuardar = document.getElementById('btn-guardar');
var btnCancelar = document.getElementById('btn-cancelar');
var tablaBody = document.getElementById('tabla-body');

// 2. Lista inicial por defecto (si LocalStorage está vacío)
var listaInicial = [
    {
        idVeterinario: 1001,
        matricula: 45892,
        nombre: "Carlos Gómez",
        especializacion: "Consulta general",
        valorConsulta: 12000,
        imagen: "./assets/images/carlos.jpg"
    },
    {
        idVeterinario: 1002,
        matricula: 38210,
        nombre: "María Gonzalez",
        especializacion: "Clínica General",
        valorConsulta: 15000,
        imagen: "./assets/images/maria.jpg"
    },
    {
        idVeterinario: 1003,
        matricula: 51204,
        nombre: "Julio Martínez",
        especializacion: "Cirugía",
        valorConsulta: 22000,
        imagen: "./assets/images/julio.jpg"
    },
    {
        idVeterinario: 1004,
        matricula: 49011,
        nombre: "Sofía Lopez",
        especializacion: "Dermatología",
        valorConsulta: 18000,
        imagen: "./assets/images/sofia.jpg"
    }
];

// Arreglo principal
var veterinarios = [];

// 3. Cargar datos desde LocalStorage o inicializar
function cargarDatos() {
    var datosGuardados = localStorage.getItem('veterinarios');

    if (datosGuardados === null) {
        // Si no hay datos guardados aún, cargamos la lista por defecto
        veterinarios = listaInicial;
        guardarEnLocalStorage(); // Los guardamos en LocalStorage
    } else {
        veterinarios = JSON.parse(datosGuardados);
    }

    mostrarTabla();
}

// 4. Guardar datos en LocalStorage
function guardarEnLocalStorage() {
    localStorage.setItem('veterinarios', JSON.stringify(veterinarios));
}

// 5. Generar ID automático (1001, 1002, etc.)
function obtenerNuevoId() {
    if (veterinarios.length === 0) {
        return 1001;
    }

    var idMaximo = 0;
    veterinarios.forEach(function(vet) {
        var idActual = parseInt(vet.idVeterinario);
        if (idActual > idMaximo) {
            idMaximo = idActual;
        }
    });

    return idMaximo + 1;
}

// 6. Dibujar la tabla en pantalla
function mostrarTabla() {
    tablaBody.innerHTML = '';

    if (veterinarios.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay veterinarios registrados.</td></tr>';
        return;
    }

    veterinarios.forEach(function(vet, index) {
        tablaBody.innerHTML += '<tr>' +
            '<td><small class="text-muted">' + vet.idVeterinario + '</small></td>' +
            '<td>' + vet.matricula + '</td>' +
            '<td>' + vet.nombre + '</td>' +
            '<td>' + vet.especializacion + '</td>' +
            '<td>$' + vet.valorConsulta + '</td>' +
            '<td>' +
                '<button class="btn btn-warning btn-sm me-1" onclick="prepararEditar(' + index + ')">Editar</button>' +
                '<button class="btn btn-danger btn-sm" onclick="eliminarVeterinario(' + index + ')">Eliminar</button>' +
            '</td>' +
        '</tr>';
    });
}

// 7. Guardar o Modificar un veterinario
function guardarVeterinario(e) {
    e.preventDefault();

    var posicion = parseInt(inputPosicion.value);

    if (posicion === -1) {
        // REGISTRO NUEVO
        var nuevoVeterinario = {
            idVeterinario: obtenerNuevoId(), // Genera un ID automático
            matricula: inputMatricula.value,
            nombre: inputNombre.value,
            especializacion: selectEspecializacion.value,
            valorConsulta: inputValorConsulta.value,
            imagen: './assets/images/carlos.jpg'
        };
        veterinarios.push(nuevoVeterinario);
    } else {
        // MODIFICACIÓN (Mantiene el mismo ID)
        veterinarios[posicion].matricula = inputMatricula.value;
        veterinarios[posicion].nombre = inputNombre.value;
        veterinarios[posicion].especializacion = selectEspecializacion.value;
        veterinarios[posicion].valorConsulta = inputValorConsulta.value;
    }

    guardarEnLocalStorage();
    mostrarTabla();
    limpiarFormulario();
}

// 8. Cargar datos en el formulario para editar
function prepararEditar(index) {
    var vet = veterinarios[index];

    inputMatricula.value = vet.matricula;
    inputNombre.value = vet.nombre;
    selectEspecializacion.value = vet.especializacion;
    inputValorConsulta.value = vet.valorConsulta;

    inputPosicion.value = index;
    tituloForm.textContent = 'Editar Veterinario';
    btnGuardar.textContent = 'Guardar Cambios';
    btnCancelar.classList.remove('d-none');
}

// 9. Eliminar un veterinario del arreglo
function eliminarVeterinario(index) {
    var confirmacion = confirm('¿Desea eliminar a este veterinario?');
    if (confirmacion) {
        veterinarios.splice(index, 1);
        guardarEnLocalStorage();
        mostrarTabla();
    }
}

// 10. Limpiar el formulario
function limpiarFormulario() {
    form.reset();
    inputPosicion.value = '-1';
    tituloForm.textContent = 'Agregar Veterinario';
    btnGuardar.textContent = 'Guardar';
    btnCancelar.classList.add('d-none');
}

// Asignación de eventos
form.addEventListener('submit', guardarVeterinario);
btnCancelar.addEventListener('click', limpiarFormulario);

// Ejecutar al cargar la página
cargarDatos();