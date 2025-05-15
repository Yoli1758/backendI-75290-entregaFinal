
import http from "http"
import express from 'express';
import mongoose from "mongoose";
import dotenv from 'dotenv'
import hbs from "express-handlebars"
import { Server } from 'socket.io';
import productsRouter from './router/products.router.js'
import cartsRouter from './router/carts.router.js'
import viewsRouter from './router/views.router.js'
import websockets from "./websockets.js";
import { config, conectionMongoDB } from './config/db.config.js'


import path from "path"
import { fileURLToPath } from 'url';
import ProductService from "./services/ProductService.js";
import CartService from "./services/CartService.js"


let useMongoDb;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);


//MidldleWare
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//configuracion handlebars
app.engine("handlebars", hbs.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + "/public"))

try {
    const connected = await conectionMongoDB();
    useMongoDb = !!connected;
    if (!connected) console.warn("⚠️ MongoDB not connected. Using JSON.");

} catch (error) {
    console.error("Error connecting to MongoDB", error);
    useMongoDb = false;

}

const productService = new ProductService(useMongoDb, __dirname, path)
const cartService = new CartService(useMongoDb);

websockets(io, productService)
app.use("/api/products", productsRouter(productService));
app.use("/api/carts", cartsRouter(cartService));
app.use("/", viewsRouter(productService))


httpServer.listen(config.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${config.PORT}`)
})

