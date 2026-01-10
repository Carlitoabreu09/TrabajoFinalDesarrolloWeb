//#region controllers ------------------------------------------------------------------

//create  user controller
async function createUser(userData) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('NombreUsuario', sql.VarChar, userData.username)
            .input('Contrasena', sql.VarChar, userData.password)
            .input('Rol', sql.VarChar, userData.role)
            .execute('sp_CrearUsuario');
        return result.recordset;
    } catch (err) {
        console.error('Create User Error: ', err);
        throw err;
    }
}


// create  empeado controller
async function createEmpleado(empleadoData) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Nombre', sql.VarChar, empleadoData.nombre)
            .input('Apellido', sql.VarChar, empleadoData.apellido)
            .input('rol', sql.VarChar, empleadoData.cargo)
            .execute('sp_CrearEmpleado');
        return result.recordset;
    } catch (err) {
        console.error('Create Empleado Error: ', err);
        throw err;
    }
}

//buscar usuario por id
async function getUserById(userId) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('UsuarioID', sql.Int, userId)
            .query('SELECT * FROM Usuarios WHERE UsuarioID = @UsuarioID');
        return result.recordset;
    } catch (err) {
        console.error('Get User By ID Error: ', err);
        throw err;
    }
}

// sp emplazado por id
async function getEmpleadoById(empleadoId) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('EmpleadoID', sql.Int, empleadoId)
            .execute('sp_ObtenerEmpleadoPorID');
        return result.recordset;
    } catch (err) {
        console.error('Get Empleado By ID Error: ', err);
        throw err;
    }
}


// sp borrar empleado por id
async function deleteEmpleadoById(empleadoId) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('EmpleadoID', sql.Int, empleadoId)
            .execute('sp_EliminarEmpleado');
        return result.recordset;
    } catch (err) {
        console.error('Delete Empleado By ID Error: ', err);
        throw err;
    }
}

// login  controller
async function login(username, password) {
    try {   
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('NombreUsuario', sql.VarChar, username)
            .input('Contrasena', sql.VarChar, password)
            .execute('sp_Login');
        return result.recordset;
    } catch (err) {
        console.error('Login Error: ', err);
        throw err;
    }   
}

// create ventas controller
async function createVenta(ventaData) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('EmpleadoID', sql.Int, ventaData.clienteId)
            .input('MetodoPago', sql.VarChar, ventaData.metodoPago)
            .execute('sp_IniciarVenta');
         result.recordset;

         // si se crea insertar  detalle  de vntas
         if (result.recordset.length > 0) {
            const ventaId = result.recordset[0].VentaID;
            for (const item of ventaData.detalles) {
                await pool.request()
                    .input('VentaID', sql.Int, ventaId)
                    .input('ProductoID', sql.Int, item.productoId)
                    .input('Cantidad', sql.Int, item.cantidad)
                    .execute('sp_AgregarProductoVenta');
            }
            }
        return result.recordset;
    } catch (err) {
        console.error('Create Venta Error: ', err);
        throw err;
    }
}

// get ventas controller
async function getVentas() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query('select * from Ventas');
        return result.recordset;
    } catch (err) {
        console.error('Get Ventas Error: ', err);
        throw err;
    }
}

//mostra venta s con detalles
async function getVentaConDetalles(ventaId) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('VentaID', sql.Int, ventaId)
            .query('SELECT v.VentaID, v.Fecha, v.MetodoPago, vd.ProductoID, vd.Cantidad ' +
                   'FROM Ventas v ' +
                   'JOIN VentaDetalles vd ON v.VentaID = vd.VentaID ' +
                   'WHERE v.VentaID = @VentaID');
        return result.recordset;
    } catch (err) {
        console.error('Get Venta Con Detalles Error: ', err);
        throw err;
    }
}
//#endregion controllers  ------------------------------------------------------------------



//#region routes ------------------------------------------------------------------
// login
const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await login(username, password);   
        res.json(user);

        //render login.html
        res.sendFile(path.join(__dirname, 'public', 'login.html'));

    } catch (err) {
        res.status(500).send('Login failed');
    }
});

//create user
app.post('/users', async (req, res) => {
    const userData = req.body;
    try {
        const user = await createUser(userData);
        res.json(user);
        res.sendFile(path.join(__dirname, 'public', 'register.html'));
    } catch (err) {
        res.status(500).send('Create User failed');
    }
});


// create empleado 
app.post('/empleados', async (req, res) => {
    const empleadoData = req.body;
    try {
        const empleado = await createEmpleado(empleadoData);
        res.json(empleado);
        res.sendFile(path.join(__dirname, 'public', 'empleados.html'));
    } catch (err) {
        res.status(500).send('Create Empleado failed');
    }
});


// listad de usuario  y empleado por id 
app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await getUserById(userId);
        res.json(user);
    } catch (err) {
        res.status(500).send('Get User failed');
    }

});

// empleado por id
app.get('/empleados/:id', async (req, res) => {
    const empleadoId = req.params.id;
    try {
        const empleado = await getEmpleadoById(empleadoId);
        res.json(empleado);
    }
    catch (err) {
        res.status(500).send('Get Empleado failed');
    }
});


// borrar empleado por id
app.delete('/empleados/:id', async (req, res) => {
    const empleadoId = req.params.id;
    try {
        const empleado = await deleteEmpleadoById(empleadoId);
        res.json(empleado);
    } catch (err) {
        res.status(500).send('Delete Empleado failed');
    }
});

// create venta
app.post('/ventas', async (req, res) => {
    const ventaData = req.body;
    try {
        const venta = await createVenta(ventaData);
        res.json(venta);
    } catch (err) {
        res.status(500).send('Create Venta failed');
    }
});

//get ventas html
app.get('/ventas', async (req, res) => {
    const ventas = await getVentas();
    console.log(ventas);
    res.json(ventas);

    //render ventas.html
    res.sendFile(path.join(__dirname, 'public', 'ventas.html'));
});

//#endregion routes ------------------------------------------------------------------
