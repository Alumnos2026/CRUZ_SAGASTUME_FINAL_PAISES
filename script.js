let dataTable; // Variable para guardar la instancia de la tabla
let dataTableInitialized = false;

// Variables para paginación de tabla
let paisesTodos = [];
let paginaActual = 1;
const paisesPorPagina = 5;

// Variables para cards
let paisesCards = [];
let paginaActualCards = 1;
const paisesPorCards = 2; // 2 países = 2 cards

const dataTableOptions = {
    columnDefs: [
        { orderable: false, targets: [4] }, 
        { className: "text-center", targets: "_all" } 
    ],
    pageLength: 5, 
    destroy: true,
    responsive: true,
    autoWidth: false,
    language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
    }
};

async function cargarPaises() {
    try {
        const respuesta = await fetch("https://corsproxy.io/?https://www.apicountries.com/countries");
        const paises = await respuesta.json();

        paises.sort((a, b) => a.name.localeCompare(b.name));
        
        // Guardar todos los países
        paisesTodos = paises;
        paisesCards = [...paises];
        paginaActual = 1;
        paginaActualCards = 1;

        // Llenar tabla y cards
        llenarTablaPaginada();
        llenarCards();
        
        // Inicializar DataTables
        if (dataTableInitialized) {
            dataTable.destroy();
        }
        dataTable = $("#tablaPaises").DataTable(dataTableOptions);
        dataTableInitialized = true;

    } catch (error) {
        console.error("Error al cargar la API:", error);
    }
}

// === TABLA: Mostrar 5 países con botones de flecha ===
function llenarTablaPaginada() {
    const inicio = (paginaActual - 1) * paisesPorPagina;
    const fin = inicio + paisesPorPagina;
    const paisesPagina = paisesTodos.slice(inicio, fin);
    
    llenarTabla(paisesPagina);
    
    const totalPaginas = Math.ceil(paisesTodos.length / paisesPorPagina);
    document.getElementById("paginaInfo").textContent = `Página ${paginaActual} de ${totalPaginas}`;
    
    document.getElementById("btnAnterior").disabled = paginaActual === 1;
    document.getElementById("btnSiguiente").disabled = paginaActual >= totalPaginas;
}

function llenarTabla(paises) {
    if (dataTableInitialized) {
        dataTable.destroy();
        dataTableInitialized = false;
    }
    
    const cuerpo = document.getElementById("cuerpoTabla");
    cuerpo.innerHTML = ""; 

    paises.forEach(pais => {
        const idiomas = pais.languages ? pais.languages.map(l => l.name).join(", ") : "N/A";
        const fila = `
            <tr>
                <td>${pais.name}</td>
                <td>${pais.capital || "N/A"}</td>
                <td>${pais.region || "N/A"}</td>
                <td>${pais.population.toLocaleString()}</td>
                <td>${idiomas}</td>
            </tr>`;
        cuerpo.innerHTML += fila;
    });
}

// === CARDS: Mostrar 2 países con botones de flecha ===
function llenarCards() {
    const inicio = (paginaActualCards - 1) * paisesPorCards;
    const fin = inicio + paisesPorCards;
    const paisesPagina = paisesCards.slice(inicio, fin);
    
    const contenedor = document.getElementById("contenedorCards");
    contenedor.innerHTML = "";

    paisesPagina.forEach((pais, index) => {
        const idiomas = pais.languages ? pais.languages.map(l => l.name).join(", ") : "N/A";
        const card = `
            <div class="col-md-6 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title" id="nombrePais${index}">${pais.name}</h5>
                        <p class="card-text">
                            <strong>Capital:</strong> ${pais.capital || "N/A"}<br>
                            <strong>Región:</strong> ${pais.region || "N/A"}<br>
                            <strong>Población:</strong> ${pais.population.toLocaleString()}<br>
                            <strong>Idiomas:</strong> ${idiomas}
                        </p>
                        <div class="d-flex gap-2 mt-3">
                            <button class="btn btn-warning btn-sm" onclick="cambiarNombreCard(${index}, '${pais.name}')">
                                <i class="fas fa-edit"></i> Cambiar Nombre
                            </button>
                            <button class="btn btn-success btn-sm" onclick="agregarHijoCard(${index}, '${pais.name}')">
                                <i class="fas fa-plus"></i> Agregar Hijo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += card;
    });
    
    const totalPaginas = Math.ceil(paisesCards.length / paisesPorCards);
    document.getElementById("paginaInfoCards").textContent = `Página ${paginaActualCards} de ${totalPaginas}`;
    
    document.getElementById("btnAnteriorCards").disabled = paginaActualCards === 1;
    document.getElementById("btnSiguienteCards").disabled = paginaActualCards >= totalPaginas;
}

function cambiarNombreCard(index, nombreOriginal) {
    const elemento = document.getElementById(`nombrePais${index}`);
    if (elemento) {
        elemento.textContent = "¡Nombre cambiado!";
    }
}

function agregarHijoCard(index, nombrePais) {
    const contenedor = document.getElementById("contenedorCards");
    const cardPadre = contenedor.children[index];
    if (!cardPadre) return;
    const cardBody = cardPadre.querySelector(".card-body");
    
    // Crear elemento hijo
    const hijoDiv = document.createElement("div");
    hijoDiv.className = "mt-3 p-2 bg-light rounded";
    hijoDiv.innerHTML = `
        <small class="text-muted">Hijo de ${nombrePais}</small>
        <div class="form-text">Información del nuevo elemento agregado</div>
    `;
    
    cardBody.appendChild(hijoDiv);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarPaises();
    
    // Tabla: Botones de flecha
    document.getElementById("btnAnterior").addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            llenarTablaPaginada();
        }
    });
    
    document.getElementById("btnSiguiente").addEventListener("click", () => {
        const totalPaginas = Math.ceil(paisesTodos.length / paisesPorPagina);
        if (paginaActual < totalPaginas) {
            paginaActual++;
            llenarTablaPaginada();
        }
    });
    
    // Cards: Botones de flecha
    document.getElementById("btnAnteriorCards").addEventListener("click", () => {
        if (paginaActualCards > 1) {
            paginaActualCards--;
            llenarCards();
        }
    });
    
    document.getElementById("btnSiguienteCards").addEventListener("click", () => {
        const totalPaginas = Math.ceil(paisesCards.length / paisesPorCards);
        if (paginaActualCards < totalPaginas) {
            paginaActualCards++;
            llenarCards();
        }
    });
    
    // Buscador
    document.getElementById("buscador").addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filtrados = paisesTodos.filter(p => 
            p.name.toLowerCase().includes(query)
        );
        paginaActual = 1;
        paginaActualCards = 1;
        paisesTodos = filtrados;
        paisesCards = [...filtrados];
        llenarTablaPaginada();
        llenarCards();
    });
    
    // Botón general "Cambiar Nombre"
    document.getElementById("cambiaNombre").addEventListener("click", () => {
        document.getElementById("cambiaNombre").innerHTML = "¡Nombre cambiado!";
    });
    
    // Botón "Agregar Hijo" (original)
    document.getElementById("agregaHijo").addEventListener("click", () => {
        const nuevoHijo = document.createElement("div");
        nuevoHijo.className = "p-2 bg-light rounded m-2";
        nuevoHijo.textContent = "¡Soy un nuevo hijo!";
        document.getElementById("agregaHijo").insertAdjacentElement("afterend", nuevoHijo);
    });
});