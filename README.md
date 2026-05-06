# Gastro Kids · Dr. Alfredo Mora

Sitio web médico + sistema clínico interno para el **Dr. Alfredo Mora**
(gastroenterólogo, pediatra, nutriólogo, endoscopista digestivo) bajo la marca
**Gastro Kids**. Atiende pacientes de 0 a 21 años.

> *Salud digestiva, infancias plenas.*

## Stack

- **React 19** + **TypeScript** + **Vite (SWC)**
- **Tailwind CSS 3.4.17** (tokens HSL custom)
- **GSAP + ScrollTrigger** + `@gsap/react` (animaciones leves, respeta `prefers-reduced-motion`)
- **Lucide Icons**
- **React Router v6** + **TanStack Query**
- **React Hook Form + Zod**
- **Supabase** (Auth + Postgres + RLS)
- **n8n** (4 workflows que orquestan **GoHighLevel** + Supabase + email + WhatsApp)

## Estructura

```
src/
├── components/
│   ├── landing/    Hero, ServiciosGrid, PorQueNosotros, SobreElDoctor,
│   │              Testimonios, GaleriaPreview, FAQ, CTAFinal, Navbar, Footer
│   ├── booking/    BookingWizard + 4 steps (servicio, fecha/hora, datos, confirmar)
│   ├── admin/      AdminLayout, AdminSidebar
│   ├── auth/       ProtectedRoute
│   ├── layouts/    PublicLayout
│   └── ui/         Button, Card, Badge, Input, Select, Textarea, LangToggle
├── pages/          Index, Galeria, Contacto, SobreElDoctor, AgendarCita, NotFound
│   └── admin/      Login, Dashboard, Pacientes, PacienteDetalle, Calendario, Configuracion
├── contexts/       LanguageContext
├── hooks/          useAuth, useGsapReveal, useDisponibilidad, useAgendarCita
├── lib/
│   ├── i18n/       es.ts, en.ts, types.ts
│   ├── schemas/    bookingSchema (Zod)
│   ├── cn.ts       clsx + tailwind-merge
│   ├── mock.ts     pacientes, citas, servicios, galería (mock para desarrollo)
│   ├── supabase.ts cliente único (degrada a modo mock si no hay env)
│   └── webhooks.ts URLs de n8n centralizadas
└── App.tsx · main.tsx · index.css

supabase/migrations/  8 archivos SQL ejecutables en orden (0001…0008)
n8n/workflows/        4 workflows JSON listos para importar
```

## Setup local

```bash
npm install
cp .env.example .env       # rellena cuando tengas las claves
npm run dev                # http://localhost:5173
```

### Modo demo sin backend

El proyecto funciona **out of the box sin Supabase ni n8n**:

- `useAuth` cae a un store local con tres usuarios precargados:
  - `admin@gastrokids.mx` · `admin123`
  - `dr.mora@gastrokids.mx` · `doctor123`
  - `secretaria@gastrokids.mx` · `sec123`
- `useDisponibilidad` y `useAgendarCita` retornan slots/respuesta mock cuando los
  webhooks n8n no están configurados.
- Los pacientes y citas en el dashboard se leen de `src/lib/mock.ts`.

Apenas configures las variables, los hooks empiezan a hablar con Supabase y n8n
sin cambios de código.

### Variables de entorno (`.env`)

```env
VITE_SUPABASE_URL=https://bxjwaarjuxrojsflzzxw.supabase.co
VITE_SUPABASE_ANON_KEY=
VITE_N8N_WEBHOOK_AGENDAR=
VITE_N8N_WEBHOOK_DISPONIBILIDAD=
VITE_N8N_WEBHOOK_ACTUALIZAR=
VITE_N8N_WEBHOOK_SEGUIMIENTO=
VITE_DEFAULT_LANG=es
VITE_TIMEZONE=America/Mexico_City
```

Las claves sensibles **GHL_API_KEY**, **SUPABASE_SERVICE_ROLE_KEY** y los IDs
de calendario se viven exclusivamente en n8n, nunca en el frontend.

## Sistema de diseño

| Token | HSL | Hex | Uso |
|---|---|---|---|
| `navy` | `215 53% 27%` | `#1F4068` | Primario · 70% del peso visual |
| `leaf` | `88 44% 50%` | `#7EB748` | CTA secundario, acentos |
| `teal` | `177 47% 45%` | `#3DA9A3` | Solo chips e ilustraciones |
| `amber` | `28 76% 60%` | `#E89C4D` | Solo chips e ilustraciones |
| `coral` | `8 73% 70%` | `#E88C7D` | Solo chips e ilustraciones |
| `offwhite` | `60 17% 98%` | `#FAFAF7` | Fondo dominante |
| `offblack` | `218 51% 12%` | `#0F1A2E` | Body copy |

**Tipografías** (Google Fonts, declaradas en `index.html`):
- Display: **Fraunces** (serif editorial variable)
- Body: **Plus Jakarta Sans** (300/400/500/600/700)

## Backend (Supabase)

