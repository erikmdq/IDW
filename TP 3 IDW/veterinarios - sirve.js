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

// 2. Arreglo principal para guardar la lista
var veterinarios = [];

// 3. Cargar datos guardados en el navegador
function cargarDatos() {
    var datosGuardados = localStorage.getItem('veterinarios');
    if (datosGuardados !== null) {
        veterinarios = JSON.parse(datosGuardados);
    }
    mostrarTabla();
}

// 4. Guardar datos en el navegador
function guardarEnLocalStorage() {
    localStorage.setItem('veterinarios', JSON.stringify(veterinarios));
}

// 5. Dibujar la tabla en pantalla
function mostrarTabla() {
    tablaBody.innerHTML = '';

    if (veterinarios.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay veterinarios registrados.</td></tr>';
        return;
    }

    veterinarios.forEach(function(vet, index) {
        tablaBody.innerHTML += '<tr>' +
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

// 6. Función para agregar o modificar un veterinario
function guardarVeterinario(e) {
    e.preventDefault(); // Evita que el formulario recargue la página

    var posicion = parseInt(inputPosicion.value);

    var nuevoVeterinario = {
        matricula: inputMatricula.value,
        nombre: inputNombre.value,
        especializacion: selectEspecializacion.value,
        valorConsulta: inputValorConsulta.value,
        imagen: './assets/images/carlos.jpg'
    };

    if (posicion === -1) {
        // Si la posición es -1, es un registro nuevo
        veterinarios.push(nuevoVeterinario);
    } else {
        // Si no es -1, reemplazamos en la posición que estamos editando
        veterinarios[posicion] = nuevoVeterinario;
    }

    guardarEnLocalStorage();
    mostrarTabla();
    limpiarFormulario();
}

// 7. Cargar datos en el formulario para editar
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

// 8. Eliminar un veterinario del arreglo
function eliminarVeterinario(index) {
    var confirmacion = confirm('¿Desea eliminar este veterinario?');
    if (confirmacion) {
        veterinarios.splice(index, 1);
        guardarEnLocalStorage();
        mostrarTabla();
    }
}

// 9. Dejar el formulario como al principio
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

// Ejecutar la lectura inicial de datos
cargarDatos();