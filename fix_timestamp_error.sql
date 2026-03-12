-- SCHNELLE KORREKTUR für TIMESTAMP-Fehler
-- Führen Sie diesen Code in phpMyAdmin aus, falls der Fehler auftritt

-- 1. Datenbank verwenden
USE inventory_db;

-- 2. Falls Tabellen bereits existieren, korrigieren:
ALTER TABLE user_sessions MODIFY COLUMN expires_at TIMESTAMP NULL;
ALTER TABLE users MODIFY COLUMN last_login TIMESTAMP NULL;
ALTER TABLE users MODIFY COLUMN locked_until TIMESTAMP NULL;

-- 3. Oder Tabellen neu erstellen (falls obiger Befehl nicht funktioniert):
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS login_history;
DROP TABLE IF EXISTS user_permissions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS permissions;

-- 4. Korrekte Tabellen-Erstellung:
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    full_name VARCHAR(100),
    company VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE login_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    username VARCHAR(50),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN,
    failure_reason VARCHAR(100),
    INDEX idx_user_id (user_id),
    INDEX idx_login_time (login_time),
    INDEX idx_success (success),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    permission_id INT NOT NULL,
    granted_by INT,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_permission (user_id, permission_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Test-Daten einfügen
INSERT INTO users (username, email, password_hash, role, full_name, company) VALUES
('admin', 'admin@inventorypro.com', '$2b$10$dummy.hash', 'admin', 'System Administrator', 'InventoryPro'),
('demo_kunde', 'kunde@example.com', '$2b$10$dummy.hash', 'customer', 'Demo Kunde', 'Beispiel GmbH');

INSERT INTO permissions (name, description) VALUES
('view_dashboard', 'Dashboard anzeigen'),
('upload_data', 'Excel/CSV-Dateien hochladen'),
('view_analytics', 'Analysen und Reports anzeigen'),
('export_data', 'Daten exportieren'),
('manage_users', 'Benutzer verwalten (nur Admin)'),
('system_settings', 'System-Einstellungen ändern (nur Admin)'),
('view_logs', 'System-Logs einsehen (nur Admin)'),
('database_access', 'Datenbankzugriff (nur Admin)');

-- 6. Berechtigungen zuweisen
INSERT INTO user_permissions (user_id, permission_id)
SELECT u.id, p.id FROM users u, permissions p WHERE u.username = 'admin';

INSERT INTO user_permissions (user_id, permission_id)
SELECT u.id, p.id FROM users u, permissions p 
WHERE u.username = 'demo_kunde' 
AND p.name IN ('view_dashboard', 'upload_data', 'view_analytics', 'export_data');

SELECT 'Korrektur abgeschlossen - Tabellen erfolgreich erstellt!' as status;
