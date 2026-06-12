// Función para capitalizar la primera letra
function capitalizar(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}
// Función para cambiar entre modo claro y oscuro
function cambiarModo() {
    const body = document.body;
    body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
}

// Función para obtener datos de forma segura
function obtenerDatos(clave) {
    let datos = localStorage.getItem(clave);
    if (datos !== null) {
        let lista = JSON.parse(datos);
        if (Array.isArray(lista)) {
            return lista;
        }
    }
    return [];
}

// Inicialización de datos
let albumes = [
    { titulo: "Cuarto Azul", artista: "Aitana", genero: "pop", anio: 2025, pistas: 19, estado: "publicado", puntuacion: 6.5, portada: "img/aitana.jpg" },
    { titulo: "The Life of a Showgirl", artista: "Taylor Swift", genero: "pop", anio: 2025, pistas: 12, estado: "publicado", puntuacion: 6.9, portada: "img/taylor.jpg" },
    { titulo: "Lo Que Te Conté Mientras Te Hacias La Dormida", artista: "La Oreja de Van Gogh", genero: "pop", anio: 2003, pistas: 15, estado: "publicado", puntuacion: 8.0, portada: "img/oreja.jpg" },
    { titulo: "Debí tirar más fotos", artista: "Bad Bunny", genero: "urbano", anio: 2025, pistas: 17, estado: "publicado", puntuacion: 8.8, portada: "img/fotos.jpg" },
    { titulo: "Talento de barrio", artista: "Daddy Yankee", genero: "urbano", anio: 2008, pistas: 16, estado: "publicado", puntuacion: 7.9, portada: "img/barrio.jpg" },
    { titulo: "Aura", artista: "Ozuna", genero: "urbano", anio: 2018, pistas: 20, estado: "publicado", puntuacion: 6.8, portada: "img/aura.jpg" },
    { titulo: "Zapatillas", artista: "El Canto del Loco", genero: "rock", anio: 2005, pistas: 13, estado: "publicado", puntuacion: 8.1, portada: "img/zapatillas.jpg" },
    { titulo: "Back in Black", artista: "AC/DC", genero: "rock", anio: 1980, pistas: 10, estado: "publicado", puntuacion: 9.5, portada: "img/bib.jpg" },
    { titulo: "Use Your Illusion I", artista: "Guns N' Roses", genero: "rock", anio: 1991, pistas: 16, estado: "publicado", puntuacion: 7.3, portada: "img/ilusion.jpg" },
    { titulo: "Álbum en Proceso", artista: "Artista Desconocido", genero: "rock", anio: 2026, pistas: '?', estado: "en producción", puntuacion: 0, portada: "img/interrogacion.jpg" }
];

let catalogoActual = [...albumes];

// INICIALIZACIÓN DE DATOS CON PERSISTENCIA
let rosterArtistas = JSON.parse(localStorage.getItem('rosterArtistas')) || [
    { nombre: "Aitana", genero: "Pop", pais: "España", albumes: 3, estado: "activo" }
];

// Guardar los datos de prueba en localStorage si es la primera vez
if (!localStorage.getItem('rosterArtistas')) localStorage.setItem('rosterArtistas', JSON.stringify(rosterArtistas));

function mostrarSeccion(idSeccion) {
    let secciones = document.getElementsByClassName('seccion');
    for (let i = 0; i < secciones.length; i++) {
        secciones[i].style.display = 'none';
    }
    let seccion = document.getElementById(idSeccion);
    if (seccion) {
        seccion.style.display = 'block';
    }
    if (idSeccion === 'catalogo') {
        cargarCatalogo(catalogoActual);
    } else if (idSeccion === 'artistas') {
        cargarArtistas();
    } else if (idSeccion === 'agenda') {
        cargarAgenda();
    }
}

function filtrarCatalogo() {
    let busqueda = document.getElementById('buscador').value.toLowerCase();
    let genero = document.getElementById('filtroGenero').value;
    
    catalogoActual = albumes.filter(function(a) {
        let coincideTexto = a.titulo.toLowerCase().includes(busqueda) || a.artista.toLowerCase().includes(busqueda);
        let coincideGenero = (genero === 'todos' || a.genero === genero);
        return coincideTexto && coincideGenero;
    });
    
    cargarCatalogo(catalogoActual);
}

