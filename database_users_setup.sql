-- InventoryPro Analytics - Benutzer-Authentifizierung Schema
-- Erstelle Benutzer-Tabelle für sicheres Login/Registration System

USE inventory_db;

-- Benutzer-Tabelle mit sicherer Passwort-Speicherung
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('admin', 'user', 'viewer') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    login_attempts INT DEFAULT 0,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_active (is_active)
);

-- Session-Tabelle für JWT Token Management
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    user_agent TEXT,
    ip_address VARCHAR(45),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token_hash),
    INDEX idx_expires (expires_at)
);

-- Standard Demo-Benutzer erstellen
-- admin: admin123 - Hash: $2b$12$Bunu0Nsb10GoR/67VdG5We3MIBF2tYFdJ5SkdR5tvdWkkNOE.I/Qu
-- demo: demo123 - Hash: $2b$12$kLncMRjJX4wZL6QBXuFagu.tqZLlHvaZy1RWFLmkvh74y9Y06GYQ.
INSERT IGNORE INTO users (username, email, password_hash, salt, full_name, role) VALUES 
('admin', 'admin@inventorypro.com', '$2b$12$Bunu0Nsb10GoR/67VdG5We3MIBF2tYFdJ5SkdR5tvdWkkNOE.I/Qu', '$2b$12$Bunu0Nsb10GoR/67VdG5We', 'System Administrator', 'admin'),
('demo', 'demo@inventorypro.com', '$2b$12$kLncMRjJX4wZL6QBXuFagu.tqZLlHvaZy1RWFLmkvh74y9Y06GYQ.', '$2b$12$kLncMRjJX4wZL6QBXuFagu', 'Demo User', 'user');

-- Benutzer-Aktivitäten Log (optional für Audit Trail)
CREATE TABLE IF NOT EXISTS user_activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    activity_type ENUM('login', 'logout', 'register', 'password_change', 'failed_login') NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_activity (user_id, activity_type),
    INDEX idx_created_at (created_at)
);

-- Password Reset Tokens (für "Passwort vergessen" Funktion)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token_hash),
    INDEX idx_user_expires (user_id, expires_at)
);

-- Aufräum-Prozeduren für abgelaufene Sessions und Tokens
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS CleanupExpiredSessions()
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW() OR is_active = FALSE;
    DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR used_at IS NOT NULL;
END //
DELIMITER ;

-- Event für automatisches Aufräumen (läuft täglich um 2 Uhr)
CREATE EVENT IF NOT EXISTS cleanup_expired_data
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 2 HOUR
DO
  CALL CleanupExpiredSessions();

-- Zeige erstellte Tabellen
SHOW TABLES LIKE '%user%';

-- Zeige Benutzer
SELECT id, username, email, full_name, role, is_active, created_at FROM users;
