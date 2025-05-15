import fs from 'fs';


/*
Este archivo permite tener una clase ProductManager que tiene todos
los metodos para los productos usando Json y promesas.

getProducts: Lee el archivo de productos y devolver todos los productos en formato de arreglo.
getProductById: Busca el producto con el id especificado en el archivo Json products.
addProduct: Agrega un producto nuevo.
saveProduct: Escribe en el archivo Json el producto.
updateProduct: Modifica un producto especifico.
deleteProductById: Elimina un producto especifico.
*/

const fsPromises = fs.promises

class ProductManager {

    constructor(fileNameProducts) {
        this.fileNameProducts = fileNameProducts;
    }

    async getProducts() {
        try {
            const dataProducts = await fsPromises.readFile(this.fileNameProducts, 'utf-8');
            return dataProducts ? JSON.parse(dataProducts) : []

        } catch (error) {
            if (error.code === 'ENOENT') {
                //CREANDO EL ARCHIVO PORQUE NO EXISTE...
                await fsPromises.writeFile(this.fileNameProducts, JSON.stringify([]));
                return [];
            }
            console.error(`Error al Leer el archivo de datos.${error}`)
        }
    }
    async getProductById(pid) {

        const products = await this.getProducts();
        const product = products.find((p) => p.id === pid);
        return product || null;
    }
    async addProduct(product) {

        const products = await this.getProducts();
        if (products.includes(p => p.code === product.code))
            throw new Error("El codigo del producto ya existe")
        const newproduct = {
            id: products.length ? products[products.length - 1].id + 1 : 1,
            ...product
        }
        products.push(newproduct);
        await this.saveProduct(products);
        return newproduct;

    }
    async saveProduct(product) {
        try {
            await fsPromises.writeFile(this.fileNameProducts, JSON.stringify(product, null, 2));
        } catch (error) {
            console.error("Error al guardar products", error);
        }
    }
    async updateProduct(id, product) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex((p) => p.id === id)
            if (index === -1) {
                console.log("producto no existe")
                return null;
            }
            else {
                products[index] = { ...products[index], ...product }
                await this.saveProduct(products);
                return products[index];
            }
        } catch (error) {
            console.error("error al actualizar el producto", error);
        }
    }
    async deleteProductById(pid) {
        try {
            const products = await this.getProducts();
            const productsnew = products.filter((p) => p.code != pid);
            if (productsnew.length === products.length) return null;
            await this.saveProduct(productsnew);
            return true;
        } catch (error) {
            console.log("error: deleteProductById", error);
        }
    }
}


export default ProductManager;