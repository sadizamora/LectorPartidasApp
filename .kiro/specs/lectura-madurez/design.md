# Design Document

## Overview

La funcionalidad "Lectura madurez" se integra al sistema existente de procesamiento de certificados agregando una tercera opción al modal de selección de tipos de lectura. Esta funcionalidad reutiliza completamente la infraestructura existente de captura y procesamiento de imágenes, añadiendo únicamente un nuevo parámetro `Madurez` que se propaga desde la interfaz de usuario hasta la API del backend.

## Architecture

La arquitectura sigue el mismo patrón existente en el sistema:

```
HomeScreen (Modal de selección)
    ↓ (navegación con parámetros)
CamaraCertScreen (procesamiento de imagen)
    ↓ (petición HTTP con parámetros)
API Backend (/schoolapi/utils/lectura_certificado_imagen)
```

### Flujo de Datos

1. **Selección de Tipo**: Usuario selecciona "Lectura madurez" en el modal
2. **Navegación**: Se navega a CamaraCertScreen con `Madurez: true`
3. **Procesamiento**: Se captura y procesa la imagen igual que otros tipos
4. **API Call**: Se envía petición incluyendo el parámetro `Madurez`
5. **Resultado**: Se procesa la respuesta con la misma lógica existente

## Components and Interfaces

### HomeScreen.jsx

**Modificaciones requeridas:**

- Agregar un tercer botón "Lectura madurez" al modal existente
- Configurar navegación con parámetro `Madurez: true`
- Mantener todos los estilos y comportamientos existentes

**Estructura del Modal (actualizada):**

```jsx
<Modal visible={showCertModal}>
  <View>
    <Text>Selecciona el tipo de lectura</Text>

    {/* Botón existente 1 */}
    <TouchableHighlight onPress={() => navigate con SubMateria: false}>
      <Text>Lectura normal</Text>
    </TouchableHighlight>

    {/* Botón existente 2 */}
    <TouchableHighlight onPress={() => navigate con SubMateria: true}>
      <Text>Lectura con división de materias</Text>
    </TouchableHighlight>

    {/* NUEVO: Botón 3 */}
    <TouchableHighlight onPress={() => navigate con Madurez: true}>
      <Text>Lectura madurez</Text>
    </TouchableHighlight>

    {/* Botón cancelar existente */}
    <TouchableHighlight onPress={() => cerrar modal}>
      <Text>Cancelar</Text>
    </TouchableHighlight>
  </View>
</Modal>
```

### CamaraCertScreen.jsx

**Modificaciones requeridas:**

- Extraer el parámetro `Madurez` de `route.params`
- Incluir `Madurez` en el cuerpo de la petición HTTP al API
- Mantener toda la lógica de procesamiento existente sin cambios

**Parámetros de entrada (actualizado):**

```javascript
const { dataAlumno, carnet, user, SubMateria, Madurez } = route.params;
```

**Petición HTTP (actualizada):**

```javascript
body: JSON.stringify({
  FotoCertificado: encoded[0],
  Carnet: carnet,
  SubMateria: SubMateria || 0,
  Madurez: Madurez || false, // NUEVO parámetro
});
```

## Data Models

No se requieren cambios en los modelos de datos existentes. El parámetro `Madurez` es un booleano simple que se propaga a través del sistema.

### Parámetros de Navegación

```typescript
interface NavigationParams {
  dataAlumno: object;
  carnet: string;
  user: object;
  SubMateria: boolean;
  Madurez?: boolean; // NUEVO parámetro opcional
}
```

### Cuerpo de Petición API

```typescript
interface APIRequestBody {
  FotoCertificado: string; // base64
  Carnet: string;
  SubMateria: number; // 0 o 1
  Madurez: boolean; // NUEVO campo
}
```

## Error Handling

La funcionalidad reutiliza completamente el manejo de errores existente:

- **Errores de captura**: Manejados por la lógica existente de la cámara
- **Errores de procesamiento**: Manejados por el try-catch existente en `handleConfirm`
- **Errores de API**: Manejados por la lógica existente de respuesta HTTP
- **Errores de validación**: Manejados por la lógica existente de materias reprobadas

No se requieren nuevos mecanismos de manejo de errores.

## Testing Strategy

### Pruebas de Integración

1. **Flujo completo**: Verificar que el parámetro `Madurez` se propague correctamente desde HomeScreen hasta la API
2. **Modal de selección**: Verificar que el nuevo botón aparezca y funcione correctamente
3. **Navegación**: Verificar que los parámetros se pasen correctamente entre pantallas
4. **API**: Verificar que el parámetro `Madurez` se incluya en la petición HTTP

### Pruebas de UI

1. **Diseño del modal**: Verificar que el tercer botón mantenga la consistencia visual
2. **Espaciado**: Verificar que el modal se ajuste correctamente con tres botones
3. **Interacción**: Verificar que todos los botones respondan correctamente

### Casos de Prueba

1. **Caso normal**: Seleccionar "Lectura madurez" y completar el flujo exitosamente
2. **Caso de cancelación**: Cancelar desde el modal y verificar que no se navegue
3. **Caso de error**: Simular error de API y verificar manejo correcto
4. **Caso de materias reprobadas**: Verificar que la lógica de recuperación funcione igual

## Implementation Notes

### Principios de Diseño

- **Reutilización**: Máxima reutilización del código existente
- **Consistencia**: Mantener patrones y estilos existentes
- **Simplicidad**: Cambios mínimos y focalizados
- **Compatibilidad**: No afectar funcionalidades existentes

### Consideraciones Técnicas

- El parámetro `Madurez` es opcional y por defecto es `false`
- Se mantiene compatibilidad con llamadas existentes que no incluyan este parámetro
- No se requieren cambios en la base de datos o configuración
- La funcionalidad es completamente aditiva, no modifica comportamientos existentes