Las 8 migraciones se aplican en orden. En la UI de Supabase → **SQL Editor**:

```bash
# Ejecuta cada archivo en orden, o usa la CLI:
supabase db push
```

Tablas:

- `pacientes`, `tutores`
- `expediente_master` — núcleo del modelo clínico pediátrico-GI
- `antropometria` — seriada por consulta
- `procedimientos` — endoscopía, colonoscopía, manometría, pH-metría, aliento, biopsia
- `medicamentos`, `vacunas`
- `consultas`, `consulta_archivos`, `consulta_notas`
- `servicios`, `citas`
- `profiles`, `user_roles`, `site_settings`

**RLS** activa en todas. Roles:
- **admin**: CRUD total
- **doctor**: CRUD clínico + lectura/escritura de citas y pacientes
- **secretaria**: lectura/escritura solo en `citas`, `pacientes`, `tutores`

Crear el primer admin tras aplicar las migraciones:

```sql
-- Sustituye <USER_ID> por el id de auth.users del admin recién creado
insert into user_roles (user_id, rol) values ('<USER_ID>', 'admin');
insert into profiles (id, nombre, email)
values ('<USER_ID>', 'Admin Gastro Kids', 'admin@gastrokids.mx');
```

## Workflows n8n

Importa los 4 archivos en `n8n/workflows/`:

| Workflow | Trigger | Función |
|---|---|---|
| `agendar-cita-ghl` | `POST /webhook/agendar-cita` | Upsert paciente/tutor + crear contacto y cita en GHL + insert en `citas` + email + WhatsApp |
| `disponibilidad-ghl` | `POST /webhook/disponibilidad` | Consulta slots libres del calendario GHL del Dr. Mora |
| `actualizar-paciente-ghl` | `POST /webhook/actualizar-paciente` | Mapea formulario completo de primera consulta a `expediente_master` + sync GHL |
| `seguimiento-paciente-ghl` | `POST /webhook/seguimiento-paciente` | Update parcial de revisita; inserta antropometría si viene |

Antes de activarlos, reemplaza los placeholders en los JSON:
- `REEMPLAZAR_CON_TU_GHL_LOCATION_ID`
- `REEMPLAZAR_CON_TU_GHL_CALENDAR_ID`

Y configura las credenciales referenciadas:
- `GHL Private API Key` (Header Auth con tu private API key)
- `Supabase Gastro Kids` (Service Role Key)
- `Supabase Postgres` (conexión directa para queries SQL)
- `SMTP Gastro Kids` (proveedor SMTP propio)

Una vez activos, copia las URLs de webhook a tu `.env`:

```
VITE_N8N_WEBHOOK_AGENDAR=https://tu-n8n.com/webhook/agendar-cita
VITE_N8N_WEBHOOK_DISPONIBILIDAD=https://tu-n8n.com/webhook/disponibilidad
VITE_N8N_WEBHOOK_ACTUALIZAR=https://tu-n8n.com/webhook/actualizar-paciente
VITE_N8N_WEBHOOK_SEGUIMIENTO=https://tu-n8n.com/webhook/seguimiento-paciente
```

## Verificación end-to-end

1. `npm install && npm run dev` → landing en `http://localhost:5173`.
2. Toggle ES/EN en navbar → cambia copia.
3. Click *Agendar cita* → wizard 4 pasos → confirmar → toast de éxito.
4. `/admin/login` con `admin@gastrokids.mx / admin123` → dashboard.
5. `/admin/pacientes` → buscar "Lucía" → entrar al expediente con tabs.
6. `/admin/calendario` → semana con 24 citas mock distribuidas.
7. DevTools → emular `prefers-reduced-motion: reduce` → animaciones desactivadas.

## Mock data

Todo el contenido visible (pacientes, citas, doctor, testimonios, galería) vive
en `src/lib/mock.ts` y los textos en `src/lib/i18n/{es,en}.ts`. Reemplaza
literales con datos reales sin tocar componentes.

Imágenes placeholder vienen de `picsum.photos` con seeds estables — al
reemplazar con assets reales solo cambia las URLs en el mock.

## Animaciones

- Hero: split-text por palabra + parallax sutil en el retrato.
- Scroll: cards de cada sección entran con `from y:24 opacity:0` y stagger por
  hijo (`useGsapReveal`).
- Acordeón FAQ con grid `grid-rows-[0fr → 1fr]` (sin lib externa).
- Todas las animaciones se desactivan con `prefers-reduced-motion: reduce`.

## Roadmap inmediato

- [ ] Subir favicon y og-image definitivos.
- [ ] Conectar formulario de primera consulta al webhook `actualizar-paciente`.
- [ ] Sustituir mock de pacientes por queries reales a Supabase tras crear el
      primer admin.
- [ ] Implementar percentiles OMS auténticos en `AntropometriaTabla`.
- [ ] Subir galería real del consultorio.

---

Construido sobre la arquitectura de
[`ElvisRocha/dra-ekaterina-gine`](https://github.com/ElvisRocha/dra-ekaterina-gine),
adaptado a gastroenterología pediátrica.
