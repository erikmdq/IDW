/**
 * mascotas.js - Módulo de Gestión para la Entidad Mascotas.
 * 
 * Este script se encarga de:
 * 1. Recuperar y guardar datos de mascotas en LocalStorage bajo la clave 'mascotas'.
 * 2. Generar identificadores únicos automáticos (idMascota) usando crypto.randomUUID().
 * 3. Renderizar la tabla de mascotas y actualizar el contador total.
 * 4. Gestionar el alta, edición y eliminación (mediante confirmación con modal Bootstrap).
 * 5. Convertir y almacenar opcionalmente imágenes en formato Base64.
 * 6. Filtrar dinámicamente el listado de mascotas en la tabla.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Clave de almacenamiento en LocalStorage
    const STORAGE_KEY = 'mascotas';

    // Referencias a elementos del DOM
    const formMascota = document.getElementById('form-mascota');
    const inputIdMascota = document.getElementById('idMascota');
    const inputNombreMascota = document.getElementById('nombreMascota');
    const inputNombreDuenio = document.getElementById('nombreDuenio');
    const inputColor = document.getElementById('color');
    const inputEdad = document.getElementById('edad');
    const inputPeso = document.getElementById('peso');
    const inputImagen = document.getElementById('imagenMascota');
    const previewContainer = document.getElementById('preview-container');
    const previewImg = document.getElementById('preview-img');

    const btnGuardar = document.getElementById('btn-guardar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const tituloFormulario = document.getElementById('titulo-formulario');
    const tablaBody = document.getElementById('tabla-mascotas-body');
    const contadorMascotas = document.getElementById('contador-mascotas');
    const filtroInput = document.getElementById('filtro-mascota');

    // Modal de eliminación de Bootstrap
    const modalEliminarEl = document.getElementById('modalEliminar');
    const modalEliminar = new bootstrap.Modal(modalEliminarEl);
    const nombreEliminarSpan = document.getElementById('nombre-eliminar');
    const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');

    // Variables de estado local
    let mascotas = obtenerMascotasLocalStorage();
    let idMascotaAEliminar = null;
    let imagenBase64Actual = ''; // Almacena temporalmente la imagen procesada

    // Carga inicial de datos en la tabla
    renderizarTabla();

    /**
     * Función que obtiene el listado de mascotas desde LocalStorage.
     * Retorna un arreglo vacío si no existe la clave.
     */
    function obtenerMascotasLocalStorage() {
        const datos = localStorage.getItem(STORAGE_KEY);
        return datos ? JSON.parse(datos) : [];
    }

    /**
     * Función que guarda el estado del arreglo de mascotas en LocalStorage.
     */
    function guardarMascotasLocalStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mascotas));
    }

    /**
     * Genera un identificador único para cada registro de mascota.
     * Utiliza crypto.randomUUID() o un fallback de fecha + aleatorio.
     */
    function generarUUID() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return 'masc-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7);
    }

    /**
     * Previsualiza y convierte a Base64 la imagen seleccionada por el usuario.
     */
    inputImagen.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (evt) {
                imagenBase64Actual = evt.target.result;
                previewImg.src = imagenBase64Actual;
                previewContainer.classList.remove('d-none');
            };
            reader.readAsDataURL(file);
        } else {
            imagenBase64Actual = '';
            previewContainer.classList.add('d-none');
        }
    });

    /**
     * Evento Submit del formulario: Gestiona tanto el Registro (Alta) como la Modificación (Edición).
     */
    formMascota.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtención de valores del formulario
        const id = inputIdMascota.value.trim();
        const nombreMascota = inputNombreMascota.value.trim();
        const nombreDuenio = inputNombreDuenio.value.trim();
        const color = inputColor.value.trim();
        const edad = parseInt(inputEdad.value, 10);
        const peso = parseFloat(inputPeso.value);

        // Validación simple de campos obligatorios
        if (!nombreMascota || !nombreDuenio || !color || isNaN(edad) || isNaN(peso)) {
            alert('Por favor, complete todos los campos obligatorios con valores válidos.');
            return;
        }

        if (id) {
            // MODO EDICIÓN: Actualizar registro existente
            const index = mascotas.findIndex(m => m.idMascota === id);
            if (index !== -1) {
                mascotas[index].nombreMascota = nombreMascota;
                mascotas[index].nombreDuenio = nombreDuenio;
                mascotas[index].color = color;
                mascotas[index].edad = edad;
                mascotas[index].peso = peso;
                // Conservar imagen anterior si no se subió una nueva
                if (imagenBase64Actual) {
                    mascotas[index].imagen = imagenBase64Actual;
                }
            }
        } else {
            // MODO ALTA: Crear nuevo registro
            const nuevaMascota = {
                idMascota: generarUUID(), // Generación automática del ID
                nombreMascota: nombreMascota,
                nombreDuenio: nombreDuenio,
                color: color,
                edad: edad,
                peso: peso,
                imagen: imagenBase64Actual || './assets/images/cat-dog.jpg' // Imagen predeterminada si no hay subida
            };
            mascotas.push(nuevaMascota);
        }

        // Persistencia y actualización de interfaz
        guardarMascotasLocalStorage();
        renderizarTabla();
        resetearFormulario();
    });

    /**
     * Renderiza las filas de la tabla según los datos almacenados y actualiza el contador.
     * @param {Array} lista - Subconjunto o lista completa de mascotas a mostrar.
     */
    function renderizarTabla(lista = mascotas) {
        tablaBody.innerHTML = '';

        if (lista.length === 0) {
            tablaBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted py-4">
                        No hay mascotas registradas o que coincidan con la búsqueda.
                    </td>
                </tr>
            `;
        } else {
            lista.forEach((mascota) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <img src="${mascota.imagen || './assets/images/cat-dog.jpg'}" 
                             alt="${mascota.nombreMascota}" 
                             class="rounded-circle object-fit-cover" 
                             width="40" height="40">
                    </td>
                    <td><small class="text-muted fs-7">${mascota.idMascota.substring(0, 8)}...</small></td>
                    <td class="fw-bold">${mascota.nombreMascota}</td>
                    <td>${mascota.nombreDuenio}</td>
                    <td>${mascota.color}</td>
                    <td>${mascota.edad} año(s)</td>
                    <td>${mascota.peso.toFixed(1)} kg</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-outline-warning me-1 btn-editar" data-id="${mascota.idMascota}">Editar</button>
                        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${mascota.idMascota}">Eliminar</button>
                    </td>
                `;
                tablaBody.appendChild(tr);
            });
        }

        // Actualizar el contador total de registros
        contadorMascotas.textContent = mascotas.length;

        // Delegación de eventos para los botones Editar y Eliminar
        vincularEventosTabla();
    }

    /**
     * Asigna eventos a los botones dinámicos dentro de la tabla.
     */
    function vincularEventosTabla() {
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                cargarMascotaEnFormulario(id);
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
     * Carga los datos de una mascota en el formulario para modificar sus valores.
     * @param {string} id - Identificador de la mascota a editar.
     */
    function cargarMascotaEnFormulario(id) {
        const mascota = mascotas.find(m => m.idMascota === id);
        if (!mascota) return;

        inputIdMascota.value = mascota.idMascota;
        inputNombreMascota.value = mascota.nombreMascota;
        inputNombreDuenio.value = mascota.nombreDuenio;
        inputColor.value = mascota.color;
        inputEdad.value = mascota.edad;
        inputPeso.value = mascota.peso;

        if (mascota.imagen) {
            imagenBase64Actual = mascota.imagen;
            previewImg.src = mascota.imagen;
            previewContainer.classList.remove('d-none');
        } else {
            previewContainer.classList.add('d-none');
        }

        // Cambiar título y botones al estado de edición
        tituloFormulario.textContent = 'Editar Mascota';
        btnGuardar.textContent = 'Guardar Cambios';
        btnCancelar.classList.remove('d-none');

        // Desplazar vista hacia el formulario
        formMascota.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Prepara el modal de confirmación antes de eliminar una mascota.
     * @param {string} id - Identificador de la mascota.
     */
    function prepararEliminacion(id) {
        const mascota = mascotas.find(m => m.idMascota === id);
        if (!mascota) return;

        idMascotaAEliminar = id;
        nombreEliminarSpan.textContent = `${mascota.nombreMascota} (Dueño: ${mascota.nombreDuenio})`;
        modalEliminar.show();
    }

    /**
     * Confirma la eliminación de la mascota seleccionada.
     */
    btnConfirmarEliminar.addEventListener('click', () => {
        if (!idMascotaAEliminar) return;

        mascotas = mascotas.filter(m => m.idMascota !== idMascotaAEliminar);
        guardarMascotasLocalStorage();
        renderizarTabla();

        modalEliminar.hide();
        idMascotaAEliminar = null;
    });

    /**
     * Restablece los campos del formulario a su estado inicial.
     */
    function resetearFormulario() {
        formMascota.reset();
        inputIdMascota.value = '';
        imagenBase64Actual = '';
        previewContainer.classList.add('d-none');

        tituloFormulario.textContent = 'Registrar Mascota';
        btnGuardar.textContent = 'Guardar Mascota';
        btnCancelar.classList.add('d-none');
    }

    // Evento botón Cancelar Edición
    btnCancelar.addEventListener('click', resetearFormulario);

    /**
     * Filtro dinámico en tiempo real para la tabla de mascotas.
     */
    filtroInput.addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase().trim();
        const filtradas = mascotas.filter(m => 
            m.nombreMascota.toLowerCase().includes(termino) ||
            m.nombreDuenio.toLowerCase().includes(termino) ||
            m.color.toLowerCase().includes(termino)
        );
        renderizarTabla(filtradas);
    });
});