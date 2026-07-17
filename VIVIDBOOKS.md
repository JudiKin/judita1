# Nasazení do vividbooks/vividbooks-ultra

Z cloudu **nelze pushnout přímo** do `vividbooks/vividbooks-ultra` — repozitář neexistuje
nebo k němu tento agent nemá oprávnění. Kód je připravený zde:

**https://github.com/JudiKin/judita1** (větev `judita1`)

## Import bez terminálu (doporučeno)

1. Vytvoř prázdný repozitář **vividbooks/vividbooks-ultra** (nebo měj oprávnění v org `vividbooks`)
2. Otevři: **https://github.com/new/import**
3. **Old repository URL:** `https://github.com/JudiKin/judita1`
4. **Owner:** `vividbooks`
5. **Repository name:** `vividbooks-ultra`
6. Klikni **Begin import**

## GitHub Pages na vividbooks

1. V repozitáři spusť build pro Pages (lokálně nebo Actions):
   - `npm run build:pages`
   - zkopíruj obsah `dist/` do složky `docs/`
2. **Settings → Pages → Branch `judita1` → `/docs` → Save**
3. Adresa: **https://vividbooks.github.io/vividbooks-ultra/**

## Import s terminálem (alternativa)

```bash
git clone https://github.com/JudiKin/judita1.git
cd judita1
git checkout judita1
git remote add vivid https://github.com/vividbooks/vividbooks-ultra.git
git push vivid judita1:main
```
