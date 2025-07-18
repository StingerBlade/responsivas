import { Calendar, User, Monitor, HardDrive, Cpu, Settings, Building, Mail, MapPin, ArrowLeft, ArrowRight, Download, FileText } from 'lucide-react';
import { formatDate } from '../utils/chalanes';
import { generatePDF } from '../utils/generatePDF';
import { getEstadoAsignacion } from '../utils/chalanes';

const Tarjeta = (
    {   asignacion,
        empleado,
        equipo,
        estado,
        formatDate,
        setGeneratingPDF,
        generatingPDF,
        generatePDF
    }) =>(
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
                          empleado: empleado,
                          equipo: equipo,
                          estado: getEstadoAsignacion(asignacion.fecha_devolucion),
                          formatDate,
                          setGeneratingPDF,
                        }, console.log('se esta clickeando')
                    )
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

  export default Tarjeta;