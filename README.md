# Logistics SaaS Backend

Production-ready SaaS-Backend für ein Logistik-Analyse-System mit Multi-Tenant-Architektur, Lizenzverwaltung, automatischer Rechnungsstellung und revisionssichere PDF-Speicherung.

## 🎯 Features

### Core-Funktionalität
- ✅ **Multi-Tenant-Architektur** - Vollständige Mandantentrennung
- ✅ **Lizenzverwaltung** - Trial, Active, Expired, Blocked Status
- ✅ **JWT-Authentifizierung** - Sichere Token-basierte Auth
- ✅ **Rollensystem** - Admin & User Rollen
- ✅ **Lagerverwaltung** - Komplexe Priorisierungslogik
- ✅ **Analyse-System** - Versionierbare Formeln & Berechnungen
- ✅ **PDF-Generierung** - Analyseberichte mit Puppeteer
- ✅ **Rechnungssystem** - Automatische Erstellung & Versand
- ✅ **Stripe-Integration** - Zahlungsabwicklung
- ✅ **E-Mail-Service** - Automatischer Rechnungsversand
- ✅ **S3-Storage** - Revisionssichere PDF-Speicherung (MinIO/AWS S3)
- ✅ **Audit-Logs** - Compliance & Nachverfolgbarkeit

### Sicherheit
- Helmet HTTP-Header-Security
- Rate-Limiting (100 req/min)
- Input-Validation mit class-validator
- Bcrypt Password-Hashing
- CORS-Konfiguration
- JWT Token-Rotation
- Tenant-Isolation auf DB-Ebene

## 🚀 Tech Stack

- **Backend**: NestJS 10 + TypeScript 5
- **Datenbank**: PostgreSQL 16
- **Auth**: JWT + Passport
- **Payment**: Stripe
- **PDF**: Puppeteer + Chromium
- **Storage**: AWS SDK (S3/MinIO)
- **Mail**: Nodemailer
- **Deployment**: Docker + Docker Compose

## 📁 Projektstruktur

```
src/
├── main.ts                    # Entry Point
├── app.module.ts             # Haupt-Modul
├── common/                   # Shared Resources
│   ├── guards/              # Auth, Role, License Guards
│   └── decorators/          # CurrentUser, CurrentTenant, Roles
├── database/                # TypeORM Config
│   ├── data-source.ts      # Migration DataSource
│   └── migrations/         # DB Migrations
└── modules/
    ├── auth/               # Authentifizierung
    ├── users/              # Benutzerverwaltung
    ├── tenants/            # Mandantenverwaltung
    ├── licenses/           # Lizenzsystem
    ├── warehouse/          # Lagerverwaltung
    ├── analysis/           # Analyse-Engine
    ├── pdf/                # PDF-Generierung
    ├── invoices/           # Rechnungen
    ├── payments/           # Stripe-Integration
    ├── mail/               # E-Mail-Service
    ├── storage/            # S3/MinIO
    ├── admin/              # Admin-Funktionen
    └── audit/              # Audit-Logs
```

## 🛠️ Setup

### Voraussetzungen
- Node.js 20+
- PostgreSQL 16+
- Docker & Docker Compose (optional)

### Installation

```bash
# Repository klonen
git clone https://github.com/LucasPetv/SA-LagerVerwaltungsTool.git
cd SA-LagerVerwaltungsTool

# Dependencies installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env
# .env mit echten Werten befüllen
```

### Mit Docker

```bash
# Alle Services starten
docker-compose up -d

# Logs anzeigen
docker-compose logs -f api

# Services stoppen
docker-compose down
```

### Ohne Docker

```bash
# PostgreSQL & MinIO manuell starten
# .env entsprechend anpassen

# Entwicklung
npm run start:dev

# Production Build
npm run build
npm run start:prod
```

## 🗄️ Datenbank

### Migrations erstellen

```bash
# Neue Migration generieren
npm run migration:generate -- src/database/migrations/MigrationName

# Migrations ausführen
npm run migration:run

# Letzte Migration zurücksetzen
npm run migration:revert
```

## 🔐 API Endpoints

### Authentication
```
POST /api/auth/register    # Neuen User registrieren
POST /api/auth/login       # Login & JWT erhalten
```

### Users
```
GET /api/users/me          # Eigenes Profil (authentifiziert)
```

### Weitere Endpoints
Siehe einzelne Module für vollständige API-Dokumentation.

## 🧪 Testing

```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e

# Test Coverage
npm run test:cov
```

## 📊 Monitoring & Logs

- Logs werden in `logs/` gespeichert
- Production: Strukturierte JSON-Logs
- Development: Colored Console-Logs

## 🔒 Sicherheitshinweise

### Produktion-Checkliste
- [ ] `JWT_SECRET` durch kryptografisch sicheren Wert ersetzen
- [ ] `DB_PASSWORD` mit starkem Passwort setzen
- [ ] `CORS_ORIGIN` auf konkrete Domains beschränken
- [ ] HTTPS aktivieren (nginx/Caddy reverse proxy)
- [ ] Rate-Limiting anpassen
- [ ] Audit-Logs aktivieren
- [ ] Backup-Strategie implementieren
- [ ] Monitoring-Tools einrichten

## 🚢 Deployment

### VPS (Hostinger/Hetzner/DigitalOcean)

```bash
# Auf Server
git clone <repo>
cd SA-LagerVerwaltungsTool

# .env konfigurieren
vim .env

# Mit Docker starten
docker-compose -f docker-compose.yml up -d

# Nginx Reverse Proxy einrichten
# SSL mit Let's Encrypt
```

### Empfohlene Server-Specs
- **Minimum**: 2 vCPU, 4GB RAM, 20GB SSD
- **Empfohlen**: 4 vCPU, 8GB RAM, 50GB SSD

## 📦 Produktions-Optimierung

- **CDN**: CloudFlare für statische Assets
- **Backup**: Automatische PostgreSQL-Backups
- **Monitoring**: Sentry/LogRocket für Error-Tracking
- **Performance**: Redis für Caching (optional)
- **Load Balancing**: Bei hoher Last mehrere API-Instanzen

## 🤝 Contributing

1. Fork das Projekt
2. Feature-Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request öffnen

## 📄 Lizenz

Proprietär - Alle Rechte vorbehalten

## 📧 Kontakt

Projektverantwortlicher: LucasPetv

---

**Status**: 🟢 In Entwicklung | Production-Ready Architecture
