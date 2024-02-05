
function agregarEvento(id, evento, funcion) {
    var elemento = document.getElementById(id);
    if (elemento) {
        elemento.addEventListener(evento, funcion);
    } else {
        console.error("El elemento con ID '" + id + "' no fue encontrado.");
    }
}


document.addEventListener('DOMContentLoaded', function() {

    agregarEvento('videojuegos', 'click', function() {
        redirigirPagina(this);
    });

    agregarEvento('mangas','click', function() {
        redirigirPagina(this);
    });

    agregarEvento('figuras','click', function() {
        redirigirPagina(this);
    });

    agregarEvento('accesorios','click', function() {
        redirigirPagina(this);
    });

});
function redirigirPagina(elemento) {
    var id=elemento.getAttribute("data-id");
    localStorage.setItem('idSeleccionada', id);
    window.location.href = "html/vistaProductos.html";
}