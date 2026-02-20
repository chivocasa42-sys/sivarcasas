# 🚂 Configuración de Railway para SivarCasas

## Checklist de lo que debes hacer en Railway Dashboard

### ✅ Paso 1: Verificar el Start Command esté VACÍO

1. Ve a **Railway → Tu Servicio → Settings**
2. Busca la sección **"Start Command"**
3. **BÓRRALO COMPLETAMENTE** — debe estar vacío
4. Railway usará el `CMD` del Dockerfile: `node server.js`

> ⚠️ **ESTE ES EL PASO MÁS IMPORTANTE.** Si hay algo escrito ahí (como `node .next/standalone/server.js`), el deployment fallará.

### ✅ Paso 2: Variables de Entorno

Ve a **Railway → Tu Servicio → Variables** y configura:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...tu-anon-key...
```

Si usas service role:
```
SUPABASE_SERVICE_ROLE_KEY=eyJ...tu-service-role-key...
```

**❌ NO crear la variable `PORT`** — Railway la inyecta automáticamente.

### ✅ Paso 3: Verificar Builder

1. Ve a **Railway → Tu Servicio → Settings**
2. En la sección **"Builder"**, debe decir **"Dockerfile"**
3. Si dice "Nixpacks" o "Railpack", cámbialo a **Dockerfile**

### ✅ Paso 4: Deploy

1. Haz push de tus cambios:
   ```bash
   git add .
   git commit -m "fix railway standalone docker setup"
   git push
   ```
2. Railway detectará el push y empezará el build automáticamente

### ✅ Paso 5: Verificar en Logs

En los logs del deployment deberías ver:

```
Ready on http://0.0.0.0:XXXX
```

Y el status: **"Deployment successful"**

---

## Prompt para ChatGPT (si necesitas más ayuda)

```
Actúa como un experto en Railway, Docker y Next.js.

Tengo una aplicación Next.js llamada SivarCasas desplegada en Railway con Docker.

Mi configuración actual es:

**next.config.ts:**
- output: 'standalone'
- images.remotePatterns para HTTPS
- redirects para departamentos de El Salvador

**Dockerfile:**
- Multi-stage: deps → builder → runner
- Base: node:20-alpine
- ENV NODE_ENV=production
- ENV HOSTNAME=0.0.0.0
- NO tiene ENV PORT (Railway lo inyecta)
- COPY desde .next/standalone/sivarcasas/ (Next.js anida el output bajo el nombre del proyecto)
- CMD ["node", "server.js"]

**railway.toml:**
- builder = "dockerfile"
- healthcheckPath = "/"
- healthcheckTimeout = 300
- NO tiene startCommand

**Railway Settings:**
- Start Command: VACÍO (usa CMD del Dockerfile)
- Variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- NO tiene variable PORT manual

**Problema actual:** [describe tu problema aquí]

Necesito que diagnostiques por qué el deployment falla y me des la solución exacta.

Reglas:
- No usar next start
- No usar custom Express server
- No configurar Start Command en Railway
- No definir PORT manualmente
- No usar localhost
- El contenedor debe escuchar en 0.0.0.0:$PORT
- El healthcheck en "/" debe responder 200
```
