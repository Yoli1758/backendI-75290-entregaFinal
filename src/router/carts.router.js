import { Router } from "express";

/*------------------------------------------------------------------
Archivo que contiene todos los endpoints requeridos para el carrito.
-------------------------------------------------------------------*/


const router = Router();


function cartsRouter(cartService) {

    //crea un Carrito
    router.post("/", async (req, resp) => {
        try {
            const newCart = await cartService.createCart();
            resp.status(201).json({ mensage: `"carrito ${newCart.id} creado satisfactoriamente" ` });
        } catch (error) {
            resp.status(500).json({ error: "Error al crear el carrito" });
        }
    })

    //lista los productos que pertenecen al carrito con el cid proporcionado. (con populate)
    router.get("/:cid", async (req, resp) => {
        const cid = req.params.cid;
        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) {
                return resp.status(404).json({ error: "Carrito no encontrado" })
            }
            resp.json({ products: cart.products })
        } catch (error) {
            resp.status(500).json({ error: `Error al obtener el carrito con ID ${cid}` });
        }
    })

    //Agrega un producto al carrito
    router.post("/:cid/products/:pid", async (req, resp) => {
        const cid = req.params.cid;
        const pid = req.params.pid;
        try {
            const updatedCart = await cartService.addProductToCart(cid, pid);
            if (!updatedCart) {
                return resp.status(404).json({ error: "Carrito no encontrado o producto no válido" });
            }
            resp.json({ message: `Producto ${pid} agregado al carrito ${cid}`, cart: updatedCart });
        } catch (error) {
            resp.status(500).json({ error: `Error al agregar el producto ${pid} al carrito ${cid}` });
        }
    });

    //Elimina un producto del carrito.
    router.delete("/:cid/products/:pid", async (req, resp) => {
        const cid = req.params.cid;
        const pid = req.params.pid;
        try {
            const updatedCart = await cartService.deleteProductFromCart(cid, pid);
            if (!updatedCart) {
                return resp.status(404).json({ error: "Carrito no encontrado o el producto no existe en el carrito" });
            }
            resp.json({ message: `Producto ${pid} eliminado del carrito ${cid}`, cart: updatedCart });
        } catch (error) {
            resp.status(500).json({ error: `Error al eliminar el producto ${pid} del carrito ${cid}` });
        }
    })

    // Actualizar todos los productos del carrito con un arreglo de productos
    router.put("/:cid", async (req, resp) => {
        const cid = req.params.cid;
        const products = req.body;

        try {
            const updCart = await cartService.updateCartProducts(cid, products);
            console.log(`Carrito ${cid} actualizado`,  updCart);
            resp.json({ message: `Carrito ${cid} actualizado`, cart: updCart });
        } catch (error) {
            console.log("Error desde endpoint:", error.message);
            resp.status(400).json({ error: error.message });
        }
    });

    // Actualizar la cantidad de ejemplares del producto
    router.put("/:cid/products/:pid", async (req, resp) => {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity);
            if (!updatedCart) {
                return resp.status(404).json({ error: "Carrito no encontrado o el producto no existe en el carrito" });
            }
            resp.json({ message: `Cantidad del producto ${pid} en el carrito ${cid} actualizada`, cart: updatedCart });
        } catch (error) {
            resp.status(500).json({ error: `Error al actualizar la cantidad del producto ${pid} en el carrito ${cid}` });
        }
    });

    // Eliminar todos los productos del carrito
    router.delete("/:cid", async (req, resp) => {
        const cid = req.params.cid;
        try {
            const updatedCart = await cartService.clearCart(cid);
            if (!updatedCart) {
                return resp.status(404).json({ error: "Carrito no encontrado" });
            }
            resp.json({ message: `Se eliminaron todos los productos del carrito ${cid}`, cart: updatedCart });
        } catch (error) {
            resp.status(500).json({ error: `Error al eliminar los productos del carrito ${cid}` });
        }
    });
    return router
}

export default cartsRouter;
