#!/usr/bin/env node
/**
 * check-dev-port.mjs — Preflight del puerto de desarrollo.
 *
 * `nuxt dev --port 3005` no falla cuando el puerto está ocupado: get-port-please
 * (el módulo que usa Nuxt) elige silenciosamente un puerto alternativo del rango
 * 3000-3100. En esta máquina ese rango empieza en el 3000, que es el puerto del
 * backend de miniShop — así es como se genera el "conflicto" entre las dos apps
 * que corren con `npm run dev`.
 *
 * Este script verifica ANTES de arrancar que el puerto 3005 esté libre y, si no,
 * muestra quién lo ocupa (PID + proceso) y cómo liberarlo. Sale con código 0 si
 * está libre y npm continúa con `nuxt dev --port 3005`.
 *
 * El puerto debe mantenerse sincronizado con el script `dev` de package.json.
 */
import net from 'node:net';
import { spawnSync } from 'node:child_process';

const PORT = 3005;

/**
 * Devuelve true si el puerto está libre en ese host. Los errores que no son
 * EADDRINUSE/EACCES (p. ej. sin IPv6 en la máquina) se tratan como "libre":
 * no hay nadie escuchando, simplemente no se puede bindear ese stack.
 */
function isPortFree(port, host) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      resolve(err.code === 'EADDRINUSE' || err.code === 'EACCES' ? false : true);
    });
    server.once('listening', () => server.close(() => resolve(true)));
    server.listen(port, host);
  });
}

const [ipv4Free, ipv6Free] = await Promise.all([
  isPortFree(PORT, '127.0.0.1'),
  isPortFree(PORT, '::1')
]);

if (ipv4Free && ipv6Free) {
  process.exit(0);
}

console.error(`\n❌ El puerto ${PORT} ya está en uso.`);
console.error(`   Nuxt NO debería arrancar: si lo hace, caería al puerto 3000 y chocaría con la otra app.\n`);

if (process.platform === 'win32') {
  const netstat = spawnSync('netstat', ['-ano'], { encoding: 'utf8' });
  if (!netstat.error && netstat.stdout) {
    const pids = new Set();
    for (const line of netstat.stdout.split(/\r?\n/)) {
      if (line.includes(`:${PORT}`) && /LISTENING/i.test(line)) {
        const pid = line.trim().split(/\s+/).pop();
        if (/^\d+$/.test(pid)) pids.add(pid);
      }
    }
    for (const pid of pids) {
      const task = spawnSync('tasklist', ['/FI', `PID eq ${pid}`, '/FO', 'CSV', '/NH'], { encoding: 'utf8' });
      const name = (task.stdout?.split(',')[0] ?? '').replace(/"/g, '') || 'desconocido';
      console.error(`   → Ocupado por el PID ${pid} (${name})`);
      console.error(`     Para liberarlo:  taskkill /PID ${pid} /F`);
    }
  }
}

console.error('\n   Si es un server huérfano de Magikolor de una sesión anterior (pasa seguido en');
console.error('   Windows: el proceso node queda vivo al cerrar la terminal), liberalo con:');
console.error('\n     netstat -ano | findstr :' + PORT + '    → anotá el PID');
console.error('     taskkill /PID <PID> /F\n');
process.exit(1);
