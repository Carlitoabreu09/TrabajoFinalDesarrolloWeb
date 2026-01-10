// --- FUNCIONES DE PRODUCTOS ---
async function guardarProducto(e) {
    e.preventDefault();
    const datos = {
        codigo: document.getElementById('codigoInput').value,
        nombre: document.getElementById('nombreInput').value,
        precio: document.getElementById('precioInput').value,
        cantidad: document.getElementById('cantidadInput').value
    };

    const res = await fetch('/api/productos/agregar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos)
    });
    if (res.ok) { alert("Producto Agregado"); loadPage('listadoproductos.html'); }
}

// --- FUNCIONES DE CLIENTES ---
async function guardarCliente(e) {
    e.preventDefault();
    const datos = {
        codigo: document.getElementById('codigoCli').value,
        nombre: document.getElementById('nombreCli').value,
        direccion: document.getElementById('direccionCli').value,
        telefono: document.getElementById('telefonoCli').value,
        rnc: document.getElementById('rncCli').value
    };

    const res = await fetch('/api/clientes/agregar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos)
    });
    if (res.ok) { alert("Cliente Agregado"); loadPage('listadoclientes.html'); }
}

// --- DELEGACIÓN DE EVENTOS PARA BOTONES ---
document.addEventListener('click', (e) => {
    if (e.target.id === 'btnGuardarProducto') guardarProducto(e);
    if (e.target.id === 'btnGuardarCliente') guardarCliente(e);
});
