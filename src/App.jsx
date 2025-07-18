import React, { useState, useEffect } from 'react';
import { Calendar, User, Monitor, HardDrive, Cpu, Settings, Building, Mail, MapPin, ArrowLeft, ArrowRight, Download, FileText } from 'lucide-react';
import { fetchSupabaseData } from './utils/supaBaseData';
import Tarjeta from './components/tarjetas';
import { generatePDF } from './utils/generatePDF';
import { formatDate, getEstadoAsignacion } from './utils/chalanes';
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
              <input type="search" name="" id="" />
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
                <Tarjeta
                key={asignacion.id}
                asignacion={asignacion}
                empleado={empleado}
                equipo={equipo}
                estado={estado}
                formatDate={formatDate}
                setGeneratingPDF={setGeneratingPDF}
                generatePDF={generatePDF}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsivasApp;