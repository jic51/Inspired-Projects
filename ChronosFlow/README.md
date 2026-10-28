# ChronosFlow — Paso 1

Una pantalla. Responde "¿cuánto llevo?" sin que haya que restar horas.

Un archivo (`index.html`), sin dependencias, sin cuenta, sin servidor.
Ábrelo en el teléfono y añádelo a la pantalla de inicio.

## Qué hace

- **5 temas fijos**, sin escribir nombres: Deep Focus · Playtime · Homework · Working · Funtime.
  Cada uno con su duración por defecto (Working = 8h), así crear un contador son dos toques.
- **"Ya empecé"**: marcas la casilla, pones *07:00*, y la barra aparece ya llena al porcentaje
  que corresponde. Es la función que no tiene casi ninguna app de timer.
- **Barra verde → rojo**: toda la barra del mismo color, que va cambiando con el progreso
  (verde encendido → amarillo → rojo muy encendido) y parpadea al llegar al 100%.
- **Tiempo de más**: al pasar del 100% no se congela, muestra `+40m de más`.
- **Varios contadores a la vez**, cada uno con pausa y finalizar.
- Campana al cumplirse (WebAudio) y notificación del navegador si se concede el permiso.

## La decisión técnica que importa

Un contador **no** es `inicio + duración + pausa_acumulada`. Es una **lista de segmentos**:

```js
{ id, theme, targetMs, status, segments: [{ start, end }, …] }   // end: null = corriendo
```

Con eso, una jornada partida (7–11, almuerzo, 12–16) y una pausa son el mismo mecanismo,
y el tiempo siempre se deriva de marcas absolutas: cerrar la pestaña, bloquear el teléfono
o quedarse sin batería no lo desincroniza. Añadir el historial exportable en v2 no obliga
a migrar nada.

La hora de inicio retroactiva se resuelve a *hoy a esa hora*, o *ayer* si esa hora todavía
no ha llegado — así funciona también el turno de noche (empecé 23:00, son las 02:00).

## Qué NO lleva todavía, a propósito

Video de fondo, burbuja flotante, widget, sincronización y cuentas. Ninguna de esas cosas
sirve para la única pregunta del paso 1: ¿uso esto todos los días durante dos semanas?

## Pruebas

```
node test.js      # necesita playwright; usa un reloj fijo para probar la aritmética
```

61 comprobaciones: el caso real (entré a las 7:00, son las 15:40), progreso intermedio,
turno nocturno, pausa que no suma tiempo, persistencia al cerrar y reabrir, tiempo de más,
rampa de color, localStorage corrupto y ausencia de scroll horizontal a 400px.
