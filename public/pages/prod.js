
console.log("Cargando lógica de productos...");

// Función para agregar un producto
async function guardarProducto(event) {
    event.preventDefault(); // Evita que la página se recargue

    // Capturamos los datos del formulario (asegúrate de que los inputs tengan estos IDs)
    const datos = {
        nombre: document.getElementById('nombreProducto').value,
        proveedor: document.getElementById('proveedorProducto').value,
        precio: document.getElementById('precioProducto').value,
        cantidad: document.getElementById('cantidadProducto').value
    };

    // Enviamos los datos al SERVIDOR (server.js)
    const respuesta = await fetch('/api/productos/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    if (respuesta.ok) {
        alert("¡Producto guardado con éxito!");
    } else {
        alert("Error al guardar el producto");
    }
}

// Escuchar el clic del botón (si tu botón tiene id="btnGuardar")
// Nota: Usamos delegación de eventos porque tus páginas cargan dinámicamente
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'btnGuardarProducto') {
        guardarProducto(e);
    }
});