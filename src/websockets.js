

export default (io, productService) => {

    //websockets


    io.on("connection", async (socket) => {
        console.log("Un nuevo cliente se ha conectado por WebSocket")
        console.log("ID del cliente: ", socket.id);


        const products = await productService.getProducts({ query: { page: 1, limit: 10 } });
        socket.emit("productList", products);

        socket.on('addProduct', async newProduct => {
            await productService.addProduct(newProduct);
            const updateProducts = await productService.getProducts({ query: { page: 1, limit: 10 } });
            io.emit('productList', updateProducts);
        })

        socket.on('deleteProduct', async code => {

            await productService.deleteProductByCode(code);
            const updateProducts = await productService.getProducts({ query: { page: 1, limit: 10 } });
            io.emit('productList', updateProducts);
        })

        socket.on("getProductsByPage", async (params) => {

            const products = await productService.getProducts(params);
            socket.emit("productList", products);

        });

    })


};