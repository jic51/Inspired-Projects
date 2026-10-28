const { chromium } = require('playwright');
const APP = 'file:///home/user/Inspired-Projects/ChronosFlow/index.html';

let pass = 0, fail = 0;
const ok  = (n, c, extra='') => { c ? (pass++, console.log('  PASS ' + n)) : (fail++, console.log('  FAIL ' + n + '  ' + extra)); };

// Reloj fijo: solo Date.now() se sustituye, porque todo el calculo del app lo usa.
function atTime(h, m) {
  return `(() => { const d = new Date(); d.setHours(${h},${m},0,0);
    const fixed = d.getTime(); const R = Date.now; Date.now = () => fixed; })()`;
}

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });

  async function open(h, m, storage) {
    const ctx = await browser.newContext({ viewport: { width: 400, height: 860 } });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', e => e.type() === 'error' && errs.push(e.text()));
    page.on('pageerror', e => errs.push(String(e)));
    await page.addInitScript(atTime(h, m));
    if (storage) await page.addInitScript(s => { try { localStorage.setItem('chronosflow.v1', s); } catch (e) {} }, storage);
    await page.goto(APP);
    await page.waitForTimeout(120);
    return { ctx, page, errs };
  }

  // ---- 1. Estado vacio ----
  console.log('\n1. Arranque sin contadores');
  { const { ctx, page, errs } = await open(15, 40);
    ok('pregunta "¿Qué estás haciendo ahora?" visible', await page.locator('#empty').isVisible());
    ok('5 temas, sin escribir nombres', await page.locator('.tile').count() === 5);
    ok('FAB oculto cuando no hay contadores', await page.locator('#fab').isHidden());
    ok('fila de hora de inicio oculta hasta marcar "ya empecé"', await page.locator('#f-when').count() === 1);
    ok('reloj de pared = 15:40', (await page.locator('#wallclock').textContent()) === '15:40');
    ok('sin errores de consola', errs.length === 0, errs.join(' | '));
    await ctx.close(); }

  // ---- 2. El caso literal del usuario ----
  console.log('\n2. "Entré a las 7am y son las 3:40pm" con jornada de 8h');
  { const { ctx, page, errs } = await open(15, 40);
    await page.click('.tile[data-theme="working"]');
    ok('se abre la hoja con Working ya elegido', (await page.locator('#f-name').textContent()) === 'Working');
    ok('la hora de inicio no se pide hasta marcar "ya empecé"', await page.locator('#f-when').isHidden());
    ok('8 horas preseleccionado por defecto',
       (await page.locator('.dchip[data-min="480"]').getAttribute('aria-pressed')) === 'true');
    ok('preview sin "ya empecé": termina 23:40',
       (await page.locator('#f-prev').textContent()) === 'Termina 23:40',
       await page.locator('#f-prev').textContent());

    await page.click('#f-started');
    await page.fill('#f-time', '07:00');
    await page.waitForTimeout(60);
    ok('nota dice hace 8h 40m', (await page.locator('#f-when-note').textContent()).includes('8h 40m'),
       await page.locator('#f-when-note').textContent());
    ok('preview detecta que ya se cumplio', (await page.locator('#f-prev').textContent()) === 'Ya cumplido');
    ok('preview dice 40m de más', (await page.locator('#f-prev2').textContent()).includes('40m de más'),
       await page.locator('#f-prev2').textContent());

    await page.click('#f-go');
    await page.waitForTimeout(80);
    ok('tarjeta creada', await page.locator('.card').count() === 1);
    ok('lectura grande = 8:40', (await page.locator('.read-main').textContent()) === '8h40m',
       await page.locator('.read-main').textContent());
    ok('muestra el tiempo de más, no se congela',
       (await page.locator('.left').textContent()) === '+40m de más',
       await page.locator('.left').textContent());
    ok('barra al 100%', (await page.locator('.fill').evaluate(e => e.style.width)) === '100%');
    ok('barra en rojo encendido al 100%',
       (await page.locator('.fill').evaluate(e => e.style.backgroundColor)) === 'rgb(250, 15, 15)',
       await page.locator('.fill').evaluate(e => e.style.backgroundColor));
    ok('tarjeta parpadea al cumplirse', await page.locator('.card.blink').count() === 1);
    ok('chip dice Cumplido', (await page.locator('.chip').textContent()) === 'Cumplido');
    ok('FAB visible con contadores', await page.locator('#fab').isVisible());
    ok('sin errores de consola', errs.length === 0, errs.join(' | '));
    await ctx.close(); }

  // ---- 3. Progreso intermedio + color ----
  console.log('\n3. Progreso intermedio (7:00, jornada de 12h)');
  { const { ctx, page } = await open(15, 40);
    await page.click('.tile[data-theme="working"]');
    await page.click('.dchip[data-min="720"]');
    await page.click('#f-started');
    await page.fill('#f-time', '07:00');
    await page.waitForTimeout(60);
    ok('preview: llevas 8h 40m', (await page.locator('#f-prev').textContent()) === 'Llevas 8h 40m',
       await page.locator('#f-prev').textContent());
    await page.click('#f-go');
    await page.waitForTimeout(80);
    ok('transcurrido 8:40', (await page.locator('.read-main').textContent()) === '8h40m');
    ok('faltan 3h 20m', (await page.locator('.left').textContent()) === 'faltan 3h 20m',
       await page.locator('.left').textContent());
    ok('72%', (await page.locator('.pct').textContent()) === '72%', await page.locator('.pct').textContent());
    ok('barra al 72.2%', (await page.locator('.fill').evaluate(e => e.style.width)).startsWith('72.2'));
    ok('fin previsto 19:00', (await page.locator('.card-win').textContent()) === '07:00 → 19:00',
       await page.locator('.card-win').textContent());
    ok('no parpadea antes del 100%', await page.locator('.card.blink').count() === 0);
    await ctx.close(); }

  // ---- 4. Duracion corta: mm:ss ----
  console.log('\n4. Deep Focus 50 min desde ahora');
  { const { ctx, page } = await open(9, 15);
    await page.click('.tile[data-theme="deepfocus"]');
    ok('50 min por defecto en Deep Focus',
       (await page.locator('.dchip[data-min="50"]').getAttribute('aria-pressed')) === 'true');
    await page.click('#f-go');
    await page.waitForTimeout(80);
    ok('lectura en m/s para duraciones < 1h', (await page.locator('.read-main').textContent()) === '0m00s');
    ok('faltan 50m', (await page.locator('.left').textContent()) === 'faltan 50m');
    ok('verde al 0%', (await page.locator('.fill').evaluate(e => e.style.backgroundColor)) === 'rgb(35, 199, 95)',
       await page.locator('.fill').evaluate(e => e.style.backgroundColor));
    await ctx.close(); }

  // ---- 5. Persistencia + avance real del reloj ----
  console.log('\n5. Persistencia al cerrar y reabrir');
  { let { ctx, page } = await open(15, 40);
    await page.click('.tile[data-theme="working"]');
    await page.click('.dchip[data-min="720"]');
    await page.click('#f-started');
    await page.fill('#f-time', '07:00');
    await page.click('#f-go');
    await page.waitForTimeout(80);
    const saved = await page.evaluate(() => localStorage.getItem('chronosflow.v1'));
    ok('se guardo en localStorage', !!saved && saved.includes('segments'));
    await ctx.close();

    // Reabrir dos horas despues, en una pestana nueva.
    ({ ctx, page } = await open(17, 40, saved));
    ok('el contador sobrevive al cierre', await page.locator('.card').count() === 1);
    ok('siguio contando sin la app abierta: 10:40',
       (await page.locator('.read-main').textContent()) === '10h40m', await page.locator('.read-main').textContent());
    ok('faltan 1h 20m', (await page.locator('.left').textContent()) === 'faltan 1h 20m',
       await page.locator('.left').textContent());
    await ctx.close(); }

  // ---- 6. Pausa / reanudar ----
  console.log('\n6. Pausa y reanudación');
  { const { ctx, page } = await open(15, 40);
    await page.click('.tile[data-theme="working"]');
    await page.click('.dchip[data-min="720"]');
    await page.click('#f-started');
    await page.fill('#f-time', '07:00');
    await page.click('#f-go');
    await page.waitForTimeout(80);
    await page.click('[data-act="toggle"]');
    await page.waitForTimeout(60);
    ok('chip dice En pausa', (await page.locator('.chip').textContent()) === 'En pausa');
    ok('boton cambia a Reanudar', (await page.locator('[data-act="toggle"]').textContent()) === 'Reanudar');
    ok('fin previsto desconocido en pausa',
       (await page.locator('.card-win').textContent()).includes('en pausa'));
    const frozen = await page.locator('.read-main').textContent();

    // Avanza el reloj 1h con el contador en pausa: no debe sumar.
    await page.evaluate(() => { const f = Date.now() + 3600000; Date.now = () => f; });
    await page.waitForTimeout(1300);
    ok('en pausa no suma tiempo', (await page.locator('.read-main').textContent()) === frozen,
       frozen + ' -> ' + await page.locator('.read-main').textContent());

    await page.click('[data-act="toggle"]');
    await page.waitForTimeout(60);
    ok('reanudar abre un segmento nuevo',
       await page.evaluate(() => CF.counters()[0].segments.length) === 2);
    ok('chip vuelve a En curso', (await page.locator('.chip').textContent()) === 'En curso');
    await page.click('[data-act="finish"]');
    await page.waitForTimeout(60);
    ok('finalizar quita la tarjeta', await page.locator('.card').count() === 0);
    ok('vuelve el estado vacío', await page.locator('#empty').isVisible());
    await ctx.close(); }

  // ---- 7. Turno de noche ----
  console.log('\n7. Turno nocturno: empecé 23:00, son las 02:00');
  { const { ctx, page } = await open(2, 0);
    await page.click('.tile[data-theme="working"]');
    await page.click('#f-started');
    await page.fill('#f-time', '23:00');
    await page.waitForTimeout(60);
    ok('reconoce que fue ayer', (await page.locator('#f-when-note').textContent()).startsWith('ayer'),
       await page.locator('#f-when-note').textContent());
    ok('3h transcurridas, no -20h', (await page.locator('#f-when-note').textContent()).includes('3h'),
       await page.locator('#f-when-note').textContent());
    await page.click('#f-go');
    await page.waitForTimeout(80);
    ok('tarjeta a 3:00', (await page.locator('.read-main').textContent()) === '3h00m',
       await page.locator('.read-main').textContent());
    await ctx.close(); }

  // ---- 8. Varios contadores a la vez ----
  console.log('\n8. Varios contadores simultáneos');
  { const { ctx, page } = await open(15, 40);
    await page.click('.tile[data-theme="working"]');
    await page.click('#f-go');
    await page.waitForTimeout(60);
    for (const t of ['homework', 'funtime']) {
      await page.click('#fab');
      await page.click(`.dchip[data-min="60"]`);
      await page.click('#f-go');
      await page.waitForTimeout(60);
    }
    ok('3 tarjetas vivas a la vez', await page.locator('.card').count() === 3);
    ok('cada una con su propio objetivo',
       JSON.stringify(await page.evaluate(() => CF.counters().map(c => c.targetMs))) === '[28800000,3600000,3600000]');
    await ctx.close(); }

  // ---- 9. Rampa de color y layout ----
  console.log('\n9. Rampa verde→rojo y layout');
  { const { ctx, page } = await open(12, 0);
    const r = await page.evaluate(() => [CF.ramp(0), CF.ramp(.5), CF.ramp(1), CF.ramp(2), CF.ramp(-1)]);
    ok('0% = verde (hue 142)', r[0] === 'hsl(142.0 70.0% 46.0%)', r[0]);
    ok('50% = amarillo (hue 71)', r[1] === 'hsl(71.0 83.0% 49.0%)', r[1]);
    ok('100% = rojo saturado (hue 0, 96%)', r[2] === 'hsl(0.0 96.0% 52.0%)', r[2]);
    ok('se recorta por arriba', r[3] === r[2]);
    ok('se recorta por abajo', r[4] === r[0]);
    const over = await page.evaluate(() =>
      document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    ok('sin scroll horizontal a 400px', over);
    await ctx.close(); }

  // ---- 10. Datos corruptos ----
  console.log('\n10. localStorage corrupto o vacío');
  { for (const bad of ['', 'no-json{', '[]', '[{"id":"x"}]', 'null']) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      const errs = [];
      page.on('pageerror', e => errs.push(String(e)));
      await page.addInitScript(atTime(10, 0));
      await page.addInitScript(s => { try { localStorage.setItem('chronosflow.v1', s); } catch (e) {} }, bad);
      await page.goto(APP);
      await page.waitForTimeout(100);
      ok(`arranca con ${JSON.stringify(bad).slice(0,14)}`,
         errs.length === 0 && await page.locator('#empty').isVisible(), errs.join('|'));
      await ctx.close();
    } }

  await browser.close();
  console.log('\n' + '='.repeat(46));
  console.log(`  ${pass} pasaron, ${fail} fallaron`);
  console.log('='.repeat(46));
  process.exit(fail ? 1 : 0);
})();
