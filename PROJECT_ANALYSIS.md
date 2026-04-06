# ANÁLISIS DEL PROYECTO TRACKERMAKER

## 📋 DESCRIPCIÓN GENERAL

**TrackerMaker** es una aplicación móvil Expo/React Native para rastrear hábitos diarios. Permite crear, monitorear y visualizar el progreso de hábitos en un calendario de 6 meses con interfaz tema claro/oscuro.

**Stack Tecnológico:**

- React Native + Expo 54
- React Navigation + Expo Router
- TypeScript
- AsyncStorage (persistencia)
- React Native Reanimated (animaciones)
- date-fns (manejo de fechas)

---

## 📁 ESTRUCTURA DE ARCHIVOS

### **app/ (Navegación y Pantallas)**

#### `_layout.tsx` - Layout Raíz

- **Propósito:** Configurar la estructura global de la aplicación
- **Componentes:**
  - `ThemeProvider`: Proporciona tema a toda la app
  - `Stack`: Navegación por pantallas (Expo Router)
  - `SafeAreaProvider`: Manejo de áreas seguras
  - `GestureHandlerRootView`: Habilita gestos

#### `index.tsx` - Pantalla Principal

- **Propósito:** Pantalla de inicio con listado de hábitos
- **Estados:**
  - `habits`: Array de hábitos
  - `modalVisible`: Mostrar/ocultar modal de crear
  - `menuOpen`: Menú deslizable abierto
  - `showSettings`: Panel de configuración
  - `habitToDelete`: Hábito seleccionado para eliminar
- **Funciones principales:**
  - `loadHabits()`: Cargar hábitos del almacenamiento
  - `saveHabits()`: Guardar cambios en hábitos
  - `deleteHabit()`: Eliminar hábito por ID
  - `openMenu()/closeMenu()`: Animar menú lateral

---

## 🔧 UTILITIES (utils/)

### `storage.ts` - Persistencia de Datos

```
saveHabits(habits): Guardar array de hábitos en AsyncStorage
loadHabits(): Recuperar hábitos almacenados
```

- **Clave almacenada:** `"HABITS"`
- **Formato:** JSON

### `date.ts` - Lógica de Fechas y Cálculos

- **`generateSixMonthRange()`**: Genera array de fechas 3 meses atrás + 4 meses adelante
- **`groupByWeeks(dates)`**: Agrupa fechas por semanas (comienzan lunes)
- **`isToday(date)`**: Verifica si una fecha es hoy
- **`calculateStreak(records)`**:
  - Calcula racha actual de días consecutivos
  - Considera hoy y ayer para no interrumpir racha
- **`calculateBestStreak(records)`**: Calcula la racha más larga registrada histórica
- **Formato de fechas:** ISO (`YYYY-MM-DD`)

### `calendar.ts`

- **Estado:** Vacío (no utilizado actualmente)

---

## 🎨 CONTEXTOS (context/)

### `ThemeContext.tsx` - Gestión de Tema

**Tipos:**

- `ThemeMode`: `"light" | "dark" | "automatic"`
- `ThemeColors`: Interfaz con propiedades: background, surface, border, text, subtext, accent

**Colores:**

