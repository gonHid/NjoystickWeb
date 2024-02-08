    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
    import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
    import { firebaseConfig } from "../config/config.js";

    const categoriaSeleccionada = localStorage.getItem("idSeleccionada");
    let paginaActual = 1;
    const productosPorPagina = 8;
    // Configuración de Firebase
    // Inicializa Firebase
    const app = initializeApp(firebaseConfig);

    // Obtiene una referencia a la base de datos
    const database = getDatabase(app);
    const usuariosRef = ref(database, 'productos');

    //referencia al cuerpo del html

    var productosGrid = document.getElementById('productoGrid');

    // Realiza una consulta SELECT simple
    onValue(usuariosRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Productos stock:", data);
      mostrarProductos(data, paginaActual);
      // Actualizar el paginador
      actualizarPaginador(data);
    });

    // Define la cantidad de productos por página


function mostrarProductos(data, pagina) {
  const inicio = (pagina - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosEnPagina = Object.values(data)
    .filter(producto => producto.categoria === categoriaSeleccionada)
    .slice(inicio, fin);

  productosGrid.innerHTML = '';
  for (const producto of productosEnPagina) {
    const card = document.createElement('div');
    card.className = 'card w-100';
    
    const imagenProducto = document.createElement('img');
    // Establecer tamaño máximo y mínimo sin deformar la imagen
    imagenProducto.style.maxWidth = '290px';
    imagenProducto.style.maxHeight = '370px';
    imagenProducto.style.minHeight = '370px';
   
    const nombreProducto = document.createElement('h5');
    const categoria = document.createElement('p');
    const isTomoDoble = document.createElement('p');
    const precio = document.createElement('p');
    const cantidad = document.createElement('p');
    if (producto.cantidad === 0) {
      imagenProducto.className='sinStock';
      cantidad.textContent = "SIN STOCK";
    }else{

      cantidad.textContent = "Stock disponible: "+ producto.cantidad;
    }
    if(producto.tomoDoble!=null){
      if(producto.tomoDoble){
        isTomoDoble.textContent = "-TOMO DOBLE-";
      }else{
        isTomoDoble.textContent = "-TOMO SIMPLE-";
      }
    }else if(producto.alternativo){
      isTomoDoble.textContent = "-TOMO DOBLE-";
    }else{
      isTomoDoble.textContent = "-TOMO SIMPLE-";
    }
    imagenProducto.src = producto.urlImagen;
            
    nombreProducto.textContent = producto.nombre;
    precio.textContent = "Precio: $" + producto.precio;
  
    card.appendChild(imagenProducto)
    card.appendChild(nombreProducto)
    if(producto.categoria == "Mangas"){
      card.appendChild(isTomoDoble)
    }
    card.appendChild(precio)
    card.appendChild(cantidad)
    card.style.maxWidth = '310px';
    card.style.minWidth = '310px';
    card.style.maxHeight = '540px';
    
    productosGrid.appendChild(card);
  }
}

function actualizarPaginador(data) {
  const productosFiltrados = Object.values(data).filter(producto => producto.categoria === categoriaSeleccionada);
  const totalProductos = productosFiltrados.length;
  const totalPaginas = Math.ceil(totalProductos / productosPorPagina);

  const paginador = document.getElementById('pagination');
  paginador.innerHTML = '';

  // Botón de retroceso
  const botonRetroceso = document.createElement('li');
  botonRetroceso.className = 'page-item';
  const enlaceRetroceso = document.createElement('a');
  enlaceRetroceso.className = 'page-link';
  enlaceRetroceso.innerHTML = '&laquo;';
  enlaceRetroceso.addEventListener('click', () => {
    if (paginaActual > 1) {
      paginaActual--;
      mostrarProductos(data, paginaActual);
      actualizarPaginador(data);
    }
  });
  botonRetroceso.appendChild(enlaceRetroceso);
  paginador.appendChild(botonRetroceso);

  // Botones de páginas
  for (let i = 1; i <= totalPaginas; i++) {
    const botonPagina = document.createElement('li');
    botonPagina.className = 'page-item';

    const enlacePagina = document.createElement('a');
    enlacePagina.className = 'page-link';
    enlacePagina.textContent = i;
    enlacePagina.addEventListener('click', () => {
      paginaActual = i;
      mostrarProductos(data, paginaActual);
      actualizarPaginador(data);
    });

    // Marcar la página actual
    if (i === paginaActual) {
      botonPagina.classList.add('active');
    }

    botonPagina.appendChild(enlacePagina);
    paginador.appendChild(botonPagina);
  }

  // Botón de avance
  const botonAvance = document.createElement('li');
  botonAvance.className = 'page-item';
  const enlaceAvance = document.createElement('a');
  enlaceAvance.className = 'page-link';
  enlaceAvance.innerHTML = '&raquo;';
  enlaceAvance.addEventListener('click', () => {
    if (paginaActual < totalPaginas) {
      paginaActual++;
      mostrarProductos(data, paginaActual);
      actualizarPaginador(data);
    }
  });
  botonAvance.appendChild(enlaceAvance);
  paginador.appendChild(botonAvance);

  // Deshabilitar botones si no hay productos
  if (totalProductos === 0) {
    botonRetroceso.classList.add('disabled');
    botonAvance.classList.add('disabled');
  } else {
    // Habilitar/deshabilitar botones según la página actual
    botonRetroceso.classList.toggle('disabled', paginaActual === 1);
    botonAvance.classList.toggle('disabled', paginaActual === totalPaginas);
  }
}


    // Iterar sobre los datos y mostrar la informacion del producto
    

