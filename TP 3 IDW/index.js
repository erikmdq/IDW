/**
 * index.js - Renderizado dinámico del Catálogo de Profesionales en la portada (index.html).
 * 
 * Este script:
 * 1. Lee la clave 'veterinarios' desde LocalStorage.
 * 2. Si no existen datos iniciales, precarga un conjunto de veterinarios semilla por defecto.
 * 3. Genera dinámicamente las tarjetas (Cards) y sus respectivos Modales de detalles en Bootstrap 5.
 */

document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'veterinarios';
    const contenedorCards = document.getElementById('contenedor-profesionales');
    const contenedorModales = document.getElementById('contenedor-modales');

    if (!contenedorCards) return;

    // Datos por defecto (Semilla) si LocalStorage está vacío
    const profesionalesSemilla = [
        {
            idVeterinario: 'vet-carlos-gomez',
            matricula: 1001,
            nombre: 'Carlos Gómez',
            especializacion: 'Consulta general / Chequeo',
            valorConsulta: 12000,
            imagen: './assets/images/carlos.jpg',
            horario: 'Lunes a Miércoles de 08:00 a 14:00 hs.'
        },
        {
            idVeterinario: 'vet-maria-gonzalez',
            matricula: 1002,
            nombre: 'María Gonzalez',
            especializacion: 'Clínica General',
            valorConsulta: 15000,
            imagen: './assets/images/maria.jpg',
            horario: 'Martes a Viernes de 09:00 a 16:00 hs.'
        },
        {
            idVeterinario: 'vet-julio-martinez',
            matricula: 1003,
            nombre: 'Julio Martínez',
            especializacion: 'Cirugía y Traumatología',
            valorConsulta: 22000,
            imagen: './assets/images/julio.jpg',
            horario: 'Lunes, Miércoles y Viernes de 14:00 a 20:00 hs.'
        },
        {
            idVeterinario: 'vet-sofia-lopez',
            matricula: 1004,
            nombre: 'Sofía Lopez',
            especializacion: 'Dermatología',
            valorConsulta: 18000,
            imagen: './assets/images/sofia.jpg',
            horario: 'Jueves y Sábados de 10:00 a 15:00 hs.'
        }
    ];

    /**
     * Obtiene los veterinarios guardados en LocalStorage o inicializa la semilla.
     */
    function cargarProfesionales() {
        const datos = localStorage.getItem(STORAGE_KEY);
        if (!datos || JSON.parse(datos).length === 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profesionalesSemilla));
            return profesionalesSemilla;
        }
        return JSON.parse(datos);
    }

    /**
     * Formatea un número como moneda.
     */
    function formatearMoneda(valor) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0
        }).format(valor);
    }

    /**
     * Renderiza el catálogo dinámico de profesionales en la portada.
     */
    function renderizarCatalogo() {
        const lista = cargarProfesionales();
        contenedorCards.innerHTML = '';
        contenedorModales.innerHTML = '';

        lista.forEach((pro, index) => {
            const modalId = `modalVet_${index}`;

            // 1. Generación de la Card en la grilla
            const col = document.createElement('div');
            col.className = 'col-12 col-md-6 col-lg-3';
            col.innerHTML = `
                <div class="card h-100 shadow-sm border-0">
                    <img src="${pro.imagen || './assets/images/carlos.jpg'}" 
                         class="card-img-top object-fit-cover" 
                         height="200" 
                         alt="${pro.nombre}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold">${pro.nombre}</h5>
                        <p class="card-text text-muted mb-2">${pro.especializacion}</p>
                        <div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                            <span class="badge bg-success fs-6">${formatearMoneda(pro.valorConsulta)}</span>
                            <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#${modalId}">Ver Detalle</button>
                        </div>
                    </div>
                </div>
            `;
            contenedorCards.appendChild(col);

            // 2. Generación del Modal de detalle para el profesional
            const modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.id = modalId;
            modal.tabIndex = -1;
            modal.setAttribute('aria-hidden', 'true');
            modal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title fw-bold">${pro.nombre}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Matrícula:</strong> N° ${pro.matricula}</p>
                            <p><strong>Especialidad:</strong> ${pro.especializacion}</p>
                            <p><strong>Días / Horarios de atención:</strong> ${pro.horario || 'Lunes a Viernes de 09:00 a 18:00 hs.'}</p>
                            <p><strong>Costo de consulta:</strong> <span class="text-success fw-bold">${formatearMoneda(pro.valorConsulta)}</span></p>
                        </div>
                    </div>
                </div>
            `;
            contenedorModales.appendChild(modal);
        });
    }

    renderizarCatalogo();
});