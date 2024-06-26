    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
    import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
    import { firebaseConfig } from "../config/config.js";
    var opcionSeleccionada = false;
    var cambioCategoria= true;
    var categoriaSeleccionada = localStorage.getItem("idSeleccionada");
    let paginaActual = 1;
    var opcionMarca;
    const productosPorPagina = 16;
    
    // Configuración de Firebase
    // Inicializa Firebase
    const app = initializeApp(firebaseConfig);
    
    // Obtiene una referencia a la base de datos
    const database = getDatabase(app);
    const usuariosRef = ref(database, 'productos');

    //referencia al cuerpo del html

    var productosGrid = document.getElementById('productoGrid');
    var searchInput = document.getElementById('searchInput');
    

    // Realiza una consulta SELECT simple
    const onDataChange = (snapshot) => {
      const data = snapshot.val();
      mostrarProductos(data, paginaActual);
      // Actualizar el paginador
      actualizarPaginador(data, '');
      
      
      // Agregar evento change al select
      document.getElementById('buscaMarca').addEventListener('change', function() {
        // Función a ejecutar cuando el cliente elija una opción
        opcionMarca=this.value;
        opcionSeleccionada = true;
        
        
        const busqueda = searchInput.value;
        if (busqueda.trim() !== '') {
          mostrarProductosConBusqueda(data, 1, busqueda,false);
        } else {
          paginaActual = 1;
          mostrarProductos(data, 1);
        }
        actualizarPaginador(data, busqueda);
      });

      searchInput.addEventListener('input', () => {
        const busqueda = searchInput.value;
        if (busqueda.trim() !== '') {
          mostrarProductosConBusqueda(data, 1, busqueda,false);
        } else {
          paginaActual = 1;
          mostrarProductos(data, 1);
        }
        actualizarPaginador(data, busqueda);
      });
      definirBotones(data);
    };
    const onDataChangeCallback = onValue(usuariosRef, onDataChange);
   

    // Define la cantidad de productos por página


