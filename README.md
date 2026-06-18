# Coordinador de Final de Vida

Primer módulo de una plataforma en español, centrada en Puerto Rico, para
orientar a personas y familias en momentos de final de vida.

## Enfoque del primer corte

Esta primera versión valida 5 piezas:

1. Un directorio real integrado con doulas, hospicios y servicios fúnebres.
2. La base de integración con Supabase para convertir el directorio en datos editables.
3. Un flujo breve de intake en español para el orientador.
4. Una página de resultados con orientación inicial.
5. Priorización de recursos según situación, necesidad y pueblo.

La app usa el directorio real cargado en `data/module-1/` y está preparada para
leer desde Supabase cuando las tablas estén pobladas.

La ruta principal `/` ahora presenta el directorio integrado como entrada de la
plataforma. El orientador quedó parqueado en `/orientador` para retomarlo más
adelante sin perder ese trabajo.

Las doulas de final de vida también pueden leerse desde la hoja viva de Google
Sheets. Si esa hoja no responde, la app cae al snapshot local incluido en
`data/module-1/`.

Cuando Supabase está configurado, el intake inicial también se guarda en
`intake_sessions` para análisis básico y continuidad.

## Variables de entorno

Crear un archivo `.env.local` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Si quieres forzar el refresco diario del cache a una hora fija, copia
`.env.cron.example` a `.env.cron` y define:

```bash
CRON_SECRET=
EOL_PLANNER_REFRESH_URL=https://eol-planner.vercel.app/api/cron/refresh-doulas
```

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Estructura inicial

- `app/`
  Flujo principal y página de resultados.
- `components/module-1/`
  Componentes del intake.
- `lib/module-1/`
  Tipos, recomendación y acceso al directorio.
- `data/module-1/`
  Directorio real integrado desde los spreadsheets compartidos.
- `lib/supabase/`
  Clientes de Supabase para browser y server.
- `supabase/schema.sql`
  Esquema real para pueblos, recursos e intake.
- `supabase/seed.sql`
  Carga inicial de pueblos y recursos para Supabase.

## Próximos pasos

- Ejecutar `supabase/schema.sql` y luego `supabase/seed.sql` en el proyecto de Supabase.
- Instalar el cron diario de refresco si se quiere forzar actualización a las 9:00am.
- Construir una vista simple de análisis para revisar patrones de necesidad, pueblo y escenario.
