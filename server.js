// ============================================================
//  ORKOS FITNESS API  —  servidor para Railway
//  Recibe datos del ESP32 y devuelve mensajes motivacionales
// ============================================================

const express = require('express');
const app     = express();
app.use(express.json());

// Historial en memoria
const historial = [];

// ── GET / ─────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'OK', app: 'Orkos Fitness API', series: historial.length });
});

// ── POST /rep — ESP32 manda cada rep ─────────────────────────
app.post('/rep', (req, res) => {
  const { reps = 0, ejercicio = 'hammer_curl', usuario = 'Orkos' } = req.body;

  historial.push({ ts: new Date(), usuario, ejercicio, reps });

  let mensaje = '';
  if      (reps === 1)  mensaje = 'PRIMERA REP! Arranca!';
  else if (reps < 5)    mensaje = `Rep ${reps}! Vas bien!`;
  else if (reps < 10)   mensaje = `Rep ${reps}! No pares!`;
  else                  mensaje = 'SERIE COMPLETA!';

  console.log(`[${new Date().toISOString()}] ${usuario} | ${ejercicio} | rep ${reps}`);
  res.json({ ok: true, mensaje, reps });
});

// ── POST /serie — al terminar las 10 reps ────────────────────
app.post('/serie', (req, res) => {
  const { total = 10, ejercicio = 'hammer_curl', usuario = 'Orkos' } = req.body;

  historial.push({ ts: new Date(), usuario, ejercicio, serie_completa: true, total });
  console.log(`[${new Date().toISOString()}] SERIE COMPLETA | ${usuario} | ${total} reps`);

  res.json({ ok: true, mensaje: 'SERIE OK! Sos una bestia!', total });
});

// ── GET /historial ────────────────────────────────────────────
app.get('/historial', (req, res) => {
  res.json(historial.slice(-50));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Orkos API en puerto ${PORT}`));
