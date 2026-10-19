// 1. Selección de elementos HTML
const form = document.getElementById('form-veterinario');
const inputMatricula = document.getElementById('matricula');
const inputNombre = document.getElementById('nombre');
const selectEspecializacion = document.getElementById('especializacion');
const inputValorConsulta = document.getElementById('valorConsulta');
const inputPosicion = document.getElementById('posicion-editar');

const tituloForm = document.getElementById('titulo-form');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');
const tablaBody = document.getElementById('tabla-body');

// 2. Arreglo principal de datos
let veterinarios = [];

// 3. Función para cargar datos de LocalStorage
function cargarDatos() {
    const datosGuardados = localStorage.getItem('veterinarios');
    if (datosGuardados !== null) {
        veterinarios = JSON.parse(datosGuardados);
    }
    mostrarTabla();
}

// 4. Función para guardar en LocalStorage
function guardarEnLocalStorage() {
    localStorage.setItem('veterinarios', JSON.stringify(veterinarios));
}

// 5. Función para mostrar la tabla en pantalla
function mostrarTabla() {
    tablaBody.innerHTML = ''; // Limpiar la tabla antes de volver a dibujar

    if (veterinarios.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay veterinarios registrados.</td></tr>';
        return;
    }

    veterinarios.fo0rEach((vet, index) => {
        tablaBody.innerHTML += `
            <tr>
                <td>${vet.matricula}</td>
                <td>${vet.nombre}</td>
                <td>${vet.especializacion}</td>
                <td>$${vet.valorConsulta}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="prepararEditar(${index})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarVeterinario(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// 6. Evento al enviar el formulario (Guardar / Editar)
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evitar que la página se recargue

    const posicion = parseInt(inputPosicion.value);

    // Crear el objeto con los datos ingresados
    const nuevoVeterinario = {
        matricula: inputMatricula.value,
        nombre: inputNombre.value,
        especializacion: selectEspecializacion.value,
        valorConsulta: inputValorConsulta.value,
        imagen: './assets/images/cat-dog.jpg' // Imagen por defecto para el catálogo
    };

    if (posicion === -1) {
        // Registro nuevo
        veterinarios.push(nuevoVeterinario);
    } else {
        // Modificación de registro existente
        veterinarios[posicion] = nuevoVeterinario;
    }

    guardarEnLocalStorage();
    mostrarTabla();
    limpiarFormulario();
});

// 7. Cargar los datos en el formulario para editar
function prepararEditar(index) {
    const vet = veterinarios[index];

    inputMatricula.value = vet.matricula;
    inputNombre.value = vet.nombre;
    selectEspecializacion.value = vet.especializacion;
    inputValorConsulta.value = vet.valorConsulta;

    inputPosicion.value = index; // Guardamos el índice que estamos editando
    tituloForm.textContent = 'Editar Veterinario';
    btnGuardar.textContent = 'Guardar Cambios';
    btnCancelar.classList.remove('d-none');
}

// 8. Eliminar un veterinario con confirmación simple
function eliminarVeterinario(index) {
    const confirmacion = confirm('¿Desea eliminar este veterinario?');
    if (confirmacion) {
        veterinarios.splice(index, 1); // Quitar el elemento del arreglo
        guardarEnLocalStorage();
        mostrarTabla();
    }
}

// 9. Resetear el formulario al estado inicial
function limpiarFormulario() {
    form.reset();
    inputPosicion.value = '-1';
    tituloForm.textContent = 'Agregar Veterinario';
    btnGuardar.textContent = 'Guardar';
    btnCancelar.classList.add('d-none');
}

btnCancelar.addEventListener('click', limpiarFormulario);

// Iniciar la carga al abrir la página
cargarDatos();