- **Light:** Background blanco (#f5f5f5), texto oscuro (#111111)
- **Dark:** Background negro (#000000), texto blanco (#ffffff)
- **Accent:** Verde (#22c55e) en ambos temas

**Funciones:**

- `ThemeProvider`: Wrapper que proporciona tema
- `useTheme()`: Hook para acceder a colores y modo actual
- Persiste preferencia en AsyncStorage

---

## 🧩 COMPONENTES (components/)

### `HabitCard.tsx` - Tarjeta Individual de Hábito

**Props:**

- `habit`: Objeto Habit a mostrar
- `onUpdate()`: Callback cuando se modifica
- `onDelete()`: Callback para eliminar
- `onLongPress()`: Callback para presión larga

**Funciones:**

- Muestra nombre + emoji editable
- Renderiza racha actual y mejor racha histórica
- Contiene grid de 6 meses de progreso
- **Longpress:** Activa haptic feedback (vibración)

### `HabitGrid.tsx` - Grid de Progreso (6 Meses)

**Props:**

- `records`: Array de fechas ISO registradas
- `onToggle()`: Callback al tocar una celda

**Funciones:**

- Genera vista de mes-a-mes con celdas de días
- Celdas rellenas = día completado
- Muestra nombres de meses abreviados
- **Animación:** Celdas se animan con spring al tocar

### `AddHabitModal.tsx` - Modal para Crear Hábito

**Props:**

- `visible`: Mostrar/ocultar modal
- `onClose()`: Callback cerrar
- `onCreate(name)`: Callback crear con nombre

**Features:**

- Input de texto para nombre
- Validación: no permite nombres vacíos
- Botón crear (verde) y cerrar (X)

### `EmojiPickerModal.tsx` - Selector de Emojis

**Categorías:**

1. Ejercicio (💪, 🏃, 🏋️, etc.)
2. Salud (💧, 🥗, 🍎, etc.)
3. Mente (🧠, 📚, 📖, etc.)
4. Creatividad (🎨, 🎵, 🎤, etc.)
5. Productividad (💰, 📅, ⏰, etc.)

**Props:**

- `visible`: Mostrar/ocultar
- `onSelect(emoji)`: Callback al seleccionar
- `onClose()`: Callback cerrar

### `DeleteSlider.tsx` - Componente Deslizable para Eliminar

**Funcionalidad:**

- Slider rojo (#7f1d1d) con ícono basura
- Arrastra 80% del ancho para confirmar eliminación
- **Animación:** Spring al soltar si no alcanza umbral
- Usa react-native-gesture-handler para gestos

### `SettingsScreen.tsx` - Panel de Configuración

**Opciones:**

1. Tema Claro (sunny-outline)
2. Automático (contrast-outline) - sigue sistema
3. Tema Oscuro (moon-outline)

**Funciones:**

- Botón atrás para cerrar
- Visual feedback con fondo coloreado en opción activa
- Persiste preferencia en AsyncStorage

---

## 📊 TIPOS (types/)

### `habit.ts`

```typescript
type Habit = {
  id: string; // UUID o identificador único
  name: string; // Nombre del hábito
  emoji?: string; // Emoji asociado (opcional)
  createdAt: string; // Fecha creación ISO
  records: string[]; // Array de fechas ISO completadas
};
```

---

## 🔄 FLUJO DE DATOS

```
App (index.tsx)
  ├── Carga hábitos → loadHabits() → AsyncStorage
  ├── HabitCard (para cada hábito)
  │   ├── HabitGrid (calendario 6 meses)
  │   ├── calculateStreak/calculateBestStreak
  │   └── EmojiPickerModal (seleccionar emoji)
  ├── AddHabitModal (crear nuevo)
  ├── DeleteSlider (confirmar eliminación)
  ├── SettingsScreen (tema)
  └── Guarda cambios → saveHabits() → AsyncStorage
```

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

✅ Crear/eliminar hábitos  
✅ Marcar días completados (grid de 6 meses)  
✅ Calcular rachas (actual y mejor histórica)  
✅ Selector de emojis por categoría  
✅ Tema claro/oscuro/automático  
✅ Menú lateral deslizable  
✅ Persistencia en AsyncStorage  
✅ Gestos nativos (deslizar, presión larga)  
✅ Animaciones fluidas (Reanimated)  
✅ Haptic feedback (vibración)

---

## 🚀 PRÓXIMAS MEJORAS SUGERIDAS

- [ ] Estadísticas detalladas (gráficos)
- [ ] Exportar datos (CSV/JSON)
- [ ] Recordatorios/notificaciones
- [ ] Categorías de hábitos
- [ ] Búsqueda de hábitos
- [ ] Sincronización en la nube
- [ ] Sharing/comparar con otros usuarios
