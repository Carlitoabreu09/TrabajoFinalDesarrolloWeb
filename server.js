import express from "express";
import path, { dirname } from "path"; // Solo una vez aquí
import { fileURLToPath } from "url";
import sql from "mssql";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbConfig = {
    server: 'localhost',
    database: 'NEOPharmTechDB',
    options: { encrypt: false, trustServerCertificate: true }
};

// --- RUTAS DE PRODUCTOS ---
app.get('/api/productos/listar', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query("SELECT ProductoID as id, CodigoBarras as codigo, Nombre as nombre, PrecioVenta as precio, StockActual as cantidad FROM Productos WHERE Activo = 1");
        res.json(result.recordset);
    } catch (err) { res.status(500).json(err); }
});

app.post('/api/productos/agregar', async (req, res) => {
    const { codigo, nombre, precio, cantidad } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('CodigoBarras', sql.NVarChar, codigo)
            .input('Nombre', sql.NVarChar, nombre)
            .input('PrecioVenta', sql.Decimal, precio)
            .input('StockInicial', sql.Int, cantidad)
            .execute('sp_GestionarProducto'); // Usa tu SP de la base de datos
        res.json({ success: true });
    } catch (err) { res.status(500).json(err); }
});

// --- RUTAS DE CLIENTES (NUEVO) ---
// Nota: Debes crear la tabla 'Clientes' en tu SQL si aún no existe
app.get('/api/clientes/listar', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query("SELECT * FROM Clientes");
        res.json(result.recordset);
    } catch (err) { res.status(500).json(err); }
});

app.post('/api/clientes/agregar', async (req, res) => {
    const { codigo, nombre, direccion, telefono, rnc } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .query(`INSERT INTO Clientes (Codigo, Nombre, Direccion, Telefono, RNC) 
                    VALUES ('${codigo}', '${nombre}', '${direccion}', '${telefono}', '${rnc}')`);
        res.json({ success: true });
    } catch (err) { res.status(500).json(err); }
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));