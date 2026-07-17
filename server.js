// ============================================================
//  ORKOS FITNESS API v2  —  Railway
//  + CORS para WordPress
//  + /ultimo  para el widget del Viking
// ============================================================
const express = require('express');
const app     = express();
app.use(express.json());

// CORS — permite que orkosfitness.com consulte la API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const historial = [];

// ── GET / ─────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'OK', app: 'Orkos Fitness API v2', entradas: historial.length });
});

// ── GET /ultimo — WordPress lo consulta cada segundo ─────────
app.get('/ultimo', (req, res) => {
  if (historial.length === 0) return res.json({ hay: false });
  res.json({ hay: true, ...historial[historial.length - 1] });
});

// ── POST /rep ─────────────────────────────────────────────────
app.post('/rep', (req, res) => {
  const { reps = 0, ejercicio = 'hammer_curl', usuario = 'Orkos' } = req.body;
  const entrada = { ts: new Date().toISOString(), usuario, ejercicio, reps };
  historial.push(entrada);

  let mensaje = '';
  if      (reps === 1)  mensaje = 'PRIMERA REP! Arranca!';
  else if (reps < 5)    mensaje = `Rep ${reps}! Vas bien!`;
  else if (reps < 10)   mensaje = `Rep ${reps}! No pares!`;
  else                  mensaje = 'SERIE COMPLETA!';

  console.log(`[${entrada.ts}] ${usuario} | ${ejercicio} | rep ${reps}`);
  res.json({ ok: true, mensaje, reps, ts: entrada.ts });
});

// ── POST /serie ───────────────────────────────────────────────
app.post('/serie', (req, res) => {
  const { total = 10, ejercicio = 'hammer_curl', usuario = 'Orkos' } = req.body;
  const entrada = { ts: new Date().toISOString(), usuario, ejercicio, serie_completa: true, total };
  historial.push(entrada);
  console.log(`[${entrada.ts}] SERIE COMPLETA | ${usuario} | ${total} reps`);
  res.json({ ok: true, mensaje: 'SERIE OK! Sos una bestia!', total, ts: entrada.ts });
});

// ── GET /historial ────────────────────────────────────────────
app.get('/historial', (req, res) => {
  res.json(historial.slice(-50));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Orkos API v2 en puerto ${PORT}`));
