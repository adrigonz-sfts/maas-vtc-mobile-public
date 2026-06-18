# CHECKPOINTS — Evaluación del estado final

> En sistemas multi-agente no se evalúa el camino, se evalúa el destino.
> Estos son los checkpoints objetivos que un juez (humano o IA) puede usar
> para decidir si el proyecto está sano.

## C1 — El arnés está completo

- [ ] Existen los 3 archivos base: `AGENTS.md`, `feature_list.json`,
      `progress/current.md`.
- [ ] Existen los 3 docs: `docs/architecture.md`, `docs/conventions.md`,
      `docs/verification.md`.
- [ ] `npm run test` termina con exit code 0.

## C2 — El estado es coherente

- [ ] Como mucho una feature en `in_progress` en `feature_list.json`.
- [ ] Toda feature `done` tiene tests asociados que pasan.
- [ ] `progress/current.md` está vacío o describe la sesión activa
      (no contiene basura de sesiones anteriores).

## C3 — El código respeta la arquitectura

- [ ] `src/` solo contiene los módulos previstos en `docs/architecture.md`.
- [ ] No hay dependencias externas en `requirements.txt` (debe estar vacío
      o no existir).
- [ ] No hay `console.log()` sueltos para debug, ni TODOs sin contexto.

## C4 — La verificación es real

- [ ] existe tiene al menos un test por módulo/vista/components... de `src/`.

## C5 — La sesión se cerró bien

- [ ] No hay archivos sin trackear sospechosos 
- [ ] `progress/history.md` tiene una entrada por la última sesión.
- [ ] La última feature trabajada está reflejada en su estado correcto.

## C6 — Pipeline multi-agente en código de producto

- [ ] Si hubo modificaciones bajo `src/`, `tests/` o `e2e/`, existe evidencia del pipeline §1.2 de `AGENTS.md`: p. ej. archivo `review.md` bajo `docs/progress/features/{fecha}/{feature_slug}/` con veredicto para la feature, o constancia explícita en `history.md` / `current.md` (líder → implementador → revisor). Excepción: tareas solo-docs/protocolo sin código de producto.

---

**Cómo usar este archivo:** un agente revisor (`.cursor/agents/reviewer.md`)
recorre cada checkbox, marca `[x]` o `[ ]`, y rechaza el cierre de sesión
si quedan boxes vacíos en C1-C6.