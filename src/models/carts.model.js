import { Schema, model } from "mongoose"
import { productsCollection } from "./products.model.js";

const cartsCollection = "carts"

const cartsSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: productsCollection,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            }
        }]


}, { versionKey: false })
export const cartsModel = model(cartsCollection, cartsSchema);