import { User, Monitor } from 'lucide-react';

const TarjetaCompacta = ({ asignacion, empleado, equipo, estado, isSelected, onClick }) => {
  return (
    <div 
      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      {/* Header con número de responsiva y estado */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Responsiva #{asignacion.id}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${estado.color}`}>
          {estado.texto}
        </span>
      </div>

      {/* Información del empleado */}
      <div className="mb-3">
        <div className="flex items-center mb-1">
          <User className="h-4 w-4 text-blue-600 mr-1" />
          <span className="text-xs font-medium text-gray-700">Empleado</span>
        </div>
        <p className="text-sm text-gray-900 font-medium">
          {empleado?.nombre_empleado || 'Empleado no encontrado'}
        </p>
        {empleado?.puesto && (
          <p className="text-xs text-gray-600">{empleado.puesto}</p>
        )}
      </div>

      {/* Información básica del equipo */}
      <div>
        <div className="flex items-center mb-1">
          <Monitor className="h-4 w-4 text-green-600 mr-1" />
          <span className="text-xs font-medium text-gray-700">Equipo</span>
        </div>
        <p className="text-sm text-gray-900 font-medium">
          {equipo?.nombre || 'Equipo no encontrado'}
        </p>
        <p className="text-xs text-gray-600 font-mono">
          S/N: {equipo?.numero_serie || 'No especificado'}
        </p>
        {equipo?.marca && equipo?.modelo && (
          <p className="text-xs text-gray-600">
            {equipo.marca} {equipo.modelo}
          </p>
        )}
      </div>
    </div>
  );
};

export default TarjetaCompacta;