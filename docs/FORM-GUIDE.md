# Guía de Formularios

## Objetivo
Patrón consistente para formularios en la app: mismos estilos, soporte para todos los tipos de input (text, password, email, number, file, etc.) y uso de componentes compartidos.

## Componentes
- `FormField`: envoltorio con `label`, `error`, `helperText` y `required`. Decide qué control renderizar.
  - `fieldType`: `"input" | "select" | "textarea"` (por defecto `input`).
  - `inputType`: tipo HTML del input (`text`, `password`, `email`, `number`, `file`, `date`, etc.).
  - `options`: solo para `fieldType="select"`.
- Átomos:
  - `Input`: usa variables semánticas Tailwind (`bg-background`, `border-input`, `focus:ring-ring`, `placeholder:text-muted-foreground`) y variante `error`.
  - `Select`: mismo sistema de colores y tamaños `sm|md|lg`.
  - `Textarea`: mismo sistema de colores y tamaños `sm|md|lg`.

## Estilos (Tailwind semántico)
- Fondo/texto: `bg-background text-foreground`.
- Bordes: `border-input`; en error usar `border-error`.
- Focus: `focus:ring-ring` (+ `focus:ring-offset-2`) o `focus:ring-error` en error.
- Placeholder: `placeholder:text-muted-foreground`.
- Estados: `disabled:opacity-60 disabled:cursor-not-allowed`.

## Ejemplos
```tsx
// Input de texto
<FormField
  label="Título"
  name="titulo"
  fieldType="input"
  inputType="text"
  required
  placeholder="Ingresa el título"
/>

// Password
<FormField
  label="Contraseña"
  name="password"
  fieldType="input"
  inputType="password"
  required
/>

// Email con helper
<FormField
  label="Correo"
  name="email"
  fieldType="input"
  inputType="email"
  helperText="Usaremos este correo para notificaciones."
/>

// Archivo (ej: portada)
<FormField
  label="Portada"
  name="portada"
  fieldType="input"
  inputType="file"
  accept="image/*"
/>

// Select
<FormField
  label="Categoría"
  name="categoria_id"
  fieldType="select"
  options={categorias.map(c => ({ value: c.categoria_id.toString(), label: c.nombre }))}
  placeholder="Selecciona categoría"
/>

// Textarea
<FormField
  label="Descripción"
  name="descripcion"
  fieldType="textarea"
  rows={4}
/>
```

## Buenas prácticas
- Usar `FormField` para mantener etiquetas, mensajes de error y accesibilidad homogéneos.
- Pasar `inputType` en vez de `type` para inputs HTML.
- Mostrar errores de validación con la prop `error` (el componente ya añade `aria-invalid` y `aria-describedby`).
- Mantener la lógica de validación en hooks/funciones separadas del render.
- Para `file`, guarda el `File` en estado o súbelo vía `FormData` según el flujo; agrega vista previa con `URL.createObjectURL` si aplica (limpia la URL al desmontar).

