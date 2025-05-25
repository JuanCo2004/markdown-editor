# Proyecto módulo 3
## Modelo de Historia de Usuario:
HU: Opción para cambiar fondo oscuro
Como usuario, quiero visualizar la pantalla en un modo oscuro para una mejor expeciriencia y comodidad.

*Criterios de Aceptación:*

**Condición 1**: Qué debe cumplirse para considerar esta historia completada
- El usuario debe poder activar o desactivar el modo oscuro desde un botón visible en la interfaz.

- Al activarse el modo oscuro, los colores de fondo, texto y elementos interactivos deben cambiar adecuadamente.

**Condición 2**: Comportamientos esperados o validaciones necesarias
- El botón debe alternar correctamente entre modo claro y oscuro sin recargar la página.

- El modo oscuro debe aplicarse a todas las áreas relevantes: editor y vista previa.

- La configuración debe mantenerse al cambiar de vista.

**Condición 3**: Consideraciones adicionales de UI/UX o manejo de errores
- El contraste del texto con el fondo debe seguir siendo accesible (cumplir mínimo AA).

- Las clases de Tailwind deben aplicarse sin conflictos (evitar superposición de estilos por JS).

- Si ocurre un error al cambiar el modo (por ejemplo, falta de clases), se debe registrar en consola para facilitar depuración.