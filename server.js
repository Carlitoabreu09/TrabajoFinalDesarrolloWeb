import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import sql from "mssql";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// ... resto del código
// 2. CONFIGURACIÓN IMPORTANTE
app.use(express.json()); // Para que el servidor entienda datos JSON enviados por fetch
app.use(express.static(path.join(__dirname, 'public')));

// 3. CONFIGURACIÓN DE TU BASE DE DATOS (Pon tus datos aquí)
const dbConfig = {
    server: 'localhost',
    database: 'NEOPharmTechDB',
    options: {
        encrypt: false, 
        trustServerCertificate: true 
    }
};

// 4. RUTA PARA RECIBIR DATOS DESDE PROD.JS
app.post('/api/productos/agregar', async (req, res) => {
    const { nombre, proveedor, precio, cantidad } = req.body;

    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('proveedor', sql.VarChar, proveedor)
            .input('precio', sql.Decimal, precio)
            .input('cantidad', sql.Int, cantidad)
            .query(`INSERT INTO Productos (Nombre, Proveedor, Precio, Cantidad) 
                    VALUES (@nombre, @proveedor, @precio, @cantidad)`);
        
        res.json({ success: true, message: "Producto guardado en la base de datos" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), () => {
  console.log(`Server running on => http://localhost:${app.get("port")}`);
});