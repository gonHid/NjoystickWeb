    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js";
    import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

    const categoriaSeleccionada = localStorage.getItem("idSeleccionada");

    // Configuración de Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyAlRRAIdjjV34f_4JJvrdpHDZCHLMRR7N8",
        authDomain: "njoystickbd.firebaseapp.com",
        databaseURL: "https://njoystickbd-default-rtdb.firebaseio.com/",
        projectId: "njoystickbd",
        storageBucket: "njoystickbd.appspot.com",
        messagingSenderId: "9313380979",
        appId: "1:9313380979:web:745bc3e16984d4d52b1806",
        measurementId: "G-S464MG8HZN"
      };

    // Inicializa Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    // Obtiene una referencia a la base de datos
    const database = getDatabase(app);
    const usuariosRef = ref(database, 'productos');

    //referencia al cuerpo del html

    var productosGrid = document.getElementById('productoGrid');

    // Realiza una consulta SELECT simple
    onValue(usuariosRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Productos stock:", data);
      productosGrid.innerHTML = '';
      for (let key in data){
        if(data.hasOwnProperty(key)){
          const producto = data[key];
          
          if(producto.categoria ===categoriaSeleccionada){
           
            const card = document.createElement('div')
            card.className = 'card w-100';
            const imagenProducto = document.createElement('img')
            const nombreProducto = document.createElement('h5')
            const categoria = document.createElement('p')
            const precio = document.createElement('p')
            const cantidad = document.createElement('p')
  
            imagenProducto.src = producto.urlImagen;
            
            nombreProducto.textContent = producto.nombre;
            categoria.textContent = producto.categoria;
            precio.textContent = producto.precio;
            cantidad.textContent = producto.cantidad;
  
            card.appendChild(imagenProducto)
            card.appendChild(nombreProducto)
            card.appendChild(categoria)
            card.appendChild(precio)
            card.appendChild(cantidad)

  
            productosGrid.appendChild(card)
          }
        }
      }
    });

    // Iterar sobre los datos y mostrar la informacion del producto
    

