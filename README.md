# Gestión de Asistentes IA

Aplicación web para gestionar asistentes de IA: crear, editar, eliminar y entrenar. Desarrollada con Next.js, TypeScript y persistencia en localStorage.

## Cómo correr

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- React Hook Form + Zod
- shadcn/ui (Radix UI + Tailwind CSS)
- localStorage para persistencia

## Características implementadas

✅ **Listado de asistentes**: Tarjetas con información (nombre, idioma, tono) y acciones (editar, eliminar, entrenar)  
✅ **Formulario de 2 pasos**: Validaciones en tiempo real, no permite avanzar sin completar paso 1  
✅ **Validación de porcentajes**: Verifica que la suma de longitudes de respuesta sea exactamente 100%  
✅ **CRUD completo**: Crear, editar y eliminar con confirmación y feedback visual  
✅ **Página de entrenamiento**: Ruta dinámica `/asistentes/[id]` con información del asistente  
✅ **Editor de reglas**: Textarea con persistencia en localStorage, mensaje de éxito al guardar  
✅ **Chat simulado**: Respuestas aleatorias con delay 1-2s, indicador de "escribiendo", persistencia por asistente  
✅ **Persistencia completa**: Todos los datos (asistentes, reglas, conversaciones) persisten en localStorage  
✅ **Diseño responsive**: Mobile-first con breakpoints para tablet y desktop  

## Decisiones técnicas

**shadcn/ui**: Sistema de componentes basado en Radix UI, estilizado con Tailwind. Componentes accesibles, personalizables y copiables al proyecto (no dependencia npm).

**React Hook Form + Zod**: Validación type-safe con mensajes claros. `superRefine` de Zod para validación custom (suma de porcentajes = 100%). Modo `onChange` para feedback inmediato. Errores se muestran solo después de intentar avanzar/guardar.

**Custom hook `useAssistants`**: Centraliza toda la lógica de CRUD. Sincroniza estado local con localStorage. Optimistic updates: UI se actualiza inmediatamente, luego persiste.

**Servicios de datos**: Capa de abstracción sobre localStorage con delays simulados (simula llamadas a API). Funciones async para mantener consistencia con APIs reales. Fácil migración futura a API REST.

**localStorage SSR-safe**: Todas las operaciones verifican `typeof window !== 'undefined'` para evitar errores en SSR. Utilidades genéricas reutilizables (`getFromStorage`, `saveToStorage`).

**Estructura modular**: Separación clara entre componentes, servicios, hooks, schemas y tipos. Componentes UI reutilizables con variantes usando CVA. Tipos inferidos desde esquemas Zod para type-safety end-to-end.

**App Router de Next.js**: Rutas dinámicas para página de entrenamiento. Server Components donde es posible, Client Components para interactividad. Layout compartido con metadata.

## Estructura

```
src/
├── app/              # Rutas (App Router)
├── components/       # Componentes UI y de asistentes
├── hook/            # useAssistants
├── services/        # Capa de datos (localStorage)
├── schemas/         # Validaciones Zod
└── types/           # Tipos TypeScript
```

## Notas adicionales

- **Estados de carga**: Spinners y estados disabled durante operaciones asíncronas
- **Feedback visual**: Indicador de porcentajes con barra de progreso, mensajes de éxito/error claros
- **Chat UX**: Scroll automático, indicador de "escribiendo", delay variable para simular latencia real
- **Validaciones progresivas**: Errores se muestran después de intentar avanzar/guardar para mejor UX

## Priorización y funcionalidades no implementadas

Se priorizó implementar todas las funcionalidades requeridas en la prueba técnica. Las siguientes mejoras quedaron fuera por no ser requisitos obligatorios:

- **Búsqueda y filtrado de asistentes**: El listado muestra todos los asistentes sin opciones de búsqueda o filtrado. *Por qué*: Se priorizó la funcionalidad core del CRUD. Con pocos asistentes, la búsqueda no es crítica y añadiría complejidad sin valor inmediato.

- **Ordenamiento**: No hay opción para ordenar asistentes por diferentes criterios. El listado muestra los más recientes primero.

- **Tests unitarios**: No se incluyeron tests. *Por qué*: Se priorizó la funcionalidad y arquitectura preparada para testing futuro. Los tests añadirían tiempo significativo sin ser requisito explícito.

- **Manejo de errores más robusto**: Hay manejo básico de errores (try/catch en eliminación), pero no hay un sistema global de notificaciones de error visible para el usuario. *Por qué*: Los errores se manejan de forma localizada donde ocurren (validaciones en formularios, confirmaciones en eliminación). Para el alcance de la prueba, este enfoque proporciona feedback suficiente al usuario sin añadir la complejidad de un sistema global de notificaciones.

## Tiempo aproximado de dedicación

**Tiempo total: 7-8 horas**

El tiempo de desarrollo se puede verificar en el historial de commits de GitHub. El proyecto se desarrolló de forma incremental, con commits que reflejan cada funcionalidad implementada:

- Setup inicial y estructura del proyecto
- Componentes UI base (shadcn/ui)
- Formulario de 2 pasos con validaciones
- CRUD completo de asistentes
- Página de entrenamiento y chat simulado
- Persistencia y ajustes finales de UX

Cada commit documenta el progreso y las decisiones tomadas durante el desarrollo.