function mostrarProductos(data, pagina) {
  const inicio = (pagina - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;

  if(categoriaSeleccionada!='Videojuegos' && categoriaSeleccionada!='Mangas'){
    document.getElementById('buscaMarca').style.display='none';
    document.getElementById('buscar').classList.remove('col-md-8');
    document.getElementById('buscar').classList.add('col-md-12');
  }else{
    document.getElementById('buscaMarca').style.display='block';
    document.getElementById('buscar').classList.remove('col-md-12');
    document.getElementById('buscar').classList.add('col-md-8');
  }

  if(cambioCategoria){
  //Llamamos las marcas de los productos
  const marcasUnicas = new Set();
  cambioCategoria=false;
  Object.values(data)
    .filter(producto => producto.categoria === categoriaSeleccionada)
    .forEach(producto => marcasUnicas.add(producto.marca));

    const select = document.getElementById('buscaMarca');

    // Limpiar opciones existentes
    select.innerHTML = '';
  
    // Agregar la opción por defecto
    const opcionPorDefecto = document.createElement('option');
    opcionPorDefecto.value = '';
    opcionPorDefecto.textContent = 'Buscar por marca...';
    select.appendChild(opcionPorDefecto);
  
    // Agregar las opciones de marcas
    marcasUnicas.forEach(marca => {
      const opcion = document.createElement('option');
      opcion.value = marca;
      opcion.textContent = marca;
      select.appendChild(opcion);
    });   
  }
  let productosEnPagina;
  if(document.getElementById('buscaMarca').value==''){
    productosEnPagina = Object.values(data)
    .filter(producto => producto.categoria === categoriaSeleccionada)
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .slice(inicio, fin);
  }else{
   productosEnPagina = Object.values(data)
    .filter(producto => producto.categoria === categoriaSeleccionada)
    .filter(producto=>producto.marca===opcionMarca)
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .slice(inicio, fin);
  }
  productosGrid.innerHTML = '';
  for (const producto of productosEnPagina) {
    const card = document.createElement('div');
    card.className = 'card w-100';
    
    const imagenProducto = document.createElement('img');
    // Establecer tamaño máximo y mínimo sin deformar la imagen
    imagenProducto.style.maxWidth = '290px';
    imagenProducto.style.maxHeight = '370px';
    imagenProducto.style.minHeight = '370px';
    imagenProducto.loading = 'lazy';
    const nombreProducto = document.createElement('h5');
    const categoria = document.createElement('p');
    const isTomoDoble = document.createElement('p');
    const precio = document.createElement('p');
    const cantidad = document.createElement('p');
    if (producto.cantidad === 0) {
      imagenProducto.className='sinStock';
      cantidad.textContent = "SIN STOCK";
    }else{

      cantidad.textContent = "STOCK: DISPONIBLE";
    }

      isTomoDoble.textContent="Tipo: "+producto.tipoTomo;
    
    imagenProducto.src = producto.urlImagen;
            
    nombreProducto.textContent = producto.nombre + " -"+producto.marca+"-";
    nombreProducto.style.fontWeight = 'bold';
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
    ajustarTamanioTexto(card);
  }
  

onDataChangeCallback();
}


function actualizarPaginador(data, busqueda) {

  let productosFiltrados;
  if(document.getElementById('buscaMarca').value==''){
    productosFiltrados = Object.values(data).filter(producto => 
      producto.categoria === categoriaSeleccionada &&
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  }else{
    productosFiltrados = Object.values(data).filter(producto =>
      producto.categoria === categoriaSeleccionada &&
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (opcionMarca ? producto.marca === opcionMarca : true)
    );
  }
  const totalProductos = productosFiltrados.length;
  const totalPaginas = Math.ceil(totalProductos / productosPorPagina);

  const paginador = document.getElementById('pagination');
  paginador.innerHTML = '';

  const mostrarBoton = (numeroPagina) => {
    const botonPagina = document.createElement('li');
    botonPagina.className = 'page-item';

    const enlacePagina = document.createElement('a');
    enlacePagina.className = 'page-link';
    enlacePagina.textContent = numeroPagina;
    enlacePagina.addEventListener('click', () => {
      paginaActual = numeroPagina;
      if (busqueda.trim() !== '') {
        mostrarProductosConBusqueda(data, paginaActual, busqueda,true);
      } else {
        mostrarProductos(data, paginaActual);
      }
      actualizarPaginador(data, busqueda);
    });

    // Marcar la página actual
    if (numeroPagina === paginaActual) {
      botonPagina.classList.add('active');
    }

    botonPagina.appendChild(enlacePagina);
    paginador.appendChild(botonPagina);
  };

  // Botón de ir al inicio
  const botonInicio = document.createElement('li');
  botonInicio.className = 'page-item';
  const enlaceInicio = document.createElement('a');
  enlaceInicio.className = 'page-link';
  enlaceInicio.innerHTML = 'Inicio';
  enlaceInicio.addEventListener('click', () => {
    if (paginaActual > 1) {
      paginaActual = 1;
      if (busqueda.trim() !== '') {
        mostrarProductosConBusqueda(data, paginaActual, busqueda,true);
      } else {
        mostrarProductos(data, paginaActual);
      }
      actualizarPaginador(data, busqueda);
    }
  });
  botonInicio.appendChild(enlaceInicio);
  paginador.appendChild(botonInicio);

  // Botón de retroceso
  const botonRetroceso = document.createElement('li');
  botonRetroceso.className = 'page-item';
  const enlaceRetroceso = document.createElement('a');
  enlaceRetroceso.className = 'page-link';
  enlaceRetroceso.innerHTML = '&laquo;';
  enlaceRetroceso.addEventListener('click', () => {
    if (paginaActual > 1) {
      paginaActual--;
      if (busqueda.trim() !== '') {
        mostrarProductosConBusqueda(data, paginaActual, busqueda,true);
      } else {
        mostrarProductos(data, paginaActual);
      }
      actualizarPaginador(data, busqueda);
    }
  });
  botonRetroceso.appendChild(enlaceRetroceso);
  paginador.appendChild(botonRetroceso);

  // Mostrar solo los números de página relevantes
  const rangoPaginas = 2; // Puedes ajustar este valor según tus preferencias
  const inicio = Math.max(1, paginaActual - rangoPaginas);
  const fin = Math.min(totalPaginas, paginaActual + rangoPaginas);

  for (let i = inicio; i <= fin; i++) {
    mostrarBoton(i);
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
      if (busqueda.trim() !== '') {
        mostrarProductosConBusqueda(data, paginaActual, busqueda,true);
      } else {
        mostrarProductos(data, paginaActual);
      }
      actualizarPaginador(data, busqueda);
    }
  });
  botonAvance.appendChild(enlaceAvance);
  paginador.appendChild(botonAvance);

  // Botón de ir al final
  const botonFinal = document.createElement('li');
  botonFinal.className = 'page-item';
  const enlaceFinal = document.createElement('a');
  enlaceFinal.className = 'page-link';
  enlaceFinal.innerHTML = 'Final';
  enlaceFinal.addEventListener('click', () => {
    if (paginaActual < totalPaginas) {
      paginaActual = totalPaginas;
      if (busqueda.trim() !== '') {
        mostrarProductosConBusqueda(data, paginaActual, busqueda,true);
      } else {
        mostrarProductos(data, paginaActual);
      }
      actualizarPaginador(data, busqueda);
    }
  });
  botonFinal.appendChild(enlaceFinal);
  paginador.appendChild(botonFinal);

  // Deshabilitar botones si no hay productos
  if (totalProductos === 0) {
    botonInicio.classList.add('disabled');
    botonRetroceso.classList.add('disabled');
    botonAvance.classList.add('disabled');
    botonFinal.classList.add('disabled');
  } else {
    // Habilitar/deshabilitar botones según la página actual
    botonInicio.classList.toggle('disabled', paginaActual === 1);
    botonRetroceso.classList.toggle('disabled', paginaActual === 1);
    botonAvance.classList.toggle('disabled', paginaActual === totalPaginas);
    botonFinal.classList.toggle('disabled', paginaActual === totalPaginas);
  }
}


