import React, { useState, useEffect } from 'react';
import { Calendar, User, Monitor, HardDrive, Cpu, Settings, Building, Mail, MapPin, ArrowLeft, ArrowRight, Download, FileText } from 'lucide-react';
import { fetchSupabaseData } from './utils/supaBaseData';
import TarjetaCompacta from './components/tarjetaCompacta';
import DetalleCompleto from './components/detalleCompleto';
import { generatePDF } from './utils/generatePDF';
import { formatDate, getEstadoAsignacion } from './utils/chalanes';

const ResponsivasApp = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState(null);

  // Función para encontrar empleado por ID
  const findEmpleado = (id) => {
    return empleados.find(emp => emp.id === id);
  };

  // Función para encontrar equipo por ID
  const findEquipo = (id) => {
    return equipos.find(eq => eq.id === id);
  };

  const asignacionesFiltradas = asignaciones.filter((asignacion) => {
    const empleado = findEmpleado(asignacion.fk_empleado_id);
    const equipo = findEquipo(asignacion.fk_equipo_id);

    const textoBusqueda = busqueda.toLowerCase();

    // Buscar por nombre o ID de empleado/equipo
    return (
      empleado?.nombre_empleado?.toLowerCase().includes(textoBusqueda) ||
      equipo?.nombre?.toLowerCase().includes(textoBusqueda) ||
      equipo?.numero_serie?.toLowerCase().includes(textoBusqueda)
    );
  });

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

        // Seleccionar la primera asignación por defecto si existe
        if (asignacionesData.length > 0) {
          setAsignacionSeleccionada(asignacionesData[0]);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Actualizar selección cuando cambian los filtros
  useEffect(() => {
    if (asignacionesFiltradas.length > 0 && !asignacionesFiltradas.find(a => a.id === asignacionSeleccionada?.id)) {
      setAsignacionSeleccionada(asignacionesFiltradas[0]);
    } else if (asignacionesFiltradas.length === 0) {
      setAsignacionSeleccionada(null);
    }
  }, [asignacionesFiltradas, asignacionSeleccionada]);

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
              <input 
                type="search"
                name="" 
                id=""
                className='ml-6 px-3 py-1 border border-gray-300 rounded-md'
                placeholder='Buscar por empleado, equipo o serie'
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-500">
              {asignacionesFiltradas.length} asignaciones encontradas
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal con layout 2/3 - 1/3 */}
      <div className=" h-min mx-auto px-4 sm:px-6 lg:px-8 py-8 h-min">
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
          <div className="flex gap-6 h-[calc(100vh-200px)]">
            {/* Columna izquierda - Lista de tarjetas (2/3) */}
            <div className="w-2/3">
              <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Lista de Responsivas</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {asignacionesFiltradas.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No se encontraron resultados para tu búsqueda.</p>
                    </div>
                  ) : (
                    asignacionesFiltradas.map((asignacion) => {
                      const empleado = findEmpleado(asignacion.fk_empleado_id);
                      const equipo = findEquipo(asignacion.fk_equipo_id);
                      const estado = getEstadoAsignacion(asignacion.fecha_devolucion);
                      
                      return (
                        <TarjetaCompacta
                          key={asignacion.id}
                          asignacion={asignacion}
                          empleado={empleado}
                          equipo={equipo}
                          estado={estado}
                          isSelected={asignacionSeleccionada?.id === asignacion.id}
                          onClick={() => setAsignacionSeleccionada(asignacion)}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha - Detalle completo (1/3) */}
            <div className="w-1/3  h-min">
              <div className="bg-white rounded-lg shadow-sm border h-full">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    {asignacionSeleccionada ? `Detalle - Responsiva #${asignacionSeleccionada.id}` : 'Selecciona una responsiva'}
                  </h2>
                </div>
                <div className="h-full overflow-y-auto">
                  {asignacionSeleccionada ? (
                    <DetalleCompleto
                      asignacion={asignacionSeleccionada}
                      empleado={findEmpleado(asignacionSeleccionada.fk_empleado_id)}
                      equipo={findEquipo(asignacionSeleccionada.fk_equipo_id)}
                      estado={getEstadoAsignacion(asignacionSeleccionada.fecha_devolucion)}
                      formatDate={formatDate}
                      generatePDF={generatePDF}
                      generatingPDF={generatingPDF}
                      setGeneratingPDF={setGeneratingPDF}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <Monitor className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>Selecciona una responsiva de la lista para ver sus detalles completos</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsivasApp;