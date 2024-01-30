    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js";
    import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

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
    const datosProducto = document.getElementById('datosProducto');

    // Realiza una consulta SELECT simple
    onValue(usuariosRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Productos stock:", data);

      for (let key in data){
        if(data.hasOwnProperty(key)){
          const producto = data[key];
          
          const nombreProducto = document.createElement('h5')
          const categoria = document.createElement('p')
          const descripcion = document.createElement('p')
          const valor = document.createElement('p')
          const stock = document.createElement('p')
                
          nombreProducto.textContent = producto.nombre;
          categoria.textContent = producto.categoria;
          descripcion.textContent = producto.descripcion;
          valor.textContent = producto.valor;
          stock.textContent = producto.stock;

          datosProducto.appendChild(nombreProducto, categoria, descripcion, valor, stock)
  
        }
      }
    });

    // Iterar sobre los datos y mostrar la informacion del producto
    

