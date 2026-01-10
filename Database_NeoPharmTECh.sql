--- CREACI�N DE LA BASE DE DATOS
USE master;
GO

IF EXISTS (SELECT * FROM sys.databases WHERE name = 'NEOPharmTechDB')
BEGIN
    DROP DATABASE NEOPharmTechDB; -- Borra la base si ya existe para empezar de cero
END
GO

CREATE DATABASE NEOPharmTechDB;
GO

USE NEOPharmTechDB;
GO

--- CREACI�N DE TABLAS (En orden de dependencia)

-- Tabla Categor�as
CREATE TABLE Categorias (
    CategoriaID INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL,
    Descripcion NVARCHAR(200)
);
GO

-- Tabla Proveedores
CREATE TABLE Proveedores (
    ProveedorID INT IDENTITY(1,1) PRIMARY KEY,
    NombreEmpresa NVARCHAR(100) NOT NULL,
    NombreContacto NVARCHAR(100),
    Telefono NVARCHAR(20),
    Email NVARCHAR(100)
);
GO

-- Tabla Productos
CREATE TABLE Productos (
    ProductoID INT IDENTITY(1,1) PRIMARY KEY,
    CodigoBarras NVARCHAR(50) UNIQUE, 
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(255),
    CategoriaID INT FOREIGN KEY REFERENCES Categorias(CategoriaID),
    ProveedorID INT FOREIGN KEY REFERENCES Proveedores(ProveedorID),
    PrecioCompra DECIMAL(10, 2) NOT NULL,
    PrecioVenta DECIMAL(10, 2) NOT NULL,
    StockActual INT DEFAULT 0,
    StockMinimo INT DEFAULT 5, 
    FechaVencimiento DATE, 
    Activo BIT DEFAULT 1
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

-- Tabla Encabezado Ventas
CREATE TABLE Ventas (
    VentaID INT IDENTITY(1,1) PRIMARY KEY,
    FechaVenta DATETIME DEFAULT GETDATE(),
    EmpleadoID INT FOREIGN KEY REFERENCES Empleados(EmpleadoID),
    TotalVenta DECIMAL(10, 2) DEFAULT 0,
    MetodoPago NVARCHAR(20) 
);
GO

-- Tabla Detalle Ventas
CREATE TABLE DetalleVentas (
    DetalleID INT IDENTITY(1,1) PRIMARY KEY,
    VentaID INT FOREIGN KEY REFERENCES Ventas(VentaID),
    ProductoID INT FOREIGN KEY REFERENCES Productos(ProductoID),
    Cantidad INT NOT NULL,
    PrecioUnitarioAplicado DECIMAL(10, 2) NOT NULL,
    Subtotal AS (Cantidad * PrecioUnitarioAplicado) PERSISTED
);
GO

--- CREACI�N DE PROCEDIMIENTOS ALMACENADOS

-- SP: Gestionar Producto (Crear o Actualizar)
CREATE PROCEDURE sp_GestionarProducto
    @CodigoBarras NVARCHAR(50),
    @Nombre NVARCHAR(100),
    @CategoriaID INT,
    @ProveedorID INT,
    @PrecioCompra DECIMAL(10,2),
    @PrecioVenta DECIMAL(10,2),
    @StockInicial INT,
    @FechaVencimiento DATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM Productos WHERE CodigoBarras = @CodigoBarras)
    BEGIN
        UPDATE Productos
        SET StockActual = StockActual + @StockInicial,
            PrecioCompra = @PrecioCompra,
            PrecioVenta = @PrecioVenta,
            FechaVencimiento = @FechaVencimiento
        WHERE CodigoBarras = @CodigoBarras;
    END
    ELSE
    BEGIN
        INSERT INTO Productos (CodigoBarras, Nombre, CategoriaID, ProveedorID, PrecioCompra, PrecioVenta, StockActual, FechaVencimiento)
        VALUES (@CodigoBarras, @Nombre, @CategoriaID, @ProveedorID, @PrecioCompra, @PrecioVenta, @StockInicial, @FechaVencimiento);
    END
END
GO

-- SP: Iniciar Venta
CREATE PROCEDURE sp_IniciarVenta
    @EmpleadoID INT,
    @MetodoPago NVARCHAR(20),
    @VentaID INT OUTPUT 
AS
BEGIN
    INSERT INTO Ventas (EmpleadoID, MetodoPago, TotalVenta)
    VALUES (@EmpleadoID, @MetodoPago, 0);
    SET @VentaID = SCOPE_IDENTITY();
END
GO

-- SP: Agregar Producto a Venta
CREATE PROCEDURE sp_AgregarProductoVenta
    @VentaID INT,
    @ProductoID INT,
    @Cantidad INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @PrecioActual DECIMAL(10,2);
    DECLARE @StockActual INT;

    SELECT @PrecioActual = PrecioVenta, @StockActual = StockActual 
    FROM Productos WHERE ProductoID = @ProductoID;

    IF @StockActual >= @Cantidad
    BEGIN
        BEGIN TRANSACTION;
        BEGIN TRY
            INSERT INTO DetalleVentas (VentaID, ProductoID, Cantidad, PrecioUnitarioAplicado)
            VALUES (@VentaID, @ProductoID, @Cantidad, @PrecioActual);

            UPDATE Productos 
            SET StockActual = StockActual - @Cantidad 
            WHERE ProductoID = @ProductoID;

            UPDATE Ventas
            SET TotalVenta = TotalVenta + (@Cantidad * @PrecioActual)
            WHERE VentaID = @VentaID;

            COMMIT TRANSACTION;
        END TRY
        BEGIN CATCH
            ROLLBACK TRANSACTION;
            THROW;
        END CATCH
    END
    ELSE
    BEGIN
        RAISERROR('Stock insuficiente.', 16, 1);
    END
END
GO

-- SP: Reporte Stock Bajo
CREATE PROCEDURE sp_ReporteStockBajo
AS
BEGIN
    SELECT p.Nombre, p.StockActual, p.StockMinimo, prov.NombreEmpresa
    FROM Productos p
    JOIN Proveedores prov ON p.ProveedorID = prov.ProveedorID
    WHERE p.StockActual <= p.StockMinimo
    ORDER BY p.StockActual ASC;
END
GO

--- DATOS DE PRUEBA (SEMILLA)

-- Insertar datos base
INSERT INTO Categorias (Nombre) VALUES ('Analg�sicos'), ('Antibi�ticos');
INSERT INTO Proveedores (NombreEmpresa, NombreContacto) VALUES ('Droguer�a Nacional', 'Juan Perez');
INSERT INTO Empleados (Nombre, Apellido, Rol) VALUES ('Ana', 'Gomez', 'Farmac�utica');

-- Insertar producto de prueba
EXEC sp_GestionarProducto '77001', 'Paracetamol 500mg', 1, 1, 1.50, 3.00, 100, '2026-12-31';
GO

PRINT '�Base de datos NEOPharmTech creada exitosamente!';
-- Tabla Clientes
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Clientes')
BEGIN
    CREATE TABLE Clientes (
        ClienteID INT IDENTITY(1,1) PRIMARY KEY,
        Codigo NVARCHAR(50),
        Nombre NVARCHAR(100),
        Direccion NVARCHAR(255),
        Telefono NVARCHAR(20),
        RNC NVARCHAR(20)
    );
END
GO