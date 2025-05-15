import { Schema, model } from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "Products"

const productSchema = new Schema({
    title: {
        type: String,
        requiered: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,

    },
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: [String],
        required: true
    }
}, { versionKey: false })


productSchema.plugin(mongoosePaginate);

const productsModel = model(productsCollection, productSchema);
export  {productsModel,productsCollection};


