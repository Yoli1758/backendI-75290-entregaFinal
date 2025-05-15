const socket = io();


let auxPage = 1;
document.addEventListener("DOMContentLoaded", () => {

    const addProductForm = document.getElementById("add-product-form");
    const contenedorProductos = document.querySelector(".table");

    socket.on("productList", (data) => {

        const { payload, hasPrevPage, hasNextPage, prevPage, nextPage, currentPage } = data;

        const products = payload;

        if (!products) {

            if (contenedorProductos) {
                contenedorProductos.innerHTML = `
                        <div class="productoNoDisponible">
                            <p>No hay productos disponibles.</p>
                            <img src="/img/ojostristes.png" alt="sinProductos">
                        </div>
                `;
            }
            return;
        }


        if (contenedorProductos) {
            contenedorProductos.innerHTML = `
            <div class="table-header">

            <div class="table-cell cell-product">Producto</div>
            <div class="table-cell cell-description">Descripción</div>
            <div class="table-cell cell-code">Código</div>
            <div class="table-cell cell-price">Precio</div>
            <div class="table-cell cell-category">Categoria</div>
            <div class="table-cell cell-stock">Stock</div>
            <div class="table-cell cell-action">Accion</div>
        </div>

        <div id="product-table-body">
    
        </div>
        <div id="product-table-page">

        </div>
            `;
        }
        const productList = document.getElementById("product-table-body");
        productList.innerHTML = "";



        products.forEach((product) => {
            const nuevoProducto = document.createElement("div");
            nuevoProducto.classList = "table-row";


            const thumbnails = product.thumbnails.map(thumbnails => {
                return `<img src="${thumbnails}" alt="${product.title}">`;
            }).join('');

            nuevoProducto.innerHTML = `
                
                    <div class="table-cell cell-product">
                            <div class="product-content"> 
                                <span>${product.title}</span>
                                
                                <img src="${product.thumbnails[0] || '/img/agotado.jpg'}" alt="${product.title}">
                        
                            </div>
                    </div>
        
                        <div class="table-cell cell-description">${product.description}</div>
                        <div class="table-cell cell-code">${product.code}</div>
                        <div class="table-cell cell-price">$${product.price}</div>
                        <div class="table-cell cell-category">${product.category}</div>
                        <div class="table-cell cell-stock">${product.stock}</div>
                        <div class="table-cell cell-action">
                            <button class="deleteProduct" data-id="${product.code}">🗑️</button>
                        </div>
        
                `;
            productList.appendChild(nuevoProducto);

        });


        console.log("proximapage", nextPage)
        const paginationContainer = document.getElementById("product-table-page");
        paginationContainer.innerHTML = `
          ${hasPrevPage ? `<button id="prevPage">⬅️ Anterior</button>` : ""}
          <span>Página actual: ${currentPage}</span>
          ${hasNextPage ? `<button id="nextPage">Siguiente ➡️</button>` : ""}
        `;
        if (hasPrevPage) {
            document.getElementById("prevPage").addEventListener("click", () => {
                if (auxPage > 1) {
                    auxPage--;
                    socket.emit("getProductsByPage", { page: auxPage });
                }

            });
        }
        if (hasNextPage) {
            document.getElementById("nextPage").addEventListener("click", () => {
                auxPage++;
                socket.emit("getProductsByPage", { page: auxPage });
            });
        }

    })


    contenedorProductos.addEventListener("click", (e) => {
        if (e.target.classList.contains("deleteProduct")) {
            const productCode = e.target.getAttribute("data-id");

            Swal.fire({
                title: "Esta Seguro de Eliminar el producto?",
                icon: "warning",
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Aceptar"
            }).then((result) => {
                if (result.isConfirmed) {
                    socket.emit("deleteProduct", productCode)
                    Swal.fire({
                        title: "Eliminado",
                        text: "Producto eliminado Exitosamente",
                        icon: "success"
                    });
                }
            });
        }
    });


    addProductForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newProduct = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            code: document.getElementById("code").value,
            price: document.getElementById("price").value,
            stock: document.getElementById("stock").value,
            category: document.getElementById("category").value,
            thumbnails: document.getElementById("thumbnails").value.split(",").map(img => img.trim()),
        };

        const statusValue = document.getElementById("status").value;

        if (statusValue !== "") {
            newProduct.status = statusValue;
        }
        socket.emit("addProduct", newProduct);

        Swal.fire({

            icon: "success",
            title: "Agregado",
            text: "Producto agregado exitosamente!",
            showConfirmButton: false,
            timer: 1500
        });
        addProductForm.reset();
    })

})


