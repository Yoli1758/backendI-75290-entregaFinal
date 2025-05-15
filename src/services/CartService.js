import CartManager from '../managers/CartManager.js'
import ProductManager from "../managers/ProductManager.js";
import { cartsModel } from '../models/carts.model.js'
import { productsModel } from '../models/products.model.js';

class CartService {

    constructor(useMongo) {
        console.log(`estoy en el constructor de CartService ${useMongo}`)
        this.useMongo = useMongo;
        this.cartManager = new CartManager('carts.json')
        this.productManager = new ProductManager("products.json");
    }


    //crea  un carrito vacio
    async createCart() {
        try {
            if (this.useMongo) {
                return await cartsModel.create({ products: [] })
            }
            else {
                return await this.cartManager.addCart();
            }
        } catch (error) {
            console.error("Error al crear el carrito:", error);
        }
    }

    //obtiene un carrito por ID y utiliza populate('products.product)
    //para traer la informacion completa de los productos.
    //si trabajamos con json lista los productos que pertenecen al carrito con el cid proporcionado.

    async getCartById(cid) {
        try {
            if (this.useMongo) {
                return await cartsModel.findById(cid).populate('products.product').lean();
            } else {
                return await this.cartManager.getProductsCartById(cid);
            }
        } catch (error) {
            console.error(`Error al obtener el carrido con ID: ${cid}:`, error);
        }
    }

    //agrega un producto al carrito o incrementa su cantidad si ya existe
    async addProductToCart(cid, pid) {
        try {

            if (this.useMongo) {

                const cart = await cartsModel.findById(cid);
                if (!cart) {
                    return null
                }

                const exists = cart.products.find(item => item.product.toString() === pid)

                if (exists) {
                    exists.quantity++;
                } else {
                    cart.products.push({ product: pid, quantity: 1 })
                }
                await cart.save();
                return cart;
            } else {
                const products = await this.productManager.getProducts();
                const product = products.find((p) => p.id === parseInt(pid));
                if (!product) {
                    return null
                }
                return await this.cartManager.addProductCart(cid, pid);
            }
        } catch (error) {
            console.error(`Error al agregar producto ${pid} al carrito ${cid}:`, error);
            throw error;
        }
    }

    //elimina un producto especifico del carrito
    async deleteProductFromCart(cid, pid) {
        try {
            if (this.useMongo) {
                const cart = await cartsModel.findByIdAndUpdate(
                    cid, { $pull: { products: { product: pid } } }, { new: true }).populate('products.product');
                return cart;
            } else {
                return await this.cartManager.deleteProductCart(cid, pid);
            }
        } catch (error) {
            console.error(`Error al eliminar producto ${pid} del carrito ${cid}:`, error);
            throw error;
        }
    }

    //reemplaza todos los productos del carrito con el array proporcionado.
    async updateCartProducts(cid, products) {
        // try {
            if (this.useMongo) {
                console.log(products)

                const invalidStructure = products.filter(p => !p.product || !p.quantity);
                if (invalidStructure.length > 0) {
                    throw new Error('Todos los productos deben tener `product` y `quantity`');
                }

                const productIds = products.map(p => p.product);
                const existingProducts = await productsModel.find({ _id: { $in: productIds } });
                const existingProductIds = existingProducts.map(p => p._id.toString());

                const invalidProducts = productIds.filter(id => !existingProductIds.includes(id));
                if (invalidProducts.length > 0) {
                    throw new Error(`Los siguientes productos no existen: ${invalidProducts.join(", ")}`);

                }

                const updatedCart = await cartsModel.findByIdAndUpdate(
                    cid,
                    { $set: { products } },
                    { new: true }
                );

                if (!updatedCart) {
                    throw new Error(`Carrito con id ${cid} no encontrado`);
                }

                const cart = await cartsModel.findById(cid).populate('products.product');

                return cart;

            } else {
                return await this.cartManager.updateProductCart(cid, products);
            }

        // } catch (error) {
        //     console.log(`Error al actualizar los productos del carrito ${cid}:`, error.message);

        // }
    }

    //actualiza la cantidad de un producto especifico en el carrito
    async updateProductQuantity(cid, pid, quantity) {
        try {
            if (this.useMongo) {
                const cart = await cartsModel.findOneAndUpdate(
                    { _id: cid, 'products.product': pid },
                    { $set: { 'products.$.quantity': quantity } },
                    { new: true }).populate('products.product');
                return cart;
            } else {
                return await this.cartManager.updateProductQuantityCart(cid, pid, quantity);
            }

        } catch (error) {
            console.error(`Error al actualizar la cantidad del producto ${pid} en el carrito ${cid}:`, error);
            throw error;
        }
    }

    //Elimina todos los productos del carrito.
    async clearCart(cid) {
        try {
            if (this.useMongo) {
                const cart = await cartsModel.findByIdAndUpdate(
                    cid,
                    { $set: { products: [] } },
                    { new: true }
                );
                return cart;
            } else {
                return await this.cartManager.deleteProductsCart(cid);
            }

        } catch (error) {
            console.error(`Error al eliminar todos los productos del carrito ${cid}:`, error);
            throw error;
        }
    }

}
export default CartService;