import { Router } from "express";


const router = Router();


function productsRouter(productService) {

    //lista todos los productos de la base de datos.
    router.get("/", async (req, resp) => {
        try {
            const productsResult = await productService.getProducts(req);
               !productsResult ? resp.status(404).json({ error: "Cargando los productos" }) : resp.json({ products: productsResult })
            // resp.render("home", {
            //     products: productsResult.payload || [],

            //     page: productsResult.currentPage,
            //     totalPages: productsResult.totalPages,
            //     hasPrevPage: productsResult.hasPrevPage,
            //     hasNextPage: productsResult.hasNextPage,
            //     prevPage: productsResult.prevPage,
            //     nextPage: productsResult.nextPage,
            //     currentPage: productsResult.currentPage,
            //     prevLink: productsResult.prevLink,
            //     nextLink: productsResult.nextLink,})

        } catch (error) {
            console.error("Error al obtener productos:", error);
            resp.status(500).json({ error: "Error al cargar los productos" });
        }
    })
    //trae solo el producto con el id proporcionado.
    router.get("/:pid", async (req, resp) => {
        const pid = req.params.pid;
        console.log("el id proporcionado es pid:", pid)
        try {

            const product = await productService.getProductById(pid);
            if (!product)
                resp.status(404).json({ error: "Producto no encontrado" });
            else
                resp.json({ product: product })
        } catch (error) {
            console.error(`Error al obtener producto con ID ${pid}:`, error);
            resp.status(500).json({ error: "Error al obtener el producto" });
        }

    })
    //agregar un nuevo producto con los siguientes campos: id autoincrement,title,description,code,price,status,stock,category,thumbnails
    router.post("/", async (req, resp) => {

        try {
            const { title, description, code, price, status, stock, category, thumbnails } = req.body;
            const productData = { title, description, code, price, stock, category, thumbnails }

            if (status !== undefined && status !== '') {
                productData.status = status.toLowerCase() === 'true';
            }
            console.log("producto a agregar", productData)
            if (!title || !description || !code || !price || !category || !thumbnails)
                resp.status(400).json("Todos los campos son obligatorios...");
            else {
                const newProduct = await productService.addProduct(productData);
                resp.status(201).json({ mensaje: "Producto Agregado", product: newProduct })

            }
        } catch (error) {
            console.error("Error al agregar producto:", error);
            resp.status(400).json({ error: error.message })
        }
    })


    //Actualiza un producto por los campos enviados desde el body
    router.put("/:pid", async (req, resp) => {

        const pid = req.params.pid;
        const updateData = req.body;
        try {
            const updateProduct = await productService.updateProduct(pid, updateData);
            if (!updateProduct) {
                resp.status(404).json({ error: "Producto no Encontrado" })
            } else {
                resp.json({ mensaje: "Producto actualizado", product: updateProduct })
            }
        } catch (error) {
            console.error(`Error al actualizar producto con ID ${pid}:`, error);
            resp.status(500).json({ error: "Error al actualizar el producto" });
        }

    })

    //Elimina el producto con el pid indicado.
    router.delete("/:pid", async (req, resp) => {

        const pid = parseInt(req.params.pid);
        try {
            const deleteProduct = await productService.deleteProductById(pid);
            if (deleteProduct) {
                resp.status(200).json("producto eliminado satisfactoriamente")
            } else {
                resp.status(404).json({ error: "Producto no encontrado" });
            }
        } catch (error) {
            console.error(`Error al eliminar producto con ID ${pid}:`, error);
            resp.status(500).json({ error: "Error al eliminar el producto" });
        }

    })
    return router;

}

export default productsRouter;

