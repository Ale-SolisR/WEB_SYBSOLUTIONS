import { getPool, sql } from "./db";

/** Creates all web schema tables if they don't exist and seeds initial data */
export async function initDatabase(): Promise<void> {
  const pool = await getPool();

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'web')
      EXEC('CREATE SCHEMA web')
  `);

  // ── VIDEOS ──────────────────────────────────────────────────────────────────
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
        (N'Introducción al ERP S&B', N'Conoce las funcionalidades principales de nuestro sistema ERP empresarial.', 'https://youtu.be/jtvE_ZVWQpo', 'jtvE_ZVWQpo', 'ERP', 1),
        (N'Módulo de Inventarios', N'Aprende a gestionar tu inventario de forma eficiente con S&B ERP.', 'https://youtu.be/I6-yIpzVWH0', 'I6-yIpzVWH0', 'ERP', 2),
        (N'Reportes y Análisis', N'Genera reportes avanzados y analiza el desempeño de tu empresa.', 'https://youtu.be/903jtG2vwUY', '903jtG2vwUY', 'ERP', 3)
    END
  `);

  // ── CLIENTES ─────────────────────────────────────────────────────────────────
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

  // ── EQUIPO ───────────────────────────────────────────────────────────────────
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
        (N'Luis Alejandro Solís R.', N'Co-Fundador · Software Engineer & Systems Administrator', N'Ingeniero en Informática Empresarial con más de 2 años liderando infraestructura tecnológica, desarrollo backend y administración de sistemas ERP en entornos productivos. Especialista en .NET Core, C#, APIs REST, SQL Server y Azure DevOps.', 1),
        (N'Josué Barboza S.', N'Co-Fundador · Full Stack Developer & DevOps Engineer', N'Ingeniero de software especializado en desarrollo web full stack e infraestructura de redes. Experto en diseño e implementación de sistemas escalables, gestión de servidores y redes empresariales (LAN/WAN, UniFi).', 2)
    END
  `);

  // ── SERVICIOS ────────────────────────────────────────────────────────────────
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='web' AND TABLE_NAME='SERVICIOS')
    BEGIN
      CREATE TABLE web.SERVICIOS (
        Id          INT IDENTITY(1,1) PRIMARY KEY,
        Titulo      NVARCHAR(200) NOT NULL,
        Descripcion NVARCHAR(500) NOT NULL,
        Icono       NVARCHAR(50)  DEFAULT 'Globe',
        Color       NVARCHAR(20)  DEFAULT '#3b82f6',
        Activo      BIT DEFAULT 1,
        Orden       INT DEFAULT 0
      )
      INSERT INTO web.SERVICIOS (Titulo, Descripcion, Icono, Color, Orden) VALUES
        (N'Desarrollo Web', N'Creamos páginas web y aplicaciones profesionales, modernas y optimizadas para tu negocio. Desde sitios informativos hasta plataformas empresariales complejas.', 'Globe', '#3b82f6', 1),
        (N'Servidores e Infraestructura', N'Instalación, configuración y administración de servidores. Implementamos soluciones robustas para garantizar la continuidad y seguridad de tu negocio.', 'Server', '#8b5cf6', 2),
        (N'Redes y Conectividad', N'Diseño, instalación y mantenimiento de redes empresariales. Garantizamos conectividad rápida, segura y confiable para toda tu organización.', 'Network', '#06b6d4', 3),
        (N'Reparación y Mejora de Equipos', N'Diagnóstico, reparación y actualización de equipos de cómputo. Maximizamos el rendimiento y vida útil de tu hardware al mejor costo.', 'Cpu', '#f59e0b', 4),
        (N'Capacitaciones Tecnológicas', N'Formación personalizada para tu equipo en herramientas tecnológicas, sistemas empresariales y mejores prácticas digitales para optimizar su trabajo.', 'GraduationCap', '#10b981', 5),
        (N'Soporte y Mantenimiento TI', N'Soporte técnico continuo y mantenimiento preventivo para asegurar el óptimo funcionamiento de toda tu infraestructura tecnológica.', 'Headphones', '#ef4444', 6)
    END
  `);

  // ── CONFIGURACION ─────────────────────────────────────────────────────────────
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='web' AND TABLE_NAME='CONFIGURACION')
    BEGIN
      CREATE TABLE web.CONFIGURACION (
        Id        INT IDENTITY(1,1) PRIMARY KEY,
        Clave     NVARCHAR(100) NOT NULL UNIQUE,
        Valor     NVARCHAR(MAX) DEFAULT '',
        UpdatedAt DATETIME DEFAULT GETDATE()
      )
    END
    -- Seed defaults if missing
    IF NOT EXISTS (SELECT 1 FROM web.CONFIGURACION WHERE Clave='whatsapp')
      INSERT INTO web.CONFIGURACION (Clave, Valor) VALUES ('whatsapp', '+506 87457877')
    IF NOT EXISTS (SELECT 1 FROM web.CONFIGURACION WHERE Clave='email')
      INSERT INTO web.CONFIGURACION (Clave, Valor) VALUES ('email', 'sybsolutionscr@gmail.com')
    IF NOT EXISTS (SELECT 1 FROM web.CONFIGURACION WHERE Clave='direccion')
      INSERT INTO web.CONFIGURACION (Clave, Valor) VALUES ('direccion', 'San José, Costa Rica')
    IF NOT EXISTS (SELECT 1 FROM web.CONFIGURACION WHERE Clave='facebook')
      INSERT INTO web.CONFIGURACION (Clave, Valor) VALUES ('facebook', '')
    IF NOT EXISTS (SELECT 1 FROM web.CONFIGURACION WHERE Clave='linkedin')
      INSERT INTO web.CONFIGURACION (Clave, Valor) VALUES ('linkedin', '')
    IF NOT EXISTS (SELECT 1 FROM web.CONFIGURACION WHERE Clave='instagram')
      INSERT INTO web.CONFIGURACION (Clave, Valor) VALUES ('instagram', '')
    IF NOT EXISTS (SELECT 1 FROM web.CONFIGURACION WHERE Clave='site_theme')
      INSERT INTO web.CONFIGURACION (Clave, Valor) VALUES ('site_theme', 'blue')
    IF NOT EXISTS (SELECT 1 FROM web.CONFIGURACION WHERE Clave='chatbot_prompt')
      INSERT INTO web.CONFIGURACION (Clave, Valor) VALUES ('chatbot_prompt', N'Eres un asistente virtual de S&B Solutions. Tu objetivo es presentar y vender el S&B ERP. Habla siempre en español, sé amigable y profesional. Cuando el cliente muestre interés, invítalo a agendar una demo o a contactarnos. WhatsApp: +506 87457877 | Email: sybsolutionscr@gmail.com')
    IF NOT EXISTS (SELECT 1 FROM web.CONFIGURACION WHERE Clave='hero_titulo')
      INSERT INTO web.CONFIGURACION (Clave, Valor) VALUES ('hero_titulo', N'Impulsa tu empresa con tecnología')
    IF NOT EXISTS (SELECT 1 FROM web.CONFIGURACION WHERE Clave='hero_subtitulo')
      INSERT INTO web.CONFIGURACION (Clave, Valor) VALUES ('hero_subtitulo', N'Software empresarial, infraestructura TI y desarrollo web de alto impacto. Soluciones hechas en Costa Rica para el mundo.')
  `);

  // ── CITAS ─────────────────────────────────────────────────────────────────────
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='web' AND TABLE_NAME='CITAS')
    BEGIN
      CREATE TABLE web.CITAS (
        Id             INT IDENTITY(1,1) PRIMARY KEY,
        Cedula         NVARCHAR(20)  NOT NULL,
        TipoCedula     NVARCHAR(20)  NOT NULL DEFAULT 'fisica',
        NombreCompleto NVARCHAR(200) NOT NULL,
        Email          NVARCHAR(200) NOT NULL,
        Telefono       NVARCHAR(30)  NOT NULL,
        FechaNac       DATE          NULL,
        FechaCita      DATE          NOT NULL,
        HoraCita       NVARCHAR(10)  NOT NULL,
        Nota           NVARCHAR(500) DEFAULT '',
        Estado         NVARCHAR(20)  DEFAULT 'pendiente',
        GoogleEventId  NVARCHAR(200) DEFAULT '',
        MeetLink       NVARCHAR(500) DEFAULT '',
        CreadoEn       DATETIME DEFAULT GETDATE()
      )
    END
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='web' AND TABLE_NAME='CITAS' AND COLUMN_NAME='MeetLink')
      ALTER TABLE web.CITAS ADD MeetLink NVARCHAR(500) DEFAULT ''
  `);
}
