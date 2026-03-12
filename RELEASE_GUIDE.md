# Release Guide - InventoryPro Analytics

## 🚀 GitHub Repository Setup

### 1. Repository auf GitHub erstellen
```bash
# Auf GitHub.com:
# 1. Gehe zu github.com und logge dich ein
# 2. Klicke auf "New repository" 
# 3. Repository Name: "inventorypro-analytics"
# 4. Beschreibung: "Modern Electron-based inventory analysis application"
# 5. Public oder Private wählen
# 6. NICHT "Initialize with README" wählen (haben wir schon)
# 7. "Create repository" klicken
```

### 2. Lokales Repository mit GitHub verbinden
```bash
# Remote origin hinzufügen (ersetze YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/inventorypro-analytics.git

# Branch zu main umbenennen (modern convention)  
git branch -M main

# Ersten Push machen
git push -u origin main
```

### 3. Repository-Einstellungen aktualisieren
- **Topics/Tags hinzufügen**: `electron`, `react`, `typescript`, `inventory`, `analytics`, `dashboard`
- **About-Sektion**: Kurze Beschreibung und Website-Link
- **Releases**: Ersten Release v1.0.1 erstellen

## 📦 Release erstellen

### GitHub Release (empfohlen)
```bash
# Tag für Release erstellen
git tag -a v1.0.1 -m "Release version 1.0.1 - Initial stable release"
git push origin v1.0.1

# Auf GitHub:
# 1. Gehe zu "Releases" tab
# 2. "Create a new release"
# 3. Tag: v1.0.1
# 4. Title: "InventoryPro Analytics v1.0.1"
# 5. Beschreibung aus CHANGELOG.md kopieren
# 6. Portable builds als Assets hochladen
```

### Portable Distribution bauen
```bash
# Portable Electron App erstellen
npm run pack-portable

# Oder mit electron-builder
npm run dist-portable

# Resultierende .zip/.exe Dateien sind in /release/
```

## 🔄 CI/CD Setup (optional)

### GitHub Actions Workflow
Erstelle `.github/workflows/build.yml`:

```yaml
name: Build and Release

on:
  push:
    tags: ['v*']
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build app
      run: npm run build
    
    - name: Build portable
      run: npm run dist-portable
      
    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: release-${{ matrix.os }}
        path: release/
```

## 🏷️ Versionierung

### Semantic Versioning
- **Major** (1.0.0 → 2.0.0): Breaking changes
- **Minor** (1.0.0 → 1.1.0): Neue Features  
- **Patch** (1.0.0 → 1.0.1): Bugfixes

### Release vorbereiten
```bash
# 1. CHANGELOG.md aktualisieren
# 2. package.json Version erhöhen
# 3. Commit und Tag
git add .
git commit -m "chore: bump version to 1.1.0"
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin main --tags
```

## 📋 Release Checklist

### Vor dem Release
- [ ] Alle Tests erfolgreich
- [ ] CHANGELOG.md aktualisiert
- [ ] README.md aktualisiert  
- [ ] Version in package.json erhöht
- [ ] Portable builds erfolgreich erstellt
- [ ] Sample data funktioniert

### GitHub Release
- [ ] Tag erstellt und gepushed
- [ ] Release notes aus CHANGELOG kopiert
- [ ] Portable builds als Assets hochgeladen
- [ ] Release als "Latest" markiert
- [ ] Announcement in Discussions/README

### Nach dem Release
- [ ] Social Media Posts (falls gewünscht)
- [ ] Dokumentation Website aktualisiert
- [ ] Docker images gepushed (falls vorhanden)
- [ ] Changelog auf Website aktualisiert

## 🐛 Hotfix Process

Für kritische Bugfixes:
```bash
# Hotfix branch vom main erstellen  
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# Fix implementieren und testen
# ...

# Zurück zu main und Release
git checkout main
git merge hotfix/critical-bug
git tag -a v1.0.2 -m "Hotfix v1.0.2"
git push origin main --tags
git branch -d hotfix/critical-bug
```

## 📞 Support

Bei Fragen zur Release-Pipeline:
1. GitHub Issues verwenden
2. Dokumentation in diesem Guide prüfen
3. Community Discussions nutzen

---
**Happy Releasing! 🚀**
