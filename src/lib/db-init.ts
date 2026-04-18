import { getPool, sql } from "./db";

/** Creates web schema tables if they don't exist and seeds initial data */
export async function initDatabase(): Promise<void> {
  const pool = await getPool();

  // Create schema
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'web')
      EXEC('CREATE SCHEMA web')
  `);

  // Videos table
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='web' AND TABLE_NAME='VIDEOS')
    BEGIN
      CREATE TABLE web.VIDEOS (
        Id          INT IDENTITY(1,1) PRIMARY KEY,
        Titulo      NVARCHAR(200) NOT NULL,
        Descripcion NVARCHAR(500) DEFAULT '',
        YoutubeUrl  NVARCHAR(300) NOT NULL,
        YoutubeId   NVARCHAR(50)  NOT NULL,
        Categoria   NVARCHAR(100) DEFAULT 'General',
        Activo      BIT DEFAULT 1,
        Orden       INT DEFAULT 0,
        CreadoEn    DATETIME DEFAULT GETDATE()
      )
      INSERT INTO web.VIDEOS (Titulo, Descripcion, YoutubeUrl, YoutubeId, Categoria, Orden) VALUES
        (N'Introducción al ERP SYB', N'Conoce las funcionalidades principales de nuestro sistema ERP empresarial.', 'https://youtu.be/jtvE_ZVWQpo', 'jtvE_ZVWQpo', 'ERP', 1),
        (N'Módulo de Inventarios', N'Aprende a gestionar tu inventario de forma eficiente con SYB ERP.', 'https://youtu.be/I6-yIpzVWH0', 'I6-yIpzVWH0', 'ERP', 2),
        (N'Reportes y Análisis', N'Genera reportes avanzados y analiza el desempeño de tu empresa.', 'https://youtu.be/903jtG2vwUY', '903jtG2vwUY', 'ERP', 3)
    END
  `);

  // Clients table
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='web' AND TABLE_NAME='CLIENTES')
    BEGIN
      CREATE TABLE web.CLIENTES (
        Id       INT IDENTITY(1,1) PRIMARY KEY,
        Nombre   NVARCHAR(200) NOT NULL,
        LogoUrl  NVARCHAR(500) DEFAULT '',
        Activo   BIT DEFAULT 1,
        Orden    INT DEFAULT 0,
        CreadoEn DATETIME DEFAULT GETDATE()
      )
    END
  `);

  // Team table
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='web' AND TABLE_NAME='EQUIPO')
    BEGIN
      CREATE TABLE web.EQUIPO (
        Id          INT IDENTITY(1,1) PRIMARY KEY,
        Nombre      NVARCHAR(200) NOT NULL,
        Cargo       NVARCHAR(200) DEFAULT '',
        Descripcion NVARCHAR(MAX) DEFAULT '',
        FotoUrl     NVARCHAR(500) DEFAULT '',
        LinkedIn    NVARCHAR(300) DEFAULT '',
        Activo      BIT DEFAULT 1,
        Orden       INT DEFAULT 0
      )
      INSERT INTO web.EQUIPO (Nombre, Cargo, Descripcion, Orden) VALUES
        (N'Luis Alejandro Solís R.', N'Co-Fundador · Software Engineer & Systems Administrator', N'Ingeniero en Informática Empresarial con más de 2 años liderando infraestructura tecnológica, desarrollo backend y administración de sistemas ERP en entornos productivos. Especialista en .NET Core, C#, APIs REST, SQL Server y Azure DevOps. Ha diseñado e implementado soluciones que automatizan procesos críticos, integrando sistemas ERP con bases de datos de alto rendimiento y desplegando arquitecturas en la nube bajo metodologías ágiles (Scrum/Kanban).', 1),
        (N'Josué Barboza S.', N'Co-Fundador · Full Stack Developer & DevOps Engineer', N'Ingeniero de software especializado en desarrollo web full stack e infraestructura de redes. Experto en diseño e implementación de sistemas escalables, gestión de servidores y redes empresariales (LAN/WAN, UniFi). Con dominio de Java, JavaScript, frameworks modernos y plataformas cloud, garantiza que cada solución sea segura, eficiente y preparada para crecer junto al negocio.', 2)
    END
  `);

  // Configuration table
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='web' AND TABLE_NAME='CONFIGURACION')
    BEGIN
      CREATE TABLE web.CONFIGURACION (
        Id        INT IDENTITY(1,1) PRIMARY KEY,
        Clave     NVARCHAR(100) NOT NULL UNIQUE,
        Valor     NVARCHAR(MAX) DEFAULT '',
        UpdatedAt DATETIME DEFAULT GETDATE()
      )
      INSERT INTO web.CONFIGURACION (Clave, Valor) VALUES
        ('whatsapp', '+506 87457877'),
        ('email', 'sybsolutionscr@gmail.com'),
        ('direccion', 'San José, Costa Rica'),
        ('facebook', ''),
        ('linkedin', ''),
        ('instagram', '')
    END
  `);
}
