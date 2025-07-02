# Guide de résolution pour Windows

## Problème rencontré

```
Error response from daemon: CreateFile C:\workspace\projet_ipssi_msc1\Apocalipssi\apolocalipssi-grp-12\tsconfig*.json: The filename, directory name, or volume label syntax is incorrect.
```

## ✅ Corrections appliquées

### 1. Dockerfile corrigé

Le fichier `src/Dockerfile.dev` a été corrigé pour éliminer le pattern glob problématique :

```dockerfile
# Avant (problématique)
COPY tsconfig*.json ./

# Après (corrigé)
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
```

### 2. Docker Compose corrigé

Le fichier `docker-compose.dev.yml` a été corrigé pour monter spécifiquement chaque fichier tsconfig :

```yaml
# Avant (problématique)
- ./tsconfig*.json:/app/

# Après (corrigé)
- ./tsconfig.json:/app/tsconfig.json
- ./tsconfig.app.json:/app/tsconfig.app.json
- ./tsconfig.node.json:/app/tsconfig.node.json
```

## 🚀 Instructions de résolution

### Option 1 : Script automatique (Recommandé)

1. **Double-cliquez** sur `clean-windows.bat` ou exécutez dans PowerShell :
   ```powershell
   .\clean-windows.ps1
   ```

### Option 2 : Commandes manuelles

1. **Arrêter tous les conteneurs** :

   ```powershell
   docker-compose -f docker-compose.dev.yml down
   ```

2. **Nettoyer Docker** :

   ```powershell
   docker system prune -af
   docker volume prune -f
   ```

3. **Relancer le projet** :
   ```powershell
   docker-compose -f docker-compose.dev.yml up --build
   ```

## 🔍 Vérifications

Assurez-vous que ces fichiers existent dans votre projet :

- ✅ `tsconfig.json`
- ✅ `tsconfig.app.json`
- ✅ `tsconfig.node.json`

## 🐛 Si le problème persiste

1. **Redémarrer Docker Desktop**
2. **Vérifier les permissions** : Exécuter PowerShell en tant qu'administrateur
3. **Vérifier l'espace disque** : Assurez-vous d'avoir suffisamment d'espace libre
4. **Mettre à jour Docker Desktop** vers la dernière version

## 📞 Support

Si le problème persiste après ces étapes, vérifiez :

- La version de Docker Desktop
- Les logs Docker : `docker system df`
- Les permissions du dossier du projet
