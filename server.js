import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import path from 'path';
import sql from 'mssql'; // Importamos la librería para SQL Server

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// --- CONFIGURACIÓN DE BASE DE DATOS ---
const dbConfig = {
    user: 'tu_usuario', // Cambia por tu usuario de SQL
    password: 'tu_password', // Cambia por tu contraseña
    server: 'localhost', 
    database: 'NeoPharmTECH', // Nombre de la base de datos en tu archivo .sql
    options: {
        encrypt: false, 
        trustServerCertificate: true
    }
};

// Middleware para que el servidor entienda datos JSON enviados desde el JS
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- RUTAS DE NAVEGACIÓN ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// --- FUNCIONALIDADES DE BASE DE DATOS (Tus módulos) ---

// 1. Buscar Productos (Referencia image_462de3.png)
app.get('/api/productos/buscar', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input('termino', sql.VarChar, `%${req.query.q}%`)
            .query('SELECT * FROM Productos WHERE Nombre LIKE @termino OR Codigo LIKE @termino');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Agregar Cliente con validación de RNC (Referencia image_462e1f.png)
app.post('/api/clientes', async (req, res) => {
    const { nombre, direccion, telefono, rnc } = req.body;
    
    // Validación: El RNC es obligatorio para facturas con crédito fiscal
    if (!rnc) {
        return res.status(400).json({ error: "El RNC es necesario para comprobantes fiscales." });
    }

    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('dir', sql.VarChar, direccion)
            .input('tel', sql.VarChar, telefono)
            .input('rnc', sql.VarChar, rnc)
            .query('INSERT INTO Clientes (Nombre, Direccion, Telefono, RNC) VALUES (@nombre, @dir, @tel, @rnc)');
        res.json({ success: true, message: "Cliente guardado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CONFIGURACIÓN DEL PUERTO ---
app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), () => {
  console.log(`Server running on => http://localhost:${app.get("port")}`);
});