# Entrega Final
"*Desarrollar una vista que contemple pagination de mongoose, contemplar el archivo de env*" 
"*garantizar si no hay conexion remota con mongoose utilizar mongoose local*"
"*en la paginacion se contempla limit, query por category,page y sort*"
"*se crean 4 endpoint para /carts para eliminar un producto del carrito, eliminar todos los *"
"*todos los productos del carrito, modificar la cantidad de un producto, reemplazar un carrito*"
"*por un arreglo de productos pasados por body.*"

--- 
## 🛠️ Tecnologias utilizadas
- 


---

## 📂 Estructura
📂/Entrega2
    📂/src
        📂/config
            db.config.js
        📂/managers
            ProductManager.js
            CartManager.js
        📂/models
            carts.model.js
            products.model.js
        📂/public
            📂/img
            styles.css    
            realtimeproducts.js
        📂/router
            📂/seed
                catalogoProducts.json
            products.router.js
            carts.router.js
            views.router.js
        📂/services
            CartService.js
            ProductService.js
        📂/views
            📂/layouts
                main.handlebars
            home.handlebars
            realTimeProducts.handlebars
    app.js
    websockets.js
.env
products.json
carts.json

---
## 🚀 Instalación

Sigue estos pasos para configurar el proyecto en tu máquina local:

### Clona el repositorio
```bash
git clone https://github.com/Yoli1758/backendI-75290-entregaFinal.git

instala dependecias
npm init -y
npm install express
npm install express-handlebars
npm install socket.io
npm install mongoose
npm install dotenv
npm install mongoose-paginate-v2
npm install -g nodemon

crea el archivo .env en la raiz y coloca las variables de entorno proporcionadas.

Ejecuta el proyecto
nodemon app.js


```

# Caracteristicas
. Gestion de peticion con postman



📞 **Contacto**

Autor: Espinoza Yolimar

Email: yolimar.espinoza868ar@gmail.com

GitHub: Yoli1758

