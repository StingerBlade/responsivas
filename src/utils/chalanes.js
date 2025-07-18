// Función para formatear fechas
export const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  
  // Función para determinar el estado de la asignación
  export const getEstadoAsignacion = (fechaDevolucion) => {
    if (!fechaDevolucion) {
      return { texto: 'Activa', color: 'bg-green-100 text-green-800' };
    }
    return { texto: 'Devuelta', color: 'bg-gray-100 text-gray-800' };
  };

  