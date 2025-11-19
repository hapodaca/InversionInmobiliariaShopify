# 🔄 Configuración de Sincronización Automática Shopify → GitHub

## ✅ ¿Qué hace esto?

Cada 6 horas, GitHub descargará automáticamente los cambios que hagas en Shopify y los guardará en este repositorio. **No necesitas hacer nada manualmente**.

---

## 🚀 Configuración Inicial (Solo una vez)

### Paso 1: Obtener el Theme ID de Shopify

1. Ve a tu tienda de Shopify
2. Click en **Tienda online** → **Temas**
3. En el tema activo, click en **Acciones** → **Editar código**
4. En la URL verás algo como: `https://admin.shopify.com/store/TU-TIENDA/themes/123456789/editor`
5. **Copia el número** (ej: `123456789`) - Este es tu **THEME_ID**

---

### Paso 2: Obtener tu Store URL

Tu store URL es: `TU-TIENDA.myshopify.com`

Por ejemplo: `inversioninmobiliaria.myshopify.com`

---

### Paso 3: Crear App Privada en Shopify (Para el Token)

1. En tu Shopify Admin, ve a **Configuración** (⚙️) → **Aplicaciones y canales de ventas**
2. Click en **Desarrollar aplicaciones**
3. Si es la primera vez, click en **Permitir desarrollo de aplicaciones personalizadas**
4. Click en **Crear una aplicación**
5. Nombre: `GitHub Sync` (o el que prefieras)
6. Click en **Crear aplicación**
7. Ve a la pestaña **Configuración**
8. En **Admin API**, click **Configurar**
9. Busca y activa estos permisos:
   - `read_themes`
   - `write_themes`
10. Click **Guardar**
11. Regresa y click en **Instalar aplicación**
12. Confirma la instalación
13. **COPIA** el **Admin API access token** (solo se muestra una vez)
    - Este es tu **SHOPIFY_CLI_TOKEN** ⚠️ Guárdalo bien

---

### Paso 4: Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub: https://github.com/hapodaca/InversionInmobiliariaShopify
2. Click en **Settings** (Configuración)
3. En el menú izquierdo, click en **Secrets and variables** → **Actions**
4. Click en **New repository secret** y agrega estos 3 secrets:

   **Secret 1:**
   - Name: `SHOPIFY_CLI_TOKEN`
   - Value: El token que copiaste en Paso 3

   **Secret 2:**
   - Name: `SHOPIFY_STORE`
   - Value: `TU-TIENDA.myshopify.com` (sin https://)

   **Secret 3:**
   - Name: `SHOPIFY_THEME_ID`
   - Value: El número del tema (del Paso 1)

---

## 🎯 ¡Listo! ¿Cómo funciona ahora?

### Sincronización Automática
- Cada 6 horas, GitHub descargará cambios de Shopify automáticamente
- Si hay cambios, creará un commit automático
- Verás commits con este formato: `🤖 Auto-sync: Cambios desde Shopify (2024-11-18 15:30:00)`

### Sincronización Manual (cuando quieras)
1. Ve a GitHub → Tu repositorio
2. Click en **Actions**
3. Click en **Sync Shopify Theme to GitHub**
4. Click en **Run workflow** → **Run workflow**
5. Espera 1-2 minutos y verás los cambios

---

## ⏰ Cambiar la Frecuencia de Sincronización

Edita el archivo `.github/workflows/sync-shopify.yml`, línea 6:

```yaml
# Cada 6 horas (actual):
- cron: '0 */6 * * *'

# Cada 1 hora:
- cron: '0 * * * *'

# Cada 12 horas:
- cron: '0 */12 * * *'

# Una vez al día (medianoche):
- cron: '0 0 * * *'
```

---

## ❓ Troubleshooting

### "Error: Invalid credentials"
- Verifica que el `SHOPIFY_CLI_TOKEN` esté correcto
- Asegúrate de que la app tenga permisos `read_themes` y `write_themes`

### "Error: Theme not found"
- Verifica que el `SHOPIFY_THEME_ID` sea correcto
- Asegúrate de que el tema esté publicado

### "No hay cambios"
- Normal si no has editado nada en Shopify desde la última sincronización

---

## 📧 Soporte

Si tienes problemas, revisa los logs en:
GitHub → Actions → Click en el workflow que falló → Revisa los logs
