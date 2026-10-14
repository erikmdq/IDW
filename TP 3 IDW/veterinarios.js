/**
 * veterinarios.js - Módulo de Gestión para la Entidad Veterinarios.
 * 
 * Este script se encarga de:
 * 1. Guardar y recuperar la lista de veterinarios en LocalStorage bajo la clave 'veterinarios'.
 * 2. Generar automáticamente identificadores únicos (idVeterinario).
 * 3. Renderizar la tabla con el valor de la consulta formateado como moneda local ($ ARS).
 * 4. Gestionar el alta, edición y eliminación (con modal de confirmación Bootstrap).
 * 5. Aplicar un filtro de búsqueda en tiempo real sobre la tabla.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Clave propia en LocalStorage
    const STORAGE_KEY = 'veterinarios';

    // Referencias a elementos del DOM
    const formVeterinario = document.getElementById('form-veterinario');
    const inputIdVeterinario = document.getElementById('idVeterinario');
    const inputMatricula = document.getElementById('matricula');
    const inputNombre = document.getElementById('nombre');
    const selectEspecializacion = document.getElementById('especializacion');
    const inputValorConsulta = document.getElementById('valorConsulta');

    const btnGuardar = document.getElementById('btn-guardar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const tituloFormulario = document.getElementById('titulo-formulario');
    const tablaBody = document.getElementById('tabla-veterinarios-body');
    const contadorVeterinarios = document.getElementById('contador-veterinarios');
    const filtroInput = document.getElementById('filtro-veterinario');

    // Elementos del Modal de Eliminación
    const modalEliminarEl = document.getElementById('modalEliminar');
    const modalEliminar = new bootstrap.Modal(modalEliminarEl);
    const nombreEliminarSpan = document.getElementById('nombre-eliminar');
    const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');

    let veterinarios = obtenerVeterinariosLocalStorage();
    let idVeterinarioAEliminar = null;

    // Inicializar la tabla al cargar la página
    renderizarTabla();

    /**
     * Carga el arreglo de veterinarios desde LocalStorage.
     */
    function obtenerVeterinariosLocalStorage() {
        const datos = localStorage.getItem(STORAGE_KEY);
        return datos ? JSON.parse(datos) : [];
    }

    /**
     * Guarda el listado actual de veterinarios en LocalStorage.
     */
    function guardarVeterinariosLocalStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(veterinarios));
    }

    /**
     * Genera un identificador único automático (UID).
     */
    function generarUUID() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return 'vet-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7);
    }

    /**
     * Formatea un número como moneda (Peso Argentino).
     * @param {number} valor - Importe a formatear.
     */
    function formatearMoneda(valor) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 2
        }).format(valor);
    }

    /**
     * Evento submit del formulario: Agrega un nuevo veterinario o guarda cambios en uno existente.
     */
    formVeterinario.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = inputIdVeterinario.value.trim();
        const matricula = parseInt(inputMatricula.value, 10);
        const nombre = inputNombre.value.trim();
        const especializacion = selectEspecializacion.value;
        const valorConsulta = parseFloat(inputValorConsulta.value);

        if (isNaN(matricula) || !nombre || !especializacion || isNaN(valorConsulta)) {
            alert('Por favor, complete todos los campos obligatorios correctamente.');
            return;
        }

        if (id) {
            // MODO EDICIÓN
            const index = veterinarios.findIndex(v => v.idVeterinario === id);
            if (index !== -1) {
                veterinarios[index].matricula = matricula;
                veterinarios[index].nombre = nombre;
                veterinarios[index].especializacion = especializacion;
                veterinarios[index].valorConsulta = valorConsulta;
            }
        } else {
            // MODO REGISTRO (ALTA)
            const nuevoVeterinario = {
                idVeterinario: generarUUID(), // Identificador autogenerado
                matricula: matricula,
                nombre: nombre,
                especializacion: especializacion,
                valorConsulta: valorConsulta,
                // Imagen base predeterminada
                imagen: './assets/images/carlos.jpg'
            };
            veterinarios.push(nuevoVeterinario);
        }

        guardarVeterinariosLocalStorage();
        renderizarTabla();
        resetearFormulario();
    });

    /**
     * Muestra las filas correspondientes en la tabla HTML.
     * @param {Array} lista - Arreglo de veterinarios a renderizar.
     */
    function renderizarTabla(lista = veterinarios) {
        tablaBody.innerHTML = '';

        if (lista.length === 0) {
            tablaBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted py-4">
                        No hay veterinarios registrados o que coincidan con la búsqueda.
                    </td>
                </tr>
            `;
        } else {
            lista.forEach((vet) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><small class="text-muted fs-7">${vet.idVeterinario.substring(0, 8)}...</small></td>
                    <td class="fw-bold">${vet.matricula}</td>
                    <td>${vet.nombre}</td>
                    <td><span class="badge bg-secondary">${vet.especializacion}</span></td>
                    <td class="text-success fw-bold">${formatearMoneda(vet.valorConsulta)}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-outline-warning me-1 btn-editar" data-id="${vet.idVeterinario}">Editar</button>
                        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${vet.idVeterinario}">Eliminar</button>
                    </td>
                `;
                tablaBody.appendChild(tr);
            });
        }

        // Actualizar el total de veterinarios
        contadorVeterinarios.textContent = veterinarios.length;

        vincularEventosTabla();
    }

    /**
     * Asigna listener de eventos a botones Editar/Eliminar de cada fila.
     */
    function vincularEventosTabla() {
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                cargarVeterinarioEnFormulario(id);
            });
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                prepararEliminacion(id);
            });
        });
    }

    /**
     * Carga la información del veterinario seleccionado en los campos del formulario para su modificación.
     * @param {string} id - UID del veterinario.
     */
    function cargarVeterinarioEnFormulario(id) {
        const vet = veterinarios.find(v => v.idVeterinario === id);
        if (!vet) return;

        inputIdVeterinario.value = vet.idVeterinario;
        inputMatricula.value = vet.matricula;
        inputNombre.value = vet.nombre;
        selectEspecializacion.value = vet.especializacion;
        inputValorConsulta.value = vet.valorConsulta;

        tituloFormulario.textContent = 'Editar Veterinario';
        btnGuardar.textContent = 'Guardar Cambios';
        btnCancelar.classList.remove('d-none');

        formVeterinario.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Muestra el modal Bootstrap para solicitar confirmación de borrado.
     * @param {string} id - UID del veterinario.
     */
    function prepararEliminacion(id) {
        const vet = veterinarios.find(v => v.idVeterinario === id);
        if (!vet) return;

        idVeterinarioAEliminar = id;
        nombreEliminarSpan.textContent = `${vet.nombre} (Matrícula: ${vet.matricula})`;
        modalEliminar.show();
    }

    /**
     * Ejecuta la eliminación del registro en LocalStorage tras la confirmación del usuario.
     */
    btnConfirmarEliminar.addEventListener('click', () => {
        if (!idVeterinarioAEliminar) return;

        veterinarios = veterinarios.filter(v => v.idVeterinario !== idVeterinarioAEliminar);
        guardarVeterinariosLocalStorage();
        renderizarTabla();

        modalEliminar.hide();
        idVeterinarioAEliminar = null;
    });

    /**
     * Restablece el formulario a su estado original.
     */
    function resetearFormulario() {
        formVeterinario.reset();
        inputIdVeterinario.value = '';

        tituloFormulario.textContent = 'Registrar Veterinario';
        btnGuardar.textContent = 'Guardar Veterinario';
        btnCancelar.classList.add('d-none');
    }

    btnCancelar.addEventListener('click', resetearFormulario);

    /**
     * Buscador / Filtro dinámico en tiempo real.
     */
    filtroInput.addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase().trim();
        const filtrados = veterinarios.filter(v =>
            v.nombre.toLowerCase().includes(termino) ||
            v.especializacion.toLowerCase().includes(termino) ||
            v.matricula.toString().includes(termino)
        );
        renderizarTabla(filtrados);
    });
});