import React, { useState, useEffect } from 'react';
import { Calendar, User, Monitor, HardDrive, Cpu, Settings, Building, Mail, MapPin, ArrowLeft, ArrowRight, Download, FileText } from 'lucide-react';

const ResponsivasApp = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Configuración de la API de Supabase
  const SUPABASE_URL = 'https://fskwiexuvaujtntpjcmd.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZza3dpZXh1dmF1anRudHBqY21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDI3MDQsImV4cCI6MjA2NzQ3ODcwNH0.iEFYCesWPR9Jd-GjAFwfLNDEJqq0JCCkEvQRYBHfQks';

  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  };

  // Función para hacer peticiones a Supabase
  const fetchSupabaseData = async (table) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
        headers
      });

      if (!response.ok) {
        throw new Error(`Error fetching ${table}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
      throw err;
    }
  };

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

  // Función para generar PDF usando HTML Canvas
  const generatePDF = async (asignacion) => {
    setGeneratingPDF(true);

    try {
      const empleado = findEmpleado(asignacion.fk_empleado_id);
      const equipo = findEquipo(asignacion.fk_equipo_id);
      const estado = getEstadoAsignacion(asignacion.fecha_devolucion);

      // Crear una nueva ventana para el PDF
      const printWindow = window.open('', '_blank');
      const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Responsiva de Equipos #${asignacion.id}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      color: #000;
    }
    .logo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .logo img {
      height: 60px;
    }
    .title {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .sub-title {
      text-align: right;
      font-size: 12px;
      margin-top: -10px;
      margin-bottom: 30px;
    }
    .section {
      margin-bottom: 20px;
    }
    .box {
      border: 1px solid #000;
      padding: 10px;
      margin-bottom: 20px;
    }
    .bold {
      font-weight: bold;
    }
    .italic {
      font-style: italic;
    }
    .justified {
      text-align: justify;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 60px;
    }
    .signature {
      width: 45%;
      text-align: center;
    }
    .signature-line {
      border-bottom: 1px solid #000;
      height: 50px;
      margin-bottom: 5px;
    }
    ul {
      padding-left: 20px;
    }
  </style>
</head>
<body>
  <div class="logo">
    <img src="https://boticacentral.com/wp-content/uploads/2020/10/Imagen1-300x117-1.png" alt="Botica Central">
    <div>
      <div>BC-SST-F- ${asignacion.id}</div>
      <div>REV.10</div>
    </div>
  </div>

  <div class="title">CARTA RESPONSIVA DE EQUIPOS</div>
  <div class="sub-title">Fecha: ${new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>

  <div class="section">
    <div class="bold">Datos del Empleado:</div>
    <p><strong>Nombre:</strong> ${empleado?.nombre_empleado || 'No especificado'}</p>
    <p><strong>Correo electrónico:</strong> ${empleado?.correo || 'No especificado'}</p>
    <p><strong>Puesto:</strong> ${empleado?.puesto || 'No especificado'}</p>
  </div>

  <div class="section">
    <div class="bold">Datos del Equipo:</div>
    <p><strong>Equipo:</strong> ${equipo?.nombre || 'No especificado'}</p>
    <p><strong>Marca:</strong> ${equipo?.marca || 'No especificado'}</p>
    <p><strong>Modelo:</strong> ${equipo?.modelo || 'No especificado'}</p>
    <p><strong>Número de serie:</strong> ${equipo?.numero_serie || 'No especificado'}</p>
  </div>

  <div class="section">
    <div class="bold">Información de la Asignación:</div>
    <p><strong>Fecha de asignación:</strong> ${formatDate(asignacion.fecha_asignacion)}</p>
    ${asignacion.fecha_devolucion ? `<p><strong>Fecha de devolución:</strong> ${formatDate(asignacion.fecha_devolucion)}</p>` : ''}
    ${asignacion.observaciones ? `<p><strong>Observaciones:</strong> ${asignacion.observaciones}</p>` : ''}
  </div>

  <div class="section box justified">
    Por la presente, YO <span class="bold">${empleado?.nombre_empleado || 'NOMBRE DEL COLABORADOR'}</span>, me comprometo a usar correctamente y devolver cuando lo sea requerido en buen estado el equipo que me ha sido otorgado por el departamento de Sistemas.
  </div>

  <div class="section box justified">
    <div class="italic bold">SOBRE EL USO DEL CONTENIDO DEL EQUIPO PRESTADO:</div>
    <ul>
      <li>El usuario empleará el equipo asignado para uso laboral exclusivamente.</li>
      <li>Será responsabilidad total del usuario cualquier mal uso del equipo a su cargo (tanto daño físico como pérdida de este o alguna de sus componentes).</li>
      <li>Está prohibido modificar o tratar de alterar cualquier configuración, elemento de seguridad o software.</li>
      <li>No deberá incrementar o sustituir funcionalidades del software o hardware sin autorización.</li>
      <li>No deberá desarmar el equipo, ya sea en parte o su totalidad.</li>
      <li>El usuario que haga uso indebido del equipo será sancionado según las políticas de Botica Central.</li>
    </ul>
  </div>

  <div class="section box justified">
    Reconozco y acepto expresamente que asumo, exclusivamente por mi cuenta y riesgo, el uso del dispositivo, accesorios, etc. Asimismo, si lo entregara deteriorado (mientras no sea el deterioro normal conforme al tiempo de vida del equipo), se me extraviara o sufriera el robo del equipo, soy consciente de que debo asumir el costo de reposición de este (con sus respectivos accesorios, aplicaciones y componentes) que represente el precio vigente.<br><br>
    En caso de cortar, eliminar o dañar el contenido digital y/o aplicaciones, asumo la penalidad o cargo correspondiente por este establecido en esta política.
  </div>

  <div class="section bold">En señal de conformidad y aceptación de lo declarado, firmo este documento.</div>

  <div class="signatures">
    <div class="signature">
      <div class="signature-line"></div>
      <div><strong>Colaborador:</strong><br>${empleado?.nombre_empleado || ''}<br>${empleado?.puesto || ''}</div>
    </div>
    <div class="signature">
      <div class="signature-line"></div>
      <div><strong>Firma de recepción, verificación y conformidad</strong><br>Departamento de Sistemas</div>
    </div>
  </div>
</body>
</html>
`;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };


    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor, intente nuevamente.');
    } finally {
      setGeneratingPDF(false);
    }
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
                      onClick={() => generatePDF(asignacion)}
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