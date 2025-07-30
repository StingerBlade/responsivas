export const generatePDF = ({
    asignacion,
    empleado,
    equipo,
    estado,
    formatDate,
    setGeneratingPDF,
    tipo = 'asignaciones'
}) => {
    setGeneratingPDF(true);
    
    // Determinar textos según el tipo
    const esAsignacion = tipo === 'asignaciones';
    const tipoTexto = esAsignacion ? 'RESPONSIVA' : 'PRÉSTAMO';
    const codigoFormato = esAsignacion ? 'BC-SST-F-' : 'BC-PREST-F-';
    const tituloDocumento = esAsignacion ? 'CARTA RESPONSIVA DE EQUIPOS' : 'CARTA DE PRÉSTAMO DE EQUIPOS';
    
    try {
        const printWindow = window.open('', '_blank');
        const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${tipoTexto} de Equipos #${asignacion.id}</title>
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
      <div>${codigoFormato}${asignacion.id}</div>
      <div>REV.10</div>
    </div>
  </div>

  <div class="title">${tituloDocumento}</div>
  <div class="sub-title">Fecha: ${new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>

  <div class="section">
    <div class="bold">Datos del Empleado</div>
    <p><strong>Nombre:</strong> ${empleado?.nombre_empleado || 'No especificado'}</p>
    <p><strong>Correo electrónico:</strong> ${empleado?.correo || 'No especificado'}</p>
    <p><strong>Puesto:</strong> ${empleado?.puesto || 'No especificado'}</p>
  </div>

  <div class="section">
    <div class="bold">Datos del Equipo</div>
    <p><strong>Equipo:</strong> ${equipo?.nombre || 'No especificado'}</p>
    <p><strong>Marca:</strong> ${equipo?.marca || 'No especificado'}</p>
    <p><strong>Modelo:</strong> ${equipo?.modelo || 'No especificado'}</p>
    <p><strong>Número de serie:</strong> ${equipo?.numero_serie || 'No especificado'}</p>
  </div>

  <div class="section">
    <p><strong>Fecha de ${esAsignacion ? 'asignación' : 'préstamo'}:</strong> ${formatDate(esAsignacion ? asignacion.fecha_asignacion : asignacion.fecha_prestamo)}</p>
    ${asignacion.fecha_devolucion ? `<p><strong>Fecha de devolución:</strong> ${formatDate(asignacion.fecha_devolucion)}</p>` : ''}
    ${asignacion.observaciones ? `<p><strong>Observaciones:</strong> ${asignacion.observaciones}</p>` : ''}
  </div>

  <div class="section box justified">
    Por la presente, YO <span class="bold">${empleado?.nombre_empleado || 'NOMBRE DEL COLABORADOR'}</span>, 
    ${esAsignacion 
      ? 'me comprometo a usar correctamente y devolver cuando lo sea requerido en buen estado el equipo que me ha sido otorgado por el departamento de Sistemas.' 
      : 'reconozco haber recibido en préstamo temporal el equipo descrito, comprometiéndome a devolverlo en las mismas condiciones en que lo recibí al término del período acordado o cuando me sea requerido.'
    }
  </div>

  ${esAsignacion ? `
  <div class="section box justified">
    <div class="italic bold">SOBRE EL USO DEL CONTENIDO DEL EQUIPO ASIGNADO:</div>
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
  ` : `
  <div class="section box justified">
    <div class="italic bold">CONDICIONES DEL PRÉSTAMO:</div>
    <ul>
      <li>El equipo se encuentra en buen estado de funcionamiento al momento de la entrega.</li>
      <li>El usuario se compromete a usar el equipo únicamente para los fines acordados.</li>
      <li>Cualquier daño, pérdida o mal funcionamiento deberá ser reportado inmediatamente al departamento de Sistemas.</li>
      <li>El usuario será responsable de los daños causados por negligencia o mal uso.</li>
      <li>El equipo deberá ser devuelto en las mismas condiciones en que fue entregado.</li>
      <li>Está prohibido modificar configuraciones o instalar software sin autorización.</li>
    </ul>
  </div>

  <div class="section box justified">
    Acepto que en caso de daño, pérdida o no devolución del equipo en el tiempo establecido, seré responsable de cubrir el costo de reparación o reposición según corresponda. El valor será determinado por el departamento de Sistemas basado en el precio de mercado actual del equipo y sus componentes.
  </div>
  `}

  <div class="section bold">En señal de conformidad y aceptación de lo declarado, firmo este documento.</div>

  <div class="signatures">
    <div class="signature">
      <div class="signature-line"></div>
      <div><strong>Colaborador:</strong><br>${empleado?.nombre_empleado || ''}<br>${empleado?.puesto || ''}</div>
    </div>
    <div class="signature">
      <div class="signature-line"></div>
      <div><strong>Firma de ${esAsignacion ? 'recepción, verificación y conformidad' : 'entrega y conformidad'}</strong><br>Departamento de Sistemas</div>
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
}