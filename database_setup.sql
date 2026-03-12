-- InventoryPro Analytics - Benutzer-Datenbank Setup
-- Einfache Anmeldungs-Verwaltung mit Admin und Kundennutzern

-- 1. Datenbank erstellen
CREATE DATABASE IF NOT EXISTS inventory_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE inventory_db;

-- 2. Benutzer-Tabelle
CREATE TABLE IF NOT EXISTS users (
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

-- 3. Login-Sessions Tabelle
CREATE TABLE IF NOT EXISTS user_sessions (
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

-- 4. Login-Verlauf Tabelle
CREATE TABLE IF NOT EXISTS login_history (
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

-- 5. Berechtigungen Tabelle
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Benutzer-Berechtigungen Zuordnung
CREATE TABLE IF NOT EXISTS user_permissions (
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

-- 7. Standard-Berechtigungen einfügen
INSERT INTO permissions (name, description) VALUES
('view_dashboard', 'Dashboard anzeigen'),
('upload_data', 'Excel/CSV-Dateien hochladen'),
('view_analytics', 'Analysen und Reports anzeigen'),
('export_data', 'Daten exportieren'),
('manage_users', 'Benutzer verwalten (nur Admin)'),
('system_settings', 'System-Einstellungen ändern (nur Admin)'),
('view_logs', 'System-Logs einsehen (nur Admin)'),
('database_access', 'Datenbankzugriff (nur Admin)')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- 8. Standard-Benutzer erstellen
-- WICHTIG: Passwörter in der Anwendung hashen!
INSERT INTO users (username, email, password_hash, role, full_name, company) VALUES
('admin', 'admin@inventorypro.com', '$2b$10$dummy.hash.replace.in.app', 'admin', 'System Administrator', 'InventoryPro'),
('demo_kunde', 'kunde@example.com', '$2b$10$dummy.hash.replace.in.app', 'customer', 'Demo Kunde', 'Beispiel GmbH')
ON DUPLICATE KEY UPDATE 
    email = VALUES(email),
    full_name = VALUES(full_name),
    company = VALUES(company);

-- 9. Admin-Berechtigungen zuweisen
INSERT INTO user_permissions (user_id, permission_id)
SELECT u.id, p.id 
FROM users u, permissions p 
WHERE u.username = 'admin'
ON DUPLICATE KEY UPDATE granted_at = CURRENT_TIMESTAMP;

-- 10. Kunden-Standard-Berechtigungen zuweisen
INSERT INTO user_permissions (user_id, permission_id)
SELECT u.id, p.id 
FROM users u, permissions p 
WHERE u.username = 'demo_kunde' 
AND p.name IN ('view_dashboard', 'upload_data', 'view_analytics', 'export_data')
ON DUPLICATE KEY UPDATE granted_at = CURRENT_TIMESTAMP;

-- 11. Views für einfache Abfragen
CREATE OR REPLACE VIEW v_user_overview AS
SELECT 
    u.id,
    u.username,
    u.email,
    u.role,
    u.full_name,
    u.company,
    u.active,
    u.last_login,
    u.created_at,
    COUNT(up.permission_id) as permission_count
FROM users u
LEFT JOIN user_permissions up ON u.id = up.user_id
GROUP BY u.id;

CREATE OR REPLACE VIEW v_user_permissions AS
SELECT 
    u.username,
    u.role,
    p.name as permission,
    p.description,
    up.granted_at
FROM users u
JOIN user_permissions up ON u.id = up.user_id
JOIN permissions p ON up.permission_id = p.id
ORDER BY u.username, p.name;

-- 12. Stored Procedure für Benutzer-Login
DELIMITER $$
CREATE PROCEDURE UserLogin(
    IN p_username VARCHAR(50),
    IN p_ip_address VARCHAR(45),
    IN p_user_agent TEXT,
    IN p_success BOOLEAN,
    IN p_failure_reason VARCHAR(100)
)
BEGIN
    DECLARE v_user_id INT DEFAULT NULL;
    
    -- Benutzer-ID finden
    SELECT id INTO v_user_id FROM users WHERE username = p_username LIMIT 1;
    
    -- Login-Verlauf eintragen
    INSERT INTO login_history (user_id, username, ip_address, user_agent, success, failure_reason)
    VALUES (v_user_id, p_username, p_ip_address, p_user_agent, p_success, p_failure_reason);
    
    -- Bei erfolgreichem Login
    IF p_success = TRUE AND v_user_id IS NOT NULL THEN
        UPDATE users SET 
            last_login = CURRENT_TIMESTAMP,
            login_attempts = 0,
            locked_until = NULL
        WHERE id = v_user_id;
    END IF;
    
    -- Bei fehlgeschlagenem Login
    IF p_success = FALSE AND v_user_id IS NOT NULL THEN
        UPDATE users SET 
            login_attempts = login_attempts + 1,
            locked_until = CASE 
                WHEN login_attempts >= 4 THEN DATE_ADD(NOW(), INTERVAL 15 MINUTE)
                ELSE locked_until
            END
        WHERE id = v_user_id;
    END IF;
END$$
DELIMITER ;

-- 13. Trigger für automatische Session-Bereinigung
DELIMITER $$
CREATE EVENT IF NOT EXISTS cleanup_expired_sessions
ON SCHEDULE EVERY 1 HOUR
DO
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
    DELETE FROM login_history WHERE login_time < DATE_SUB(NOW(), INTERVAL 90 DAY);
END$$
DELIMITER ;

-- Events aktivieren
SET GLOBAL event_scheduler = ON;

-- 14. Status-Check
SELECT 'Benutzer-Datenbank Setup abgeschlossen' as status;

-- Tabellen anzeigen
SHOW TABLES;

-- Benutzer-Übersicht
SELECT * FROM v_user_overview;

-- Standard-Anmeldedaten anzeigen
SELECT 
    'WICHTIG: Standard-Anmeldedaten' as hinweis,
    'admin / admin123' as admin_login,
    'demo_kunde / kunde123' as kunde_login,
    'Passwörter in der App hashen!' as wichtig;