function cargarCatalogo(lista) {
    let contenedor = document.getElementById('contenidoCatalogo');
    let contador = document.getElementById('contador');
    
    contenedor.innerHTML = "";
    contador.innerText = lista.length;

    if (lista.length === 0) {
        contenedor.innerHTML = '<p class="mensaje-vacio">No se encontraron álbumes que coincidan con tu búsqueda.</p>';
        return; 
    }

    for (let i = 0; i < lista.length; i++) {
        let a = lista[i];
        let tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-album';
        tarjeta.innerHTML = `
            <img src="${a.portada}" alt="Portada de ${a.titulo}" class="imagen-tarjeta">
            <h3>${a.titulo}</h3>
            <p>Artista: ${a.artista}</p>
            <p>Puntuación: ${a.puntuacion}</p> 
        `;
        tarjeta.onclick = function() { abrirModal(a); };
        contenedor.appendChild(tarjeta);
    }
}

function abrirModal(album) {
    document.getElementById('tarjetaDetalle').style.display = 'block';
    document.getElementById('infoTarjeta').innerHTML = `
        <div class="infoTarjeta">
            <img src="${album.portada}" alt="Portada de ${album.titulo}" class="imagen-modal">
            <div class="info-detalle">
                <h3>${album.titulo}</h3>
                <p><strong>Artista:</strong> ${album.artista}</p>
                <p><strong>Género:</strong> ${capitalizar(album.genero)}</p>
                <p><strong>Año:</strong> ${album.anio}</p>
                <p><strong>Pistas:</strong> ${album.pistas}</p>
                <p><strong>Estado:</strong> ${capitalizar(album.estado)}</p>
                <p><strong>Puntuación:</strong> ${album.puntuacion}/10</p>
            </div>
        </div>
    `;
}

function cerrarModal() {
    document.getElementById('tarjetaDetalle').style.display = 'none';
}

let ordenAscendente = false; 

function ordenarPorPuntuacion() {
    ordenAscendente = !ordenAscendente;
    
    catalogoActual.sort(function(a, b) {
        return ordenAscendente ? (a.puntuacion - b.puntuacion) : (b.puntuacion - a.puntuacion);
    });
    
    cargarCatalogo(catalogoActual);
}

function cargarArtistas() {
    cargarTablaArtistas(); 
}

function cargarTablaArtistas() {
    let tabla = document.getElementById('listaArtistas');
    if (!tabla) return;
    
    tabla.innerHTML = "";
    
    for (let i = 0; i < rosterArtistas.length; i++) {
        let artista = rosterArtistas[i];
        let claseEstado = artista.estado.toLowerCase().replace(" ", "-");
        let rutaImagen = "img/" + artista.genero.toLowerCase() + ".jpg";

        tabla.innerHTML += 
            '<tr>' +
                '<td><img src="' + rutaImagen + '" alt="' + artista.genero + '" class="icono-genero"></td>' +
                '<td><strong>' + artista.nombre + '</strong></td>' +
                '<td>' + capitalizar(artista.genero) + '</td>' +
                '<td>' + artista.pais + '</td>' +
                '<td>' + artista.albumes + '</td>' +
                '<td><span class="badge ' + claseEstado + '">' + artista.estado.toUpperCase() + '</span></td>' +
                '<td>' +
                    '<button onclick="editarArtista(' + i + ')">Editar</button>' +
                    '<button onclick="eliminarArtista(' + i + ')">Eliminar</button>' +
                '</td>' +
            '</tr>';
    }
}

function guardarArtista() {
    let nombre = document.getElementById('nombreArtista').value;
    let genero = document.getElementById('generoArtista').value;
    let pais = document.getElementById('paisArtista').value;
    let albumes = parseInt(document.getElementById('albumesArtista').value);
    let estado = document.getElementById('estadoArtista').value;
    let pos = parseInt(document.getElementById('actualizarPosicion').value);

    if (!nombre || !genero || !pais || isNaN(albumes) || albumes < 0) {
        alert("Error: Todos los campos son obligatorios y el número de álbumes debe ser positivo.");
        return;
    }

    let nuevoArtista = { nombre, genero, pais, albumes, estado };

    if (pos === -1) {
        rosterArtistas.push(nuevoArtista);
    } else {
        rosterArtistas[pos] = nuevoArtista;
        document.getElementById('actualizarPosicion').value = "-1";
        document.getElementById('btnGuardar').innerText = "Registrar Artista";
    }

    sincronizar();
    limpiarFormulario();
}

