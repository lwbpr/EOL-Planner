# Coordinador de Final de Vida

Primer módulo de una plataforma en español, centrada en Puerto Rico, para
orientar a personas y familias en momentos de final de vida.

## Enfoque del primer corte

Esta primera versión valida 5 piezas:

1. Un flujo breve de intake en español.
2. Una página de resultados con orientación inicial.
3. Priorización de recursos según situación, necesidad y pueblo.
4. Un directorio real integrado con doulas, hospicios y servicios fúnebres.
5. La base de integración con Supabase para convertir el directorio en datos editables.

La app usa el directorio real cargado en `data/module-1/` y está preparada para
leer desde Supabase cuando las tablas estén pobladas.

## Variables de entorno

Crear un archivo `.env.local` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
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
- Añadir rutas claras hacia apoyo humano de AMORir.
- Empezar la lógica de guardado de intake para análisis y continuidad.
