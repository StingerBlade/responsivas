import {
  Calendar,
  User,
  Monitor,
  HardDrive,
  Cpu,
  Settings,
  Building,
  Mail,
  ArrowLeft,
  ArrowRight,
  FileText
} from 'lucide-react';
import { getEstadoAsignacion } from '../utils/chalanes';

const DetalleCompleto = ({
  asignacion,
  empleado,
  equipo,
  estado,
  formatDate,
  generatePDF,
  generatingPDF,
  setGeneratingPDF
}) => {
  return (
    <div className="p-3 space-y-6">
      {/* Estado */}

      {/* Información del empleado */}
      <div className="space-y-2">
        <div className="flex items-center">
          <User className="h-5 w-5 text-blue-600 mr-2" />
          <h4 className="font-semibold text-gray-900">Empleado</h4>
        </div>
        {empleado ? (
          <div className="bg-gray-50 p-2 rounded-lg space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-700">Nombre:</span>
              <p className="text-sm text-gray-900">{empleado.nombre_empleado}</p>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="break-all">{empleado.correo}</span>
            </div>
            {empleado.puesto && (
              <div className="flex items-center text-sm text-gray-600">
                <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>{empleado.puesto}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">Empleado no encontrado</p>
        )}
      </div>

      {/* Información del equipo */}
      <div className="space-y-3">
        <div className="flex items-center">
          <Monitor className="h-5 w-5 text-green-600 mr-2" />
          <h4 className="font-semibold text-gray-900">Equipo</h4>
        </div>
        {equipo ? (
          <div className="bg-gray-50 p-3 rounded-lg space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-700">Nombre:</span>
              <p className="text-sm text-gray-900">{equipo.nombre}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Marca:</span>
              <p className="text-sm text-gray-900">{equipo.marca}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Modelo:</span>
              <p className="text-sm text-gray-900">{equipo.modelo}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Serie:</span>
              <p className="text-sm text-gray-900 font-mono">{equipo.numero_serie}</p>
            </div>

            {/* Especificaciones técnicas */}
            {(equipo.ram || equipo.procesador || equipo.capacidad_almacenamiento) && (
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center mb-2">
                  <Settings className="h-4 w-4 text-gray-600 mr-1" />
                  <span className="text-sm font-medium text-gray-700">Especificaciones</span>
                </div>
                <div className="space-y-1">
                  {equipo.ram && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Cpu className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span>RAM: {equipo.ram}GB</span>
                    </div>
                  )}
                  {equipo.capacidad_almacenamiento && (
                    <div className="flex items-center text-sm text-gray-600">
                      <HardDrive className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span>Almacenamiento: {equipo.capacidad_almacenamiento}GB</span>
                    </div>
                  )}
                  {equipo.procesador && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">CPU:</span> {equipo.procesador}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">Equipo no encontrado</p>
        )}
      </div>

      {/* Información de la asignación */}
      <div className="space-y-1">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-purple-600 mr-2" />
          <h4 className="font-semibold text-gray-900">Asignación</h4>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <ArrowRight className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="font-medium min-w-[70px]">Asignado:</span>
            <span className="ml-2">{formatDate(asignacion.fecha_asignacion)}</span>
          </div>
          {asignacion.fecha_devolucion && (
            <div className="flex items-center text-sm text-gray-600">
              <ArrowLeft className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="font-medium min-w-[70px]">Devuelto:</span>
              <span className="ml-2">{formatDate(asignacion.fecha_devolucion)}</span>
            </div>
          )}
          {asignacion.observaciones && (
            <div className="text-sm text-gray-600 pt-2 border-t border-gray-200">
              <span className="font-medium">Observaciones:</span>
              <p className="mt-1">{asignacion.observaciones}</p>
            </div>
          )}
        </div>
        {/* Botón para generar PDF */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() =>
            generatePDF({
              asignacion,
              empleado: empleado,
              equipo: equipo,
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

      
    </div>
  );
};

export default DetalleCompleto;