function eliminarArtista(i) {
    if (confirm("¿Eliminar este artista de Harmony Records?")) {
        rosterArtistas.splice(i, 1);
        sincronizar();
    }
}

function editarArtista(i) {
    let a = rosterArtistas[i];
    document.getElementById('nombreArtista').value = a.nombre;
    document.getElementById('generoArtista').value = a.genero;
    document.getElementById('paisArtista').value = a.pais;
    document.getElementById('albumesArtista').value = a.albumes;
    document.getElementById('estadoArtista').value = a.estado;
    
    document.getElementById('actualizarPosicion').value = i;
    document.getElementById('btnGuardar').innerText = "Guardar Cambios";
}

function sincronizar() {
    localStorage.setItem('rosterArtistas', JSON.stringify(rosterArtistas));
    cargarTablaArtistas();
}

function limpiarFormulario() {
    document.getElementById('nombreArtista').value = "";
    document.getElementById('generoArtista').value = "";
    document.getElementById('paisArtista').value = "";
    document.getElementById('albumesArtista').value = "";
    document.getElementById('estadoArtista').value = "";
}

function cargarAgenda() {
    let filtro = document.getElementById('filtroTipo').value;
    let lista = JSON.parse(localStorage.getItem('lanzamientos')) || [];
    renderizarAgenda(); 

    let datosTrimestre = { 
        'Trimestre 1': { count: 0, budget: 0 }, 
        'Trimestre 2': { count: 0, budget: 0 }, 
        'Trimestre 3': { count: 0, budget: 0 }, 
        'Trimestre 4': { count: 0, budget: 0 } 
    };

    for (let i = 0; i < lista.length; i++) {
        let lz = lista[i];
        if (filtro !== "todos" && lz.tipo !== filtro) continue;

        let partes = lz.fecha.split('-');
        let mes = parseInt(partes[1], 10) - 1; 
        
        let trimestre = "";
        if (mes >= 0 && mes <= 2) trimestre = 'Trimestre 1';
        else if (mes >= 3 && mes <= 5) trimestre = 'Trimestre 2';
        else if (mes >= 6 && mes <= 8) trimestre = 'Trimestre 3';
        else trimestre = 'Trimestre 4';

        datosTrimestre[trimestre].count++;
        datosTrimestre[trimestre].budget += (parseFloat(lz.coste) || 0);

        let idTrimestre = trimestre.replace(" ", "-");
        let listaUl = document.querySelector('#' + idTrimestre + ' .lista-lanzamientos');
        let rutaImagen = 'img/' + lz.genero.toLowerCase() + '.jpg';
        if (listaUl) {
            listaUl.innerHTML += 
                '<li id="lanzamiento-' + lz.id + '" class="' + (lz.estado === 'lanzado' ? 'lanzado' : '') + '">' +
                    '<div class="contenedor-imagen-agenda">' +
                        '<img src="' + rutaImagen + '" class="icono-genero">' +
                    '</div>' +
                    '<div class="contenedor-info-agenda">' +
                        '<strong>' + lz.titulo + '</strong><br>' +
                        '(' + lz.tipo + ') - ' + lz.artista + '<br>' +
                        '[' + lz.coste + '€]' +
                    '</div>' +
                    '<div class="contenedor-botones-agenda">' +
                        '<button class="btn-marcar" onclick="marcarLanzado(' + lz.id + ')">Lanzado</button>' +
                        '<button class="btn-eliminar" onclick="eliminarLanzamiento(' + lz.id + ')">Eliminar</button>' +
                    '</div>' +
                '</li>';
        }
    }

    // Actualizamos la interfaz con la suma total
    for (let t in datosTrimestre) {
        let contenedorTrimestre = document.getElementById(t.replace(" ", "-"));
        if (contenedorTrimestre) {
            let span = contenedorTrimestre.querySelector('.info-trimestre span');
            if (span) {
                span.innerText = 'Lanzamientos: ' + datosTrimestre[t].count + ' | Presupuesto: ' + datosTrimestre[t].budget + '€';
            }
        }
    }
}

