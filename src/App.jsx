import React, { useState, useEffect } from 'react';
import { Calendar, User, Monitor, HardDrive, Cpu, Settings, Building, Mail, MapPin, ArrowLeft, ArrowRight, Download, FileText, ToggleLeft, ToggleRight} from 'lucide-react';
import { fetchSupabaseData } from './utils/supaBaseData';
import TarjetaCompacta from './components/tarjetaCompacta';
import DetalleCompleto from './components/detalleCompleto';
import { generatePDF } from './utils/generatePDF';
import { formatDate, getEstadoAsignacion } from './utils/chalanes';

const ResponsivasApp = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState(null);
  const [vistaActual, setVistaActual] = useState('asignaciones'); // 'asignaciones' o 'prestamos'

  // Función para encontrar empleado por ID
  const findEmpleado = (id) => {
    return empleados.find(emp => emp.id === id);
  };

  // Función para encontrar equipo por ID
  const findEquipo = (id) => {
    return equipos.find(eq => eq.id === id);
  };

  // Obtener los datos actuales según la vista
  const datosActuales = vistaActual === 'asignaciones' ? asignaciones : prestamos;

  const datosFiltrados = datosActuales.filter((item) => {
    const empleado = findEmpleado(item.fk_empleado_id);
    const equipo = findEquipo(item.fk_equipo_id);

    const textoBusqueda = busqueda.toLowerCase();

    // Buscar por nombre o ID de empleado/equipo
    return (
      empleado?.nombre_empleado?.toLowerCase().includes(textoBusqueda) ||
      equipo?.nombre?.toLowerCase().includes(textoBusqueda) ||
      equipo?.numero_serie?.toLowerCase().includes(textoBusqueda)
    );
  });

  // Función para cambiar de vista
  const cambiarVista = (nuevaVista) => {
    setVistaActual(nuevaVista);
    setBusqueda(''); // Limpiar búsqueda al cambiar
    setAsignacionSeleccionada(null); // Limpiar selección
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Cargar datos de las cuatro tablas en paralelo
        const [asignacionesData, prestamosData, equiposData, empleadosData] = await Promise.all([
          fetchSupabaseData('app_asignacion'),
          fetchSupabaseData('app_prestamo'),
          fetchSupabaseData('app_equipo'),
          fetchSupabaseData('app_empleado')
        ]);

        setAsignaciones(asignacionesData);
        setPrestamos(prestamosData);
        setEquipos(equiposData);
        setEmpleados(empleadosData);

        // Seleccionar el primer elemento por defecto si existe
        const datosIniciales = vistaActual === 'asignaciones' ? asignacionesData : prestamosData;
        if (datosIniciales.length > 0) {
          setAsignacionSeleccionada(datosIniciales[0]);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Actualizar selección cuando cambian los filtros o la vista
  useEffect(() => {
    if (datosFiltrados.length > 0 && !datosFiltrados.find(a => a.id === asignacionSeleccionada?.id)) {
      setAsignacionSeleccionada(datosFiltrados[0]);
    } else if (datosFiltrados.length === 0) {
      setAsignacionSeleccionada(null);
    }
  }, [datosFiltrados, asignacionSeleccionada]);

  // Actualizar selección cuando cambia la vista
  useEffect(() => {
    const datosVista = vistaActual === 'asignaciones' ? asignaciones : prestamos;
    if (datosVista.length > 0) {
      setAsignacionSeleccionada(datosVista[0]);
    } else {
      setAsignacionSeleccionada(null);
    }
  }, [vistaActual, asignaciones, prestamos]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
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
      <div className="bg-white shadow-sm border-b w-full">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-16 w-full">
            <div className="flex items-center w-full">
              <Monitor className="h-8 w-8 text-blue-600 mr-3" />
              
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema de {vistaActual === 'asignaciones' ? 'Responsivas' : 'Préstamos'}
              </h1>

              {/* Switch de vista */}
              <div className="ml-6 flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => cambiarVista('asignaciones')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    vistaActual === 'asignaciones'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Asignaciones
                </button>
                <button
                  onClick={() => cambiarVista('prestamos')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    vistaActual === 'prestamos'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Préstamos
                </button>
              </div>
              
              <input 
                type="search"
                className="ml-6 px-3 py-1 border border-gray-300 rounded-md flex-1 min-w-0"
                placeholder="Nombre de empleado, equipo o N/S"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ maxWidth: '500px' }}
              />
            </div>
            <div className="text-sm text-gray-500 whitespace-nowrap ml-4">
              {datosFiltrados.length} {vistaActual} encontradas
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal con layout 2/3 - 1/3 */}
      <div className="h-min mx-auto px-4 sm:px-6 lg:px-8 py-8 h-min">
        {datosActuales.length === 0 ? (
          <div className="text-center py-12">
            <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay {vistaActual} disponibles
            </h3>
            <p className="text-gray-600">
              No se encontraron {vistaActual} en la base de datos.
            </p>
          </div>
        ) : (
          <div className="flex gap-6 h-[calc(100vh-200px)]">
            {/* Columna izquierda - Lista de tarjetas (2/3) */}
            <div className="w-2/3">
              <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Lista de {vistaActual === 'asignaciones' ? 'Responsivas' : 'Préstamos'}
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {datosFiltrados.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No se encontraron resultados para tu búsqueda.</p>
                    </div>
                  ) : (
                    datosFiltrados.map((item) => {
                      const empleado = findEmpleado(item.fk_empleado_id);
                      const equipo = findEquipo(item.fk_equipo_id);
                      const estado = getEstadoAsignacion(item.fecha_devolucion);
                      
                      return (
                        <TarjetaCompacta
                          key={item.id}
                          asignacion={item}
                          empleado={empleado}
                          equipo={equipo}
                          estado={estado}
                          isSelected={asignacionSeleccionada?.id === item.id}
                          onClick={() => setAsignacionSeleccionada(item)}
                          tipo={vistaActual}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha - Detalle completo (1/3) */}
            <div className="w-1/3 h-min">
              <div className="bg-white rounded-lg shadow-sm border h-full">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    {asignacionSeleccionada 
                      ? `Detalle - ${vistaActual === 'asignaciones' ? 'Responsiva' : 'Préstamo'} #${asignacionSeleccionada.id}` 
                      : `Selecciona un${vistaActual === 'asignaciones' ? 'a responsiva' : ' préstamo'}`
                    }
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
                      tipo={vistaActual}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <Monitor className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>
                          Selecciona un{vistaActual === 'asignaciones' ? 'a responsiva' : ' préstamo'} de la lista para ver sus detalles completos
                        </p>
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