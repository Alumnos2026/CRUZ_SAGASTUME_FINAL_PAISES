// 1. Cargamos los países
async function cargarPaises() {
    try {
        // Usamos proxy CORS para la API original
        const respuesta = await fetch("https://corsproxy.io/?https://www.apicountries.com/countries");
        
        const paises = await respuesta.json();

        // Ordenar por nombre
        paises.sort((a, b) => a.name.localeCompare(b.name));

        // Llamamos a la función para pintar la tabla
        llenarTabla(paises);
    } catch (error) {
        console.error("Error al cargar la API:", error);
    }
}

function llenarTabla(paises) {
    const cuerpo = document.getElementById("cuerpoTabla");
    cuerpo.innerHTML = ""; 

    paises.forEach(pais => {
        const fila = document.createElement("tr");

        // Los idiomas están en un array de objetos
        const idiomas = pais.languages ? pais.languages.map(l => l.name).join(", ") : "N/A";

        fila.innerHTML = `
            <td>${pais.name}</td>
            <td>${pais.capital || "N/A"}</td>
            <td>${pais.region || "N/A"}</td>
            <td>${pais.population.toLocaleString()}</td>
            <td>${idiomas}</td>
        `;
        cuerpo.appendChild(fila);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Ejecutamos la carga de países al abrir la página
    cargarPaises();

    const inputBuscador = document.getElementById("buscador");
    
    inputBuscador.addEventListener("input", function() {
        const valorBusqueda = this.value.toLowerCase();
        const filas = document.getElementById("cuerpoTabla").getElementsByTagName("tr");

        for (let i = 0; i < filas.length; i++) {
            const textoFila = filas[i].textContent.toLowerCase();
            // Si el texto de la fila incluye lo que escribimos, la mostramos
            filas[i].style.display = textoFila.includes(valorBusqueda) ? "" : "none";
        }
    });
});