function renderizarAgenda() {
    let contenedor = document.getElementById('contenidoAgenda');
    contenedor.innerHTML = ""; 
    
    let trimestres = ['Trimestre 1', 'Trimestre 2', 'Trimestre 3', 'Trimestre 4'];
    
    for (let i = 0; i < trimestres.length; i++) {
        let t = trimestres[i];
        let id = t.replace(" ", "-");
        contenedor.innerHTML += 
            '<div class="bloque-trimestre" id="' + id + '">' +
                '<h3>' + t + '</h3>' +
                '<div class="info-trimestre"><span>Lanzamientos: 0</span></div>' +
                '<br>' +
                '<ul class="lista-lanzamientos"></ul>' +
            '</div>';
    }
}

function cargarArtistasEnSelect() {
    let select = document.getElementById('artistaLanzamiento');
    if (!select) return;

    select.innerHTML = '<option value="">Selecciona un artista activo...</option>';
    
    for (let i = 0; i < rosterArtistas.length; i++) {
        let art = rosterArtistas[i];
        if (art.estado && art.estado.toLowerCase().trim() === 'activo') {
            let option = document.createElement('option');
            option.value = art.nombre;
            option.textContent = art.nombre;
            select.appendChild(option);
        }
    }
}

function eliminarLanzamiento(id) {
    let elemento = document.getElementById('lanzamiento-' + id);
    
    if (elemento) {
        elemento.classList.add("eliminando");
    }

    let lista = JSON.parse(localStorage.getItem('lanzamientos')) || [];
    let nuevaLista = [];
    
    for (let i = 0; i < lista.length; i++) {
        if (Number(lista[i].id) !== Number(id)) {
            nuevaLista.push(lista[i]);
        }
    }
    
    localStorage.setItem('lanzamientos', JSON.stringify(nuevaLista));

    setTimeout(function() {
        cargarAgenda();
    }, 300);
}

function marcarLanzado(id) {
    let lista = JSON.parse(localStorage.getItem('lanzamientos')) || [];
    for (let i = 0; i < lista.length; i++) {
        if (Number(lista[i].id) === Number(id)) {
            lista[i].estado = 'lanzado';
        }
    }
    localStorage.setItem('lanzamientos', JSON.stringify(lista));
    cargarAgenda();
}

function guardarLanzamiento() {
    let fechas = document.getElementById('fechaLanzamiento').value;
    if (fechas) {
        let anio = new Date(fechas).getFullYear();

        if (anio !== 2026) {
            alert("Atención: El proyecto Harmony Records solo acepta lanzamientos programados para el año 2026. Por favor, ajusta la fecha.");
            return;
    }
}

    let titulo = document.getElementById('tituloLanzamiento').value;
    let artistaNombre = document.getElementById('artistaLanzamiento').value;
    let tipo = document.getElementById('tipoLanzamiento').value;
    let fecha = document.getElementById('fechaLanzamiento').value;
    let coste = parseFloat(document.getElementById('costeLanzamiento').value) || 0; // Captura el coste

    if (!titulo || !artistaNombre || !fecha) {
        alert("Por favor, completa todos los campos.");
        return;
    }
    let lista = JSON.parse(localStorage.getItem('lanzamientos')) || [];
    let artistaObj = rosterArtistas.find(function(a) { return a.nombre === artistaNombre; });
    let generoArtista = artistaObj ? artistaObj.genero : 'pop';

    let nuevoLanzamiento = {
        id: Date.now(),
        titulo: titulo,
        artista: artistaNombre,
        genero: generoArtista,
        tipo: tipo,
        fecha: fecha,
        coste: coste,
        estado: 'pendiente'
    };

    lista.push(nuevoLanzamiento);
    localStorage.setItem('lanzamientos', JSON.stringify(lista));

    document.getElementById('tituloLanzamiento').value = "";
    document.getElementById('artistaLanzamiento').value = "";
    document.getElementById('fechaLanzamiento').value = "";
    document.getElementById('costeLanzamiento').value = "";

    cargarAgenda();
}

document.addEventListener('DOMContentLoaded', function() {
    // 1. Verificamos si existe la clave en localStorage
    if (!localStorage.getItem('lanzamientos')) {
        let lanzamientoInicial = [
            { id: 1, titulo: "SuperEstrella2", artista: "Aitana", genero: "pop", tipo: "single", fecha: "2026-06-15", estado: "pendiente", coste: 5000 }
        ];
        localStorage.setItem('lanzamientos', JSON.stringify(lanzamientoInicial));
    }

    mostrarSeccion('catalogo');
    cargarTablaArtistas();
    cargarArtistasEnSelect();
    cargarAgenda();
});