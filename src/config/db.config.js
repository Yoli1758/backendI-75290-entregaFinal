import dotenv from 'dotenv'
import path from "path"
import mongoose from 'mongoose'

dotenv.config({ path: path.resolve(process.cwd(), '.env') });


export const config = {
    PORT: process.env.PORT || 8080,
    PATH_PRODUCTS: process.env.PATH_PRODUCTS,
    MONGO_URI: process.env.MONGO_URI || null,
    LOCAL_MONGO_URI: "mongodb://127.0.0.1:27017/products",
};

export async function conectionMongoDB(dbName = 'Products') {

    const tryConnect = async (uri, label) => {
        try {
            await mongoose.connect(uri, { dbName })
            console.log(`🎉 MongoDB connected succesfully to ${label}`)
            return true;
        } catch (error) {
            console.log(`❌ Failed to connection to ${label}:${error.message}`)
            return false;
        }

    }


    if (config.MONGO_URI && await tryConnect(config.MONGO_URI, "Conection Mongo URI Remoto")) {
        return true;
    }

    if (await tryConnect(config.LOCAL_MONGO_URI, "Conection Mongo URI LOCAL")) {
        return true;
    }
    console.log("🚨 with out Conextion MONGODB is using local JSON storage.");
    return false;
}

