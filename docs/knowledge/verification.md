# Verificación — Cómo demostrar que el trabajo funciona

> Regla de oro: **el agente no dice "funciona", lo demuestra**.
> Toda feature termina con evidencia ejecutable, no con afirmaciones.

## Niveles de verificación

### Nivel 1 — Tests unitarios (obligatorio)

Todos los archivos components, composables tienen un test por funcionalidad:

1. Cubre el camino feliz.
2. Cubre al menos un camino de error si la función puede fallar.

Comando:
```bash
npm run test
```

### Nivel 2 — Test de integración del CLI (obligatorio para features de UI)

Vistas y modulos tienen datos mokeados y deben cumplir los mismos check que el punto 1.

## Anti-patrones (no hacer)

- ❌ "He añadido el comando, debería funcionar." → falta test ejecutable.
- ❌ Test que solo verifica que la función no lanza excepción. → tiene que
  comprobar el resultado concreto.
- ❌ Marcar la feature como `done` sin pasar tests.

## Verificación final antes de cerrar

Si la sesión **modificó código bajo `src/`**, ejecuta:

```bash
npm run test
```

y el resto del bloque de cierre de `AGENTS.md` §5 (`lint:fix`, `type-check`).

Si **no** tocaste `src/` (solo documentación, reglas Cursor, progreso), **no**

es obligatorio lanzar `npm run test` para cerrar; documenta en `current.md` qué

cambió.

Si los tests están en rojo cuando sí aplican, **no** marques nada como `done`.

Anota el bloqueo en `progress/current.md` y redirige al leader. Los tests no

deben reescribirse salvo que haya cambiado el flujo que les afectaba bajo la

petición del usuario.