function mostrarProductosConBusqueda(data, pagina, busqueda, isBoton) {
  const inicio = (pagina - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const palabrasBusqueda = busqueda.toLowerCase().split(' ').filter(Boolean);
  let productosFiltrados;
  if(document.getElementById('buscaMarca').value==''){
    productosFiltrados = Object.values(data)
    .filter(producto => 
      producto.categoria === categoriaSeleccionada &&
      palabrasBusqueda.every(palabra => 
        producto.nombre.toLowerCase().includes(palabra) || 
        producto.marca.toLowerCase().includes(palabra)
      )
      
    )
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .slice(inicio, fin);
  }else{
    productosFiltrados = Object.values(data)
    .filter(producto => 
      producto.categoria === categoriaSeleccionada &&
      palabrasBusqueda.every(palabra => 
        producto.nombre.toLowerCase().includes(palabra) || 
        producto.marca.toLowerCase().includes(palabra)
      )
      
    ).filter(producto=>producto.marca===opcionMarca)
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .slice(inicio, fin);
  }
   
    if(!isBoton){
      paginaActual = 1;
    }
  productosGrid.innerHTML = '';
  for (const producto of productosFiltrados) {
    const card = document.createElement('div');
    card.className = 'card w-100';
    
    const imagenProducto = document.createElement('img');
    // Establecer tamaño máximo y mínimo sin deformar la imagen
    imagenProducto.style.maxWidth = '290px';
    imagenProducto.style.maxHeight = '370px';
    imagenProducto.style.minHeight = '370px';

    const nombreProducto = document.createElement('h5');
    nombreProducto.style.fontWeight = 'bold';
    const categoria = document.createElement('p');
    const isTomoDoble = document.createElement('p');
    const precio = document.createElement('p');
    const cantidad = document.createElement('p');

    if (producto.cantidad === 0) {
      imagenProducto.className='sinStock';
      cantidad.textContent = "SIN STOCK";
    } else {
      cantidad.textContent = "STOCK: DISPONIBLE";
    }

    isTomoDoble.textContent="Tipo: "+producto.tipoTomo;

    imagenProducto.src = producto.urlImagen;        
    nombreProducto.textContent = producto.nombre + " -"+producto.marca+"-";
    precio.textContent = "Precio: $" + producto.precio;

    card.appendChild(imagenProducto);
    card.appendChild(nombreProducto);
    if(producto.categoria == "Mangas"){
      card.appendChild(isTomoDoble);
    }
    card.appendChild(precio);
    card.appendChild(cantidad);
    card.style.maxWidth = '310px';
    card.style.minWidth = '310px';
    card.style.maxHeight = '540px';
    
    productosGrid.appendChild(card);
    ajustarTamanioTexto(card);
  }
}

function ajustarTamanioTexto(card) {
  const cantidad = card.querySelector('p:last-child'); // Selecciona el último elemento <p> dentro de la card

  // Verifica si la cantidad se desborda verticalmente
  if (cantidad.offsetTop + cantidad.clientHeight > card.clientHeight) {
    const nombre = card.querySelector('h5'); // Selecciona el elemento que contiene el nombre
    const nuevoTamanio = 16; // Puedes ajustar este valor según tus preferencias

    // Aplica el nuevo tamaño de fuente al elemento que contiene el nombre
    nombre.style.fontSize = `${nuevoTamanio}px`;
    nombre.style.fontWeight = 'bold';
  }
}

function agregarEvento(id, evento, funcion) {
  var elemento = document.getElementById(id);
  if (elemento) {
      elemento.addEventListener(evento, funcion);
  } else {
      console.error("El elemento con ID '" + id + "' no fue encontrado.");
  }
}

function definirBotones(data){

  agregarEvento('VideojuegosMin', 'click', function() {
    recargarProductos(data,this);
  });

  agregarEvento('MangasMin','click', function() {
    recargarProductos(data,this);
  });

  agregarEvento('FigurasMin','click', function() {
    recargarProductos(data,this);
  });

  agregarEvento('OtrosMin','click', function() {
    recargarProductos(data,this);
  });
  agregarEvento('PapeleriaMin','click', function() {
    recargarProductos(data,this);
  });
};

function recargarProductos(data,elemento) {
  opcionSeleccionada= false;
  cambioCategoria=true;
  paginaActual = 1; 
  categoriaSeleccionada = elemento.getAttribute("data-id");
  mostrarProductos(data, 1);
  actualizarPaginador(data, '');
  const paginador = document.getElementById('pagination');
  const primerBoton = paginador.querySelector('.page-item:first-child');
  primerBoton.classList.add('active');
  searchInput.value = '';

}