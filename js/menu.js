
function agregarEvento(id, evento, funcion) {
    var elemento = document.getElementById(id);
    if (elemento) {
        elemento.addEventListener(evento, funcion);
    } else {
        console.error("El elemento con ID '" + id + "' no fue encontrado.");
    }
}


document.addEventListener('DOMContentLoaded', function() {

    agregarEvento('Videojuegos', 'click', function() {
        redirigirPagina(this);
    });

    agregarEvento('Mangas','click', function() {
        redirigirPagina(this);
    });

    agregarEvento('Figuras','click', function() {
        redirigirPagina(this);
    });

    agregarEvento('Otros','click', function() {
        redirigirPagina(this);
    });
    agregarEvento('Papeleria','click', function() {
        redirigirPagina(this);
    });
    agregarEvento('NavVideoJuegos','click', function() {
        redirigirPagina(this);
    });
    agregarEvento('NavMangas','click', function() {
        redirigirPagina(this);
    });
    agregarEvento('NavFiguras','click', function() {
        redirigirPagina(this);
    });
    agregarEvento('NavPapeleria','click', function() {
        redirigirPagina(this);
    });
    agregarEvento('NavOtros','click', function() {
        redirigirPagina(this);
    });


});
function redirigirPagina(elemento) {
    var id=elemento.getAttribute("data-id");
    localStorage.setItem('idSeleccionada', id);
    window.location.href = "../html/vistaProductos.html";
}