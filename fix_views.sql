-- KORRIGIERTE VERSION - Kopieren Sie diesen Code in phpMyAdmin
-- Führen Sie die Views einzeln aus, falls Fehler auftreten

-- 1. Zuerst Views löschen (falls sie existieren)
DROP VIEW IF EXISTS v_inventory_overview;
DROP VIEW IF EXISTS v_abc_summary;

-- 2. Korrigierte Views erstellen
CREATE VIEW v_inventory_overview AS
SELECT 
    i.*,
    CASE 
        WHEN i.menge <= i.mindestbestand THEN 'Kritisch'
        WHEN i.menge <= i.mindestbestand * 1.5 THEN 'Niedrig'
        ELSE 'Normal'
    END as bestandsstatus
FROM inventory i;

CREATE VIEW v_abc_summary AS
SELECT 
    abc_klasse,
    COUNT(*) as anzahl_artikel,
    SUM(gesamtwert) as gesamtwert_summe,
    ROUND(SUM(gesamtwert) / (SELECT SUM(gesamtwert) FROM inventory) * 100, 2) as anteil_prozent
FROM inventory 
GROUP BY abc_klasse;

-- 3. Testen der Views
SELECT 'Views erfolgreich erstellt' as status;
SELECT * FROM v_inventory_overview LIMIT 3;
SELECT * FROM v_abc_summary;
