# Implementation Plan

- [x] 1. Agregar botón "Lectura madurez" al modal de HomeScreen

  - Modificar el modal existente para incluir un tercer botón con el texto "Lectura madurez"
  - Configurar el botón para navegar a CamaraCertScreen con el parámetro Madurez: true
  - Mantener el mismo estilo visual y espaciado que los botones existentes
  - Asegurar que el modal se ajuste correctamente con tres botones
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Modificar CamaraCertScreen para recibir y procesar el parámetro Madurez

  - Extraer el parámetro Madurez de route.params en la destructuración existente
  - Incluir el parámetro Madurez en el cuerpo de la petición HTTP al endpoint /schoolapi/utils/lectura_certificado_imagen
  - Asegurar que el parámetro se envíe como booleano con valor por defecto false
  - Mantener toda la lógica de procesamiento existente sin modificaciones
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 3. Verificar el flujo completo de la funcionalidad

  - Probar que el botón "Lectura madurez" aparezca correctamente en el modal
  - Verificar que la navegación funcione correctamente con el nuevo parámetro
  - Confirmar que el parámetro Madurez se incluya en la petición HTTP
  - Asegurar que el flujo de procesamiento mantenga el mismo comportamiento que las otras opciones
  - _Requirements: 3.1, 3.2, 3.3_
