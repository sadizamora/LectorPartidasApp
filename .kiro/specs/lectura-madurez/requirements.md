# Requirements Document

## Introduction

Esta funcionalidad agrega un nuevo tipo de lectura de certificados llamado "Lectura madurez" al sistema existente de procesamiento de certificados de estudios. La funcionalidad se integra al modal de selección existente en la pantalla principal y utiliza la misma infraestructura de procesamiento de imágenes, pero con un parámetro adicional para identificar este tipo específico de certificado.

## Requirements

### Requirement 1

**User Story:** Como usuario del sistema, quiero poder seleccionar "Lectura madurez" como una opción adicional en el modal de tipos de lectura, para que pueda procesar certificados de madurez de manera específica.

#### Acceptance Criteria

1. WHEN el usuario presiona el botón "Certificados de estudios" THEN el sistema SHALL mostrar un modal con tres opciones: "Lectura normal", "Lectura con división de materias" y "Lectura madurez"
2. WHEN el usuario selecciona "Lectura madurez" THEN el sistema SHALL navegar a CamaraCertScreen con el parámetro Madurez: true
3. WHEN el modal se muestra THEN el sistema SHALL mantener el mismo diseño y estilo visual existente

### Requirement 2

**User Story:** Como desarrollador del sistema, quiero que el parámetro Madurez se pase correctamente a través de toda la cadena de procesamiento, para que el backend pueda identificar y procesar adecuadamente los certificados de madurez.

#### Acceptance Criteria

1. WHEN el usuario selecciona "Lectura madurez" THEN CamaraCertScreen SHALL recibir el parámetro Madurez: true en route.params
2. WHEN se procesa la imagen del certificado THEN el sistema SHALL enviar el parámetro Madurez al endpoint /schoolapi/utils/lectura_certificado_imagen
3. WHEN se envía la petición al API THEN el cuerpo de la petición SHALL incluir el campo Madurez con el valor correspondiente

### Requirement 3

**User Story:** Como usuario del sistema, quiero que la funcionalidad de "Lectura madurez" mantenga el mismo flujo de trabajo que las otras opciones de lectura, para que la experiencia sea consistente y familiar.

#### Acceptance Criteria

1. WHEN se selecciona "Lectura madurez" THEN el sistema SHALL mantener el mismo flujo de captura de fotos existente
2. WHEN se procesa un certificado de madurez THEN el sistema SHALL aplicar la misma lógica de validación y recuperación que los otros tipos
3. WHEN se completa el procesamiento THEN el sistema SHALL navegar a la pantalla de resultados con los mismos parámetros que las otras opciones
