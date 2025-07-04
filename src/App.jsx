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
  const SUPABASE_URL = 'https://djrnoydmbljnuqtfmgdw.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqcm5veWRtYmxqbnVxdGZtZ2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyOTM0NzYsImV4cCI6MjA2Njg2OTQ3Nn0.6lX1oUPmIJYTdGVovuVILW07MD3qayRrpjsPP5k6who';

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
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Responsiva #${asignacion.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              line-height: 1.6;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .document-title {
              font-size: 18px;
              font-weight: bold;
              color: #333;
            }
            .responsiva-number {
              font-size: 16px;
              color: #666;
              margin-top: 10px;
            }
            .section {
              margin-bottom: 25px;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 8px;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 1px solid #eee;
            }
            .field-row {
              display: flex;
              margin-bottom: 10px;
              align-items: center;
            }
            .field-label {
              font-weight: bold;
              min-width: 140px;
              color: #555;
            }
            .field-value {
              flex: 1;
              padding-left: 10px;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-active {
              background-color: #d1fae5;
              color: #065f46;
            }
            .status-returned {
              background-color: #f3f4f6;
              color: #374151;
            }
            .specs-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-top: 10px;
            }
            .signature-section {
              margin-top: 50px;
              display: flex;
              justify-content: space-between;
            }
            .signature-box {
              width: 200px;
              text-align: center;
            }
            .signature-line {
              border-bottom: 1px solid #333;
              margin-bottom: 10px;
              height: 50px;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
          <img src="https://boticacentral.com/wp-content/uploads/2020/10/Imagen1-300x117-1.png" alt="Logo de la empresa" style="height: 60px; margin-bottom: 10px;" />
            <div class="company-name">Sistema de Responsivas</div>
            <div class="document-title">CARTA RESPONSIVA DE EQUIPO DE CÓMPUTO</div>
            <div class="responsiva-number">Responsiva #${asignacion.id}</div>
          </div>

          <div class="section">
            <div class="section-title">👤 INFORMACIÓN DEL EMPLEADO</div>
            <div class="field-row">
              <div class="field-label">Nombre:</div>
              <div class="field-value">${empleado ? empleado.nombre_empleado : 'No especificado'}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Correo electrónico:</div>
              <div class="field-value">${empleado ? empleado.correo : 'No especificado'}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Puesto:</div>
              <div class="field-value">${empleado && empleado.puesto ? empleado.puesto : 'No especificado'}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">💻 INFORMACIÓN DEL EQUIPO</div>
            <div class="field-row">
              <div class="field-label">Nombre del equipo:</div>
              <div class="field-value">${equipo ? equipo.nombre : 'No especificado'}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Marca:</div>
              <div class="field-value">${equipo ? equipo.marca : 'No especificado'}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Modelo:</div>
              <div class="field-value">${equipo ? equipo.modelo : 'No especificado'}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Número de serie:</div>
              <div class="field-value">${equipo ? equipo.numero_serie : 'No especificado'}</div>
            </div>
            
            ${equipo && (equipo.ram || equipo.procesador || equipo.capacidad_almacenamiento) ? `
              <div style="margin-top: 20px;">
                <div class="field-label" style="margin-bottom: 10px;">Especificaciones técnicas:</div>
                <div class="specs-grid">
                  ${equipo.ram ? `<div><strong>RAM:</strong> ${equipo.ram}GB</div>` : ''}
                  ${equipo.capacidad_almacenamiento ? `<div><strong>Almacenamiento:</strong> ${equipo.capacidad_almacenamiento}GB</div>` : ''}
                  ${equipo.procesador ? `<div style="grid-column: 1 / -1;"><strong>Procesador:</strong> ${equipo.procesador}</div>` : ''}
                </div>
              </div>
            ` : ''}
          </div>

          <div class="section">
            <div class="section-title">📅 INFORMACIÓN DE LA ASIGNACIÓN</div>
            <div class="field-row">
              <div class="field-label">Estado:</div>
              <div class="field-value">
                <span class="status-badge ${estado.texto === 'Activa' ? 'status-active' : 'status-returned'}">
                  ${estado.texto}
                </span>
              </div>
            </div>
            <div class="field-row">
              <div class="field-label">Fecha de asignación:</div>
              <div class="field-value">${formatDate(asignacion.fecha_asignacion)}</div>
            </div>
            ${asignacion.fecha_devolucion ? `
              <div class="field-row">
                <div class="field-label">Fecha de devolución:</div>
                <div class="field-value">${formatDate(asignacion.fecha_devolucion)}</div>
              </div>
            ` : ''}
            ${asignacion.observaciones ? `
              <div class="field-row">
                <div class="field-label">Observaciones:</div>
                <div class="field-value">${asignacion.observaciones}</div>
              </div>
            ` : ''}
          </div>

          <div class="section">
            <div class="section-title">📋 TÉRMINOS Y CONDICIONES</div>
            <p>Por medio de la presente, acepto la responsabilidad del equipo de cómputo descrito anteriormente y me comprometo a:</p>
            <ul>
              <li>Mantener el equipo en buen estado y utilizarlo únicamente para fines laborales</li>
              <li>Reportar inmediatamente cualquier daño, pérdida o mal funcionamiento</li>
              <li>No realizar modificaciones al hardware o software sin autorización previa</li>
              <li>Devolver el equipo en las mismas condiciones en que fue recibido</li>
              <li>Asumir la responsabilidad por daños causados por mal uso o negligencia</li>
            </ul>
          </div>

          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line"></div>
              <div><strong>Firma del Empleado</strong></div>
              <div>${empleado ? empleado.nombre_empleado : 'No especificado'}</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div><strong>Firma del Responsable</strong></div>
              <div>Departamento de Sistemas</div>
            </div>
          </div>

          <div class="footer">
            <p>Documento generado el ${new Date().toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Esperar a que se cargue el contenido y luego imprimir
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
                      className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        generatingPDF
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