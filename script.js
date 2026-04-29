let dataTable; // Variable para guardar la instancia de la tabla
let dataTableInitialized = false;

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
        url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' // Opcional: Idioma español
    }
};

async function cargarPaises() {
    try {
        const respuesta = await fetch("https://corsproxy.io/?https://www.apicountries.com/countries");
        const paises = await respuesta.json();

        paises.sort((a, b) => a.name.localeCompare(b.name));

    
        await llenarTabla(paises);
        
        // Inicializar DataTables
        dataTable = $("#nombreDeTuTabla").DataTable(dataTableOptions);
        dataTableInitialized = true;

    } catch (error) {
        console.error("Error al cargar la API:", error);
    }
}

function llenarTabla(paises) {
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

document.addEventListener('DOMContentLoaded', () => {
    cargarPaises();
    
});


document.getElementById("cambiaNombre").addEventListener("click", () => {
    document.getElementById("cambiaNombre").innerHTML = "¡Nombre cambiado!";
});
