import ProductManager from "../managers/ProductManager.js";
import { config } from "../config/db.config.js";
import { PaginationParameters } from 'mongoose-paginate-v2';
import {productsModel} from "../models/products.model.js"
import fs from 'fs';




class ProductService {

    constructor(useMongo, dirname, path) {
        console.log(`estoy en el constructor de ProductService ${useMongo}`)
        this.useMongo = useMongo;
        this.fileManager = new ProductManager('products.json')
        this.dirname = dirname;
        this.path = path;
    }

    // async getProducts(req = { query: {} }) {
    async getProducts(req = {}) {

        const queryParams = (req && typeof req.query === 'object') ? req.query : req;
        let queryfilter = {}

        if (queryParams.query) {
            try {
                queryfilter = JSON.parse(queryParams.query)
            } catch (error) {
                console.error(" Error al parsear la query de categorias", error);
                return { status: "error", message: "queryfilter" }
            }
        }

        if (this.useMongo) {

            let sortOption = {};
            if (queryParams.sort === 'asc') {
                sortOption.price = 1;
            } else if (queryParams.sort === 'desc') {
                sortOption.price = -1;
            }

            const customLabels = {
                totalDocs: 'totalDocs',
                docs: 'payload',
                limit: 'limit',
                page: 'currentPage',
                totalPages: 'totalPages',
                nextPage: 'nextPage',
                prevPage: 'prevPage',
                hasNextPage: 'hasNextPage',
                hasPrevPage: 'hasPrevPage'
            };

            const [_, options] = new PaginationParameters({ query: queryParams }).get();
    
            try {
                const response = await productsModel.paginate(
                    queryfilter,
                    {
                        ...options,
                        sort: sortOption,
                        lean: true,
                        customLabels
                    }
                );


                let prevLink = null;
                let nextLink = null;

                const baseLink = `${config.PATH_PRODUCTS}/?${queryParams.query ? `query=${encodeURIComponent(queryParams.query)}&` : ''}${queryParams.sort ? `sort=${queryParams.sort}&` : ''}${queryParams.limit ? `limit=${queryParams.limit}&` : ''}`;

                if (response.hasPrevPage) prevLink = `${baseLink}page=${response.prevPage}`;
                if (response.hasNextPage) nextLink = `${baseLink}page=${response.nextPage}`;

                delete response.offset;
                response.status = "success";
                response.prevLink = prevLink;
                response.nextLink = nextLink;

                return response
            } catch (error) {
                console.error("❌ Error al obtener productos paginados desde MongoDB:", error);
                return { status: "error", message: "Error al cargar productos desde MongoDB" };
            }

        } else {

            const allProducts = await this.fileManager.getProducts();

            let productsFilter = allProducts;

            if (queryfilter.category) {
                productsFilter = productsFilter.filter(p => p.category === queryfilter.category);
            }

            if (queryParams.sort === 'asc') {
                productsFilter.sort((a, b) => a.price - b.price);
            } else if (queryParams.sort === 'desc') {
                productsFilter.sort((a, b) => b.price - a.price);
            }
            const currentPage = parseInt(queryParams.page) || 1;
            const limit = parseInt(queryParams.limit) || 10;
            const totalDocs = allProducts.length;
            const totalPages = Math.ceil(totalDocs / limit);
            const start = (currentPage - 1) * limit;
            const end = start + limit;

            const payload = productsFilter.slice(start, end);
            const hasPrevPage = currentPage > 1;
            const hasNextPage = currentPage < totalPages;

            const baseLink = `${config.PATH_PRODUCTS}?${queryParams.query ? `query=${encodeURIComponent(queryParams.query)}&` : ''}${queryParams.sort ? `sort=${queryParams.sort}&` : ''}${limit ? `limit=${limit}&` : ''}`;

            return {
                payload,
                totalDocs,
                limit,
                currentPage,
                totalPages,
                hasPrevPage,
                hasNextPage,
                status: "success",
                prevLink: hasPrevPage ? `${baseLink}page=${currentPage - 1}` : null,
                nextLink: hasNextPage ? `${baseLink}page=${currentPage + 1}` : null,
            }
        }
    }


    async getProductById(pid) {
        if (this.useMongo) {
            return await productsModel.findById(pid);
        } else {
            return await this.fileManager.getProductById(pid)
        }
    }

    async addProduct(product) {
        if (this.useMongo) {
            return await productsModel.create(product)
        } else {
            return await this.fileManager.addProduct(product)
        }
    }

    async updateProduct(id, product) {
        if (this.useMongo) {
            return await productsModel.findByIdAndUpdate(id, product, { new: true })
        } else {
            return await this.fileManager.updateProduct(id, product)
        }
    }

    async deleteProductByCode(code) {
        if (this.useMongo) {
            return await productsModel.findOneAndDelete(code)
        } else {
            return await this.fileManager.deleteProductById(code)
        }
    }

    async fillPrductsBD() {
        try {
            await productsModel.deleteMany({});
            const filePath = this.path.join(this.dirname, "./router/seed/catalogoProducts.json");
        
            const rowData = await fs.promises.readFile(filePath, "utf-8");
            const jsonData = JSON.parse(rowData);

            const inserted = await productsModel.insertMany(jsonData);
            console.log(`✅ Se insertaron ${inserted.length} productos.`);
            return inserted;

        } catch (error) {
            console.error("❌ Error en fillProducts:", error);
            throw error;
        }
    }
}

export default ProductService;