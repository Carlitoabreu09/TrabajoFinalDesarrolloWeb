sql
-- Crear la tabla Clientes
CREATE TABLE Clientes (
    ClienteID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL,
    Apellido VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    Telefono VARCHAR(20),
    Direccion VARCHAR(255)
);

-- Crear la tabla Artículos
CREATE TABLE Artículos (
    ArticuloID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) NOT NULL,
    Precio DECIMAL(10, 2) NOT NULL,
    Descripcion TEXT
);

-- Crear la tabla Facturas
CREATE TABLE Facturas (
    FacturaID INT PRIMARY KEY IDENTITY(1,1),
    ClienteID INT NOT NULL,
    FechaFactura DATE NOT NULL,
    ImporteTotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID)
);

-- Crear la tabla Facturas_Articulos (Tabla de unión muchos a muchos)
CREATE TABLE Facturas_Articulos (
    FacturaID INT NOT NULL,
    ArticuloID INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (FacturaID, ArticuloID)
);

-- Crear la tabla Pagos
CREATE TABLE Pagos (
    PagoID INT PRIMARY KEY IDENTITY(1,1),
    FacturaID INT NOT NULL,
    ClienteID INT NOT NULL,
    Importe DECIMAL(10, 2) NOT NULL,
    FechaPago DATE NOT NULL,
    MetodoPago VARCHAR(50),
    FOREIGN KEY (FacturaID) REFERENCES Facturas(FacturaID),
    FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID)
);

-- Ejemplo de consultas

-- 1. Insertar un cliente
INSERT INTO Clientes (Nombre, Apellido, Email, Telefono, Direccion)
VALUES ('Juan', 'Pérez', 'juan.perez@example.com', '123-456-7890', 'Calle Falsa 123');

-- 2. Insertar un artículo
INSERT INTO Artículos (Nombre, Precio, Descripcion)
VALUES ('Camiseta', 25.99, 'Camiseta de algodón');

-- 3. Insertar una factura
INSERT INTO Facturas (ClienteID, FechaFactura, ImporteTotal)
VALUES (1, '2023-10-26', 100.00);

-- 4. Insertar un artículo en la factura
INSERT INTO Facturas_Articulos (FacturaID, ArticuloID, Cantidad, PrecioUnitario)
VALUES (1, 1, 2, 25.99);

-- 5. Insertar un pago
INSERT INTO Pagos (FacturaID, ClienteID, Importe, FechaPago, MetodoPago)
VALUES (1, 1, 100.00, '2023-10-27', 'Tarjeta de Crédito');

-- 6. Obtener todas las facturas de un cliente
SELECT *
FROM Facturas
WHERE ClienteID = 1;

-- 7. Obtener el total de una factura específica
SELECT SUM(fa.Cantidad * fa.PrecioUnitario) AS TotalFactura
FROM Facturas_Articulos fa
JOIN Facturas f ON fa.FacturaID = f.FacturaID
WHERE f.FacturaID = 1;

-- 8. Obtener todos los artículos de una factura específica
SELECT a.*
FROM Artículos a
JOIN Facturas_Articulos fa ON a.ArticuloID = fa.ArticuloID
JOIN Facturas f ON fa.FacturaID = f.FacturaID
WHERE f.FacturaID = 1;

-- 9.  Obtener el listado de facturas por cliente y fechas
SELECT *
FROM Facturas
WHERE ClienteID = 1
ORDER BY FechaFactura;