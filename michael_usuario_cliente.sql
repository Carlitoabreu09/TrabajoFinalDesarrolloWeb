
------------------- michael ---------------------------------------
-- tabla de usuarios    
Create Table Usuarios (
    UsuarioID INT IDENTITY(1,1) PRIMARY KEY,
    NombreUsuario NVARCHAR(50) UNIQUE NOT NULL,
    ContrasenaHash NVARCHAR(255) NOT NULL,
    Rol NVARCHAR(20) NOT NULL
);
GO


-- Tabla Empleados
CREATE TABLE Empleados (
    EmpleadoID INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL,
    Apellido NVARCHAR(50) NOT NULL,
    Rol NVARCHAR(30) 
);
GO

-- tavbla Clientes
CREATE TABLE Clientes (
    ClienteID INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL,
    Apellido NVARCHAR(50) NOT NULL,
    Telefono NVARCHAR(20),
    Email NVARCHAR(100)
);
GO


-- crud  usarios y  empleados 


-- sp crear usuario
CREATE PROCEDURE sp_CrearUsuario
    @NombreUsuario NVARCHAR(50),
    @Contrasena NVARCHAR(100),
    @Rol NVARCHAR(20)
AS
BEGIN
    DECLARE @ContrasenaHash NVARCHAR(255);
    SET @ContrasenaHash = HASHBYTES('SHA2_256', @Contrasena);

    INSERT INTO Usuarios (NombreUsuario, ContrasenaHash, Rol)
    VALUES (@NombreUsuario, @ContrasenaHash, @Rol);
END
GO

-- sp crear empleado
CREATE PROCEDURE sp_CrearEmpleado
    @Nombre NVARCHAR(50),
    @Apellido NVARCHAR(50),
    @Rol NVARCHAR(30)
AS
BEGIN
    INSERT INTO Empleados (Nombre, Apellido, Rol)
    VALUES (@Nombre, @Apellido, @Rol);
END
GO

-- sp obtener empleado por id
CREATE PROCEDURE sp_ObtenerEmpleadoPorID
    @EmpleadoID INT
AS
BEGIN
    SELECT *
    FROM Empleados
    WHERE EmpleadoID = @EmpleadoID;
END

GO

-- sp obtener todos los empleados
CREATE PROCEDURE sp_ObtenerTodosEmpleados
AS
BEGIN
    SELECT *
    FROM Empleados;
END
GO

-- sp actualizar empleado
CREATE PROCEDURE sp_ActualizarEmpleado
    @EmpleadoID INT,
    @Nombre NVARCHAR(50),
    @Apellido NVARCHAR(50),
    @Rol NVARCHAR(30)
AS
BEGIN
    UPDATE Empleados
    SET Nombre = @Nombre,
        Apellido = @Apellido,
        Rol = @Rol
    WHERE EmpleadoID = @EmpleadoID;
END
GO
-- sp eliminar empleado
CREATE PROCEDURE sp_EliminarEmpleado
    @EmpleadoID INT
AS
BEGIN
    DELETE FROM Empleados
    WHERE EmpleadoID = @EmpleadoID;
END
GO

--  obtener todos los usuarios join empleados
CREATE PROCEDURE sp_ObtenerTodosUsuarios
AS
BEGIN
    SELECT u.UsuarioID, u.NombreUsuario, u.Rol, e.Nombre, e.Apellido
    FROM Usuarios u
    LEFT JOIN Empleados e ON u.UsuarioID = e.EmpleadoID;
END
GO




-- sp login



CREATE PROCEDURE sp_Login
    @NombreUsuario NVARCHAR(50),
    @Contrasena NVARCHAR(100)
AS
BEGIN
    DECLARE @ContrasenaHash NVARCHAR(255);

    SELECT @ContrasenaHash = ContrasenaHash
    FROM Usuarios
    WHERE NombreUsuario = @NombreUsuario;

    IF @ContrasenaHash IS NOT NULL AND HASHBYTES('SHA2_256', @Contrasena) = @ContrasenaHash
    BEGIN
        SELECT 'Login exitoso' AS Mensaje;
    END
    ELSE
    BEGIN
        SELECT 'Nombre de usuario o contrase a incorrectos' AS Mensaje;
    END
END
GO

--  crud sp  clientes

-- crear cliente
CREATE PROCEDURE sp_CrearCliente
    @Nombre NVARCHAR(50),
    @Apellido NVARCHAR(50),
    @Telefono NVARCHAR(20),
    @Email NVARCHAR(100)
AS
BEGIN
    INSERT INTO Clientes (Nombre, Apellido, Telefono, Email)
    VALUES (@Nombre, @Apellido, @Telefono, @Email);
END
GO
 --- leer cliente por id
CREATE PROCEDURE sp_ObtenerClientePorID
    @ClienteID INT
AS
BEGIN
    SELECT *
    FROM Clientes
    WHERE ClienteID = @ClienteID;
END
GO

-- leer todos los clientes
CREATE PROCEDURE sp_ActualizarCliente
    @ClienteID INT,
    @Nombre NVARCHAR(50),
    @Apellido NVARCHAR(50),
    @Telefono NVARCHAR(20),
    @Email NVARCHAR(100)
AS
BEGIN
    UPDATE Clientes
    SET Nombre = @Nombre,
        Apellido = @Apellido,
        Telefono = @Telefono,
        Email = @Email
    WHERE ClienteID = @ClienteID;
END
GO
-- eliminar cliente
CREATE PROCEDURE sp_EliminarCliente
    @ClienteID INT
AS
BEGIN
    DELETE FROM Clientes
    WHERE ClienteID = @ClienteID;
END
GO

-- listar todos los clientes
CREATE PROCEDURE sp_ObtenerTodosClientes
AS
BEGIN
    SELECT *
    FROM Clientes;
END
GO

----------------------------------- michael ---------------------------------------

