# Arquitectura — Qué significa "hacer un buen trabajo"

> Este documento define el estándar de calidad para el frontend (Vue 3, DDD pragmático). 

## Principios

1. **Capas claras y dirección única de dependencias.** El código se organiza para que los imports solo fluyan **hacia dentro**, hacia `core/domain`:
   - **`views`** — rutas, layouts, composición fina; sin reglas de negocio ni IO directo.
   - **`modules`** — secciones “inteligentes” de UI; orquesta componentes y store; delega reglas a `core/services` / `core/domain`; Si el modulo forma parte de una vista, crear /modules en la carpeta de la vista; si el modulo se comparte se promociona a /shared/modules.
   - **`shared`** — componentes reutilizables, composables genéricos, utilidades; **sin** acceso al store ni llamadas a `core/services` (recibe datos desde vistas/módulos/store).
   - **`store`** — estado, acciones y getters; **delega** en `core/services`; no contiene lógica de dominio ni mapeos DTO.
   - **`core/services`** — casos de uso, orquestación y **únicos** mapeadores entre respuestas crudas y modelos de dominio.
   - **`core/api`** — HTTP, cliente, serialización; sin reglas de negocio ni conocimiento de shapes de dominio más allá de DTOs.
   - **`core/domain`** — invariantes, entidades **inmutables**, funciones puras y deterministas; **sin IO**.

2. **Dominio puro.** `core/domain` no depende de `core/api`, `core/services`, `store`, `shared`, `modules` ni `views`. Fechas, aleatoriedad y estado global solo entran como **argumentos** explícitos.

3. **IO solo en API.** Toda persistencia y red vive en `core/api`. En **producción**, la UI no llama endpoints directamente (en tests se puede aislar IO mockeando `core/api`).

4. **Mapeos centralizados.** DTO → dominio y dominio → lo que corresponda ocurre en `core/services`, no en `store` ni en vistas.

5. **Errores de dominio explícitos.** Validaciones e invariantes pueden lanzar errores de dominio; no “tragar” fallos silenciosamente en capas altas sustituyendo reglas de negocio.

6. **Inmutabilidad en el dominio.** Las entidades de dominio no se mutan in-place; se aplican transformaciones que producen **nuevos** valores u objetos según las reglas del dominio.

7. Directorios como norma, todos los ficheros (composables, vistas, modulos, etc) han de existir dentro de un directorio con su propio nombre y los tests estaran en dicho directorio en /__tests__

## Flujo de datos

```
eventos de usuario (views / modules / componentes)
              │
              ▼
            store
              │  delega carga / comandos
              ▼
       core/services  ──mapea──►  core/domain
              │
              │  IO (HTTP, storage, APIs del navegador)
              ▼
          core/api
              │
              ▼
         red / backend / sistema

core/domain no depende de capas exteriores.
```

**Regla:** cualquier import debe respetar esta dirección; no dependencias circulares ni “atajos” hacia arriba.

## Qué NO hacer

- No realizar **ningún IO** en `core/domain`.
- No colocar **reglas de negocio** en `store`, `shared`, `modules` o `views`.
- No importar `core/api` desde `core/domain`.
- No importar `store` ni `views` en `core/services` o `core/domain`.
- No invocar **endpoints desde componentes** en código de producción.
- No poner **mappers** en el store ni en las vistas (solo en `core/services`).
- No acceder al **store** desde composables en `shared`.
- No llamar **`core/services`** desde `shared`.
- No **mutar** entidades del dominio.

## Disciplina arquitectónica (agentes y contribuidores)

- Elegir la capa correcta **antes** de escribir código; no añadir capas, carpetas o abstracciones nuevas sin necesidad acordada.
- No rediseñar la estructura del repo en cambios acotados.
- No refactorizar código no relacionado con la tarea actual.
