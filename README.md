# Frontend — Rifa Hyundai Accent 2016 + iPhone 17 Pro Max

React + Vite + Tailwind v4. Grid virtualizado de 10,000 numeros (`react-window`),
tiempo real con `socket.io-client`, formulario de compra con envio a WhatsApp,
y panel de administracion.

## 1. Instalacion

```bash
npm install
cp .env.example .env
```

Edita `.env` y apunta `VITE_API_URL` a donde este corriendo tu backend
(por defecto `http://localhost:4000`).

## 2. Correr en desarrollo

```bash
npm run dev
```

Abre `http://localhost:5173`.

- **Sitio publico**: `/`
- **Login admin**: `/admin/login`
- **Panel admin**: `/admin` (requiere iniciar sesion, usa el usuario que creaste
  con `npm run create-admin` en el backend)

## 3. Estructura

```
src/
├── api/api.js                    -> todas las llamadas al backend (axios)
├── hooks/useNumbersSocket.js     -> conexion socket.io, tiempo real
├── components/
│   ├── HeroBanner.jsx            -> cabecera con premios, precio, fecha de sorteo
│   ├── NumberGrid.jsx            -> grid virtualizado de 10,000 numeros
│   ├── GridLegend.jsx            -> leyenda de colores
│   ├── SelectedBar.jsx           -> barra flotante "Tomar numeros"
│   ├── PurchaseModal.jsx         -> formulario + terminos + WhatsApp + comprobante
│   ├── TermsModal.jsx            -> terminos y condiciones
│   ├── CountdownTimer.jsx        -> cuenta regresiva del hold
│   └── RequireAdmin.jsx          -> protege /admin
├── pages/
│   ├── Home.jsx                  -> pagina publica
│   └── admin/
│       ├── AdminLogin.jsx
│       ├── AdminDashboard.jsx    -> pestanas: Ordenes / Reserva manual
│       ├── PendingOrders.jsx     -> confirmar / rechazar
│       └── ManualReserve.jsx     -> vender numeros offline
└── App.jsx                        -> rutas
```

## 4. Compilar para produccion

```bash
npm run build
```

Genera `dist/` listo para subir a Vercel, Netlify o cualquier hosting estatico.
Recuerda configurar `VITE_API_URL` como variable de entorno de build apuntando
a tu backend en produccion.

## 5. Notas de diseno

- Paleta negro/dorado calcada del flyer ("RIFA GRAN PREMIO"), con los numeros
  del grid dibujados como talones de boleto (dos muescas circulares a los lados).
- El grid esta virtualizado (react-window) para no renderizar los 10,000
  botones de una vez, solo pinta los que estan visibles en pantalla.
- El buscador rapido ("Buscar numero") permite ir directo a un numero de
  4 digitos y seleccionarlo si esta disponible, sin tener que hacer scroll.
- Si otro cliente toma un numero que ya tenias seleccionado (por socket),
  se quita automaticamente de tu seleccion para que no intentes comprarlo.

## 6. Sobre el envio por WhatsApp

WhatsApp no permite adjuntar archivos automaticamente via el link wa.me.
El flujo implementado es:
1. Se crea la orden y se abre WhatsApp con el mensaje de texto ya armado.
2. El cliente puede subir el comprobante directo en el sitio (queda asociado
   a la orden) y/o adjuntarlo manualmente en el chat de WhatsApp que se abrio.
3. El admin revisa el comprobante desde el panel (/admin -> pestana Ordenes)
   antes de confirmar.
