import fs from 'fs';
const fsPromises = fs.promises


/*
Este manager CarManager permite tener una clase todos metodos
requeridos para el carrito para mi localStorage usando promesas

addCart:  Agrega un carrito nuevo.
getCarts: Obtiene todos los carritos existentes
getProductsCartById: Obtiene los Productos de un carrito especifico.
addProductCart: Agrega un producto pid a un carrito cid.
deleteProductCart: Elimina un producto pid a un carrito cid.
updateProductCart: Modifica los productos del carrito.
updateProductQuantityCart: Modifica Quantity del producto del carrito especifico.
deleteProductsCart: Elimina los productos de un carrito.
saveCart: Guarda el carrito en el archivo json.
 */


class CartManager {

    constructor(fileNameCart) {
        this.fileNameCart = fileNameCart;
    }

    async addCart() {

        const carts = await this.getCarts();

        const newCart = {
            id: carts.length ? carts[carts.length - 1].id + 1 : 1,
            productos: []
        }
        carts.push(newCart);
        await this.saveCart(carts);
        return newCart;
    }

    async getCarts() {
        try {
            const dataCarts = await fsPromises.readFile(this.fileNameCart, 'utf-8');
            return dataCarts ? JSON.parse(dataCarts) : []

        } catch (error) {
            if (error.code === 'ENOENT') {
                //CREANDO EL ARCHIVO PORQUE NO EXISTE...
                await fsPromises.writeFile(this.fileNameCart, JSON.stringify([]));
                return [];
            }
            console.error(`Error al Leer el archivo de datos del carrito.${error}`)
        }
    }

    async getProductsCartById(cid) {
        const carts = await this.getCarts();
        const productCarts = carts.find((cart) => cart.id === parseInt(cid));
        return productCarts || null;
    }

    async addProductCart(cid, pid) {
        const carts = await this.getCarts();
        console.log(carts)
        const index = carts.findIndex((p) => p.id === parseInt(cid))
        if (index === -1) {
            console.log("carrito no existe")
            return null;
        }

        const cart = carts[index];
        const existProduct = cart.products.find((productid) => parseInt(productid.product) === parseInt(pid))

        if (existProduct)
            existProduct.quantity += 1;
        else {
            cart.products.push({ product: parseInt(pid), quantity: 1 });
        }

        await this.saveCart(carts);
        return cart;

    }

    async deleteProductCart(cid, pid) {
        const carts = await this.getCarts();
        const index = carts.findIndex((car) => car.id === parseInt(cid))
        console.log(index)
        if (index === -1) {
            console.log("carrito no existe")
            return null;
        }

        const cart = carts[index];
        const cartLength = cart.products.length;

        cart.products = cart.products.filter(product => product.product !== parseInt(pid))


        if (cartLength === cart.products.length) return null

        carts[index] = cart;

        await this.saveCart(carts)
        return cart;
    }

    async updateProductCart(cid, products) {
        const carts = await this.getCarts();
        const index = carts.findIndex((car) => car.id === parseInt(cid))
        if (index === -1) {
            console.log("carrito no existe")
            return null;
        }
        const parsearProducts = products.map((p) => ({
            product: parseInt(p.product),
            quantity: parseInt(p.quantity)
        }))
        carts[index].products = parsearProducts;
        await this.saveCart(carts)
        return carts[index];
    }

    async updateProductQuantityCart(cid, pid, quantity) {
        const carts = await this.getCarts();
        const index = carts.findIndex((car) => car.id === parseInt(cid))
        if (index === -1) {
            console.log("carrito no existe")
            return null;
        }

        const cart = carts[index];

        const productIndex = cart.products.findIndex(product => product.product === parseInt(pid))
        if (productIndex === -1) {
            console.log("producto no existe en ese Carrito")
            return null;
        }
        cart.products[productIndex].quantity = parseInt(quantity);
        await this.saveCart(carts)
        return cart;
    }

    async deleteProductsCart(cid) {
        const carts = await this.getCarts();
        const index = carts.findIndex((car) => car.id === parseInt(cid))
        if (index === -1) {
            console.log("carrito no existe")
            return null;
        }
        carts[index].products = [];
        await this.saveCart(carts);
        return carts[index];
    }
    async saveCart(carts) {
        try {
            await fsPromises.writeFile(this.fileNameCart, JSON.stringify(carts, null, 2));
        } catch (error) {
            console.error("Error al guardar carrito", error);
        }
    }
}

export default CartManager;