import { Router } from "express"


export default function viewsRouter(productService) {
    const router = Router();

    router.get("/realtimeproducts", async (req, resp) => {
        try {
            const productsResult = await productService.getProducts(req);
            //  console.log("🚀 Productos recibidos para renderizar:", productsResult.payload)
            resp.render("realTimeProducts", {
                products: productsResult.payload || [],

                page: productsResult.currentPage,
                totalPages: productsResult.totalPages,
                hasPrevPage: productsResult.hasPrevPage,
                hasNextPage: productsResult.hasNextPage,
                prevPage: productsResult.prevPage,
                nextPage: productsResult.nextPage,
                currentPage: productsResult.currentPage,
                prevLink: productsResult.prevLink,
                nextLink: productsResult.nextLink,

            });
        } catch (error) {
            resp.status(500).send("Error al cargar los productos");
        }

    });

    router.get("/", async (req, resp) => {
        try {

            const productsResult = await productService.getProducts(req);
            //  console.log("🚀 Productos recibidos para renderizar:", products.payload)
            resp.render("home", {
                products: productsResult.payload || [],

                page: productsResult.currentPage,
                totalPages: productsResult.totalPages,
                hasPrevPage: productsResult.hasPrevPage,
                hasNextPage: productsResult.hasNextPage,
                prevPage: productsResult.prevPage,
                nextPage: productsResult.nextPage,
                currentPage: productsResult.currentPage,
                prevLink: productsResult.prevLink,
                nextLink: productsResult.nextLink,

            });

        } catch (error) {
            resp.status(500).send("Error al cargar los productos");
        }
    });

    //endpoint para cargar productos del Json a la bd

    //  router.get("/seed", async (req, resp) => {

    //     try {
    //         const allProducts = await productService.fillPrductsBD();
    //         resp.status(200).json({
    //             status: "success",
    //             message: "Executed seed",
    //             inserted: allProducts.length
    //         });

    //     } catch (error) {
    //         console.log("error to insert data on database");
    //         resp.status(500).json({ status: "error to seeding" });

    //     }
    // });

    return router;
}