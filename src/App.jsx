import React, { useState, useEffect } from 'react';
import { Calendar, User, Monitor, HardDrive, Cpu, Settings, Building, Mail, MapPin, ArrowLeft, ArrowRight, Download, FileText } from 'lucide-react';
import { fetchSupabaseData } from './utils/supaBaseData';
import { generatePDF } from './utils/generatePDF';
const ResponsivasApp = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  
  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Cargar datos de las tres tablas en paralelo
        const [asignacionesData, equiposData, empleadosData] = await Promise.all([
          fetchSupabaseData('app_asignacion'),
          fetchSupabaseData('app_equipo'),
          fetchSupabaseData('app_empleado')
        ]);

        setAsignaciones(asignacionesData);
        setEquipos(equiposData);
        setEmpleados(empleadosData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Función para encontrar empleado por ID
  const findEmpleado = (id) => {
    return empleados.find(emp => emp.id === id);
  };

  // Función para encontrar equipo por ID
  const findEquipo = (id) => {
    return equipos.find(eq => eq.id === id);
  };

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para determinar el estado de la asignación
  const getEstadoAsignacion = (fechaDevolucion) => {
    if (!fechaDevolucion) {
      return { texto: 'Activa', color: 'bg-green-100 text-green-800' };
    }
    return { texto: 'Devuelta', color: 'bg-gray-100 text-gray-800' };
  };

  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando responsivas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">

              <Monitor className="h-8 w-8 text-blue-600 mr-3" />

              <h1 className="text-xl font-semibold text-gray-900">
                Sistema de Responsivas
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              {asignaciones.length} asignaciones encontradas
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {asignaciones.length === 0 ? (
          <div className="text-center py-12">
            <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay asignaciones disponibles
            </h3>
            <p className="text-gray-600">
              No se encontraron asignaciones en la base de datos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {asignaciones.map((asignacion) => {
              const empleado = findEmpleado(asignacion.fk_empleado_id);
              const equipo = findEquipo(asignacion.fk_equipo_id);
              const estado = getEstadoAsignacion(asignacion.fecha_devolucion);

              return (
                <div key={asignacion.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  {/* Header del card */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Responsiva #{asignacion.id}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${estado.color}`}>
                        {estado.texto}
                      </span>
                    </div>
                  </div>

                  {/* Información del empleado */}
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center mb-3">
                      <User className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-gray-900">Empleado</h4>
                    </div>
                    {empleado ? (
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium min-w-[60px]">Nombre:</span>
                          <span>{empleado.nombre_empleado}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-1" />
                          <span>{empleado.correo}</span>
                        </div>
                        {empleado.puesto && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Building className="h-4 w-4 mr-1" />
                            <span>{empleado.puesto}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-red-600">Empleado no encontrado</p>
                    )}
                  </div>

                  {/* Información del equipo */}
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center mb-3">
                      <Monitor className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="font-medium text-gray-900">Equipo</h4>
                    </div>
                    {equipo ? (
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium min-w-[60px]">Nombre:</span>
                          <span>{equipo.nombre}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium min-w-[60px]">Marca:</span>
                          <span>{equipo.marca}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium min-w-[60px]">Modelo:</span>
                          <span>{equipo.modelo}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium min-w-[60px]">Serie:</span>
                          <span className="font-mono text-xs">{equipo.numero_serie}</span>
                        </div>

                        {/* Especificaciones técnicas */}
                        {(equipo.ram || equipo.procesador || equipo.capacidad_almacenamiento) && (
                          <div className="mt-3 pt-2 border-t border-gray-100">
                            <div className="flex items-center mb-2">
                              <Settings className="h-4 w-4 text-gray-600 mr-1" />
                              <span className="text-xs font-medium text-gray-700">Especificaciones</span>
                            </div>
                            {equipo.ram && (
                              <div className="flex items-center text-xs text-gray-600">
                                <Cpu className="h-3 w-3 mr-1" />
                                <span>RAM: {equipo.ram}GB</span>
                              </div>
                            )}
                            {equipo.capacidad_almacenamiento && (
                              <div className="flex items-center text-xs text-gray-600">
                                <HardDrive className="h-3 w-3 mr-1" />
                                <span>Almacenamiento: {equipo.capacidad_almacenamiento}GB</span>
                              </div>
                            )}
                            {equipo.procesador && (
                              <div className="text-xs text-gray-600 mt-1">
                                <span className="font-medium">CPU:</span> {equipo.procesador}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-red-600">Equipo no encontrado</p>
                    )}
                  </div>

                  {/* Información de la asignación */}
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center mb-3">
                      <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                      <h4 className="font-medium text-gray-900">Asignación</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <ArrowRight className="h-4 w-4 mr-1" />
                        <span className="font-medium min-w-[70px]">Asignado:</span>
                        <span>{formatDate(asignacion.fecha_asignacion)}</span>
                      </div>
                      {asignacion.fecha_devolucion && (
                        <div className="flex items-center text-sm text-gray-600">
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          <span className="font-medium min-w-[70px]">Devuelto:</span>
                          <span>{formatDate(asignacion.fecha_devolucion)}</span>
                        </div>
                      )}
                      {asignacion.observaciones && (
                        <div className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Observaciones:</span>
                          <p className="mt-1 text-xs">{asignacion.observaciones}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botón para generar PDF */}
                  <div className="px-6 py-4">
                    <button
                      onClick={() =>
                        generatePDF({
                          asignacion,
                          empleado: findEmpleado(asignacion.fk_empleado_id),
                          equipo: findEquipo(asignacion.fk_equipo_id),
                          estado: getEstadoAsignacion(asignacion.fecha_devolucion),
                          formatDate,
                          setGeneratingPDF,
                        })
                      }

                      disabled={generatingPDF}
                      className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${generatingPDF
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        } transition-colors duration-200`}
                    >
                      {generatingPDF ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generando PDF...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Generar PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsivasApp;