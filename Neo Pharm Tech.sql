USE neo_pharm_tech;
GO

-- ==============================================
-- PRODUCTS
-- ==============================================
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'UX_products_code' AND object_id = OBJECT_ID('products'))
    DROP INDEX UX_products_code ON products;
GO

CREATE UNIQUE INDEX UX_products_code
ON products(code)
WHERE code IS NOT NULL;
GO

-- ==============================================
-- PROVIDERS
-- ==============================================
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'UX_providers_code' AND object_id = OBJECT_ID('providers'))
    DROP INDEX UX_providers_code ON providers;
GO

CREATE UNIQUE INDEX UX_providers_code
ON providers(code)
WHERE code IS NOT NULL;
GO

-- ==============================================
-- CLIENTS
-- ==============================================
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'UX_clients_code' AND object_id = OBJECT_ID('clients'))
    DROP INDEX UX_clients_code ON clients;
GO

CREATE UNIQUE INDEX UX_clients_code
ON clients(code)
WHERE code IS NOT NULL;
GO

-- ==============================================
-- INVOICES
-- ==============================================
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'UX_invoices_code' AND object_id = OBJECT_ID('invoices'))
    DROP INDEX UX_invoices_code ON invoices;
GO

CREATE UNIQUE INDEX UX_invoices_code
ON invoices(code)
WHERE code IS NOT NULL;
GO

PRINT 'Todos los índices UNIQUE corregidos correctamente. Triggers pueden generar códigos sin errores.'
