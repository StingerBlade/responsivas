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
    @media print {
      @page {
        margin: 15mm;
        size: A4;
      }
      body { margin: 0; }
    }
    
    body {
      font-family: Arial, sans-serif;
      padding: 25px;
      color: #000;
      font-size: 13px;
      line-height: 1.4;
    }
    
    .logo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .logo img {
      height: 55px;
    }
    
    .code-info {
      text-align: right;
      font-size: 12px;
    }
    
    .title {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin: 12px 0 6px 0;
    }
    
    .sub-title {
      text-align: right;
      font-size: 12px;
      margin-bottom: 20px;
    }
    
    .section {
      margin-bottom: 12px;
    }
    
    .section p {
      margin: 5px 0;
    }
    
    .section-title {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 7px;
    }
    
    .box {
      border: 1px solid #000;
      padding: 12px;
      margin: 12px 0;
      font-size: 12px;
      line-height: 1.5;
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
      margin-top: 35px;
    }
    
    .signature {
      width: 45%;
      text-align: center;
      font-size: 12px;
    }
    
    .signature-line {
      border-bottom: 1px solid #000;
      height: 45px;
      margin-bottom: 5px;
    }
    
    ul {
      padding-left: 20px;
      margin: 8px 0;
    }
    
    ul li {
      margin: 4px 0;
      font-size: 11px;
      line-height: 1.4;
    }
    
    .data-row {
      display: flex;
      justify-content: space-between;
      margin: 2px 0;
    }
    
    .data-item {
      flex: 1;
      margin-right: 10px;
    }
    
    .final-text {
      font-size: 12px;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="logo">
    <img src="https://boticacentral.com/wp-content/uploads/2020/10/Imagen1-300x117-1.png" alt="Botica Central">
    <div class="code-info">
      <div>${codigoFormato}${asignacion.id}</div>
      <div>REV.10</div>
    </div>
  </div>

  <div class="title">${tituloDocumento}</div>
  <div class="sub-title">Fecha: ${new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</div>

  <div class="section">
    <div class="section-title">Datos del Empleado</div>
    <div class="data-row">
      <div class="data-item"><strong>Nombre:</strong> ${empleado?.nombre_empleado || 'No especificado'}</div>
      <div class="data-item"><strong>Puesto:</strong> ${empleado?.puesto || 'No especificado'}</div>
    </div>
    <p><strong>Correo:</strong> ${empleado?.correo || 'No especificado'}</p>
  </div>

  <div class="section">
    <div class="section-title">Datos del Equipo</div>
    <div class="data-row">
      <div class="data-item"><strong>Equipo:</strong> ${equipo?.nombre || 'No especificado'}</div>
      <div class="data-item"><strong>Marca:</strong> ${equipo?.marca || 'No especificado'}</div>
    </div>
    <div class="data-row">
      <div class="data-item"><strong>Modelo:</strong> ${equipo?.modelo || 'No especificado'}</div>
      <div class="data-item"><strong>Serie:</strong> ${equipo?.numero_serie || 'No especificado'}</div>
    </div>
  </div>

  <div class="section">
    <div class="data-row">
      <div class="data-item"><strong>Fecha de ${esAsignacion ? 'asignación' : 'préstamo'}:</strong> ${formatDate(esAsignacion ? asignacion.fecha_asignacion : asignacion.fecha_prestamo)}</div>
      ${asignacion.fecha_devolucion ? `<div class="data-item"><strong>Devolución:</strong> ${formatDate(asignacion.fecha_devolucion)}</div>` : '<div class="data-item"></div>'}
    </div>
    ${asignacion.observaciones ? `<p><strong>Observaciones:</strong> ${asignacion.observaciones}</p>` : ''}
  </div>

  <div class="box justified">
    Por la presente, YO <span class="bold">${empleado?.nombre_empleado || 'NOMBRE DEL COLABORADOR'}</span>, 
    ${esAsignacion 
      ? 'me comprometo a usar correctamente y devolver cuando sea requerido en buen estado el equipo otorgado por Sistemas.' 
      : 'reconozco haber recibido en préstamo el equipo descrito, comprometiéndome a devolverlo en las mismas condiciones.'
    }
  </div>

  ${esAsignacion ? `
  <div class="box justified">
    <div class="italic bold">CONDICIONES DE USO:</div>
    <ul>
      <li>Uso laboral exclusivo del equipo asignado.</li>
      <li>Responsabilidad total por mal uso, daños físicos o pérdida.</li>
      <li>Prohibido modificar configuraciones o software sin autorización.</li>
      <li>No desarmar el equipo total o parcialmente.</li>
      <li>Sanciones según políticas de Botica Central por uso indebido.</li>
    </ul>
  </div>

  <div class="box justified">
    Reconozco y acepto expresamente que asumo, exclusivamente por mi cuenta y riesgo, el uso del dispositivo, accesorios, etc. Asimismo, si lo entregara deteriorado (mientras no sea el deterioro normal conforme al tiempo de vida del equipo), se me extraviara o sufriera el robo del equipo, soy consciente de que debo asumir el costo de reposición de este (con sus respectivos accesorios, aplicaciones y componentes) que represente el precio vigente.<br><br>
    En caso de cortar, eliminar o dañar el contenido digital y/o aplicaciones, asumo la penalidad o cargo correspondiente por este establecido en esta política.
  </div>
  ` : `
  <div class="box">
    <div class="italic bold">CONDICIONES DEL PRÉSTAMO:</div>
    <ul>
      <li>Equipo en buen estado al momento de entrega.</li>
      <li>Uso únicamente para fines acordados.</li>
      <li>Reportar inmediatamente daños o mal funcionamiento.</li>
      <li>Responsabilidad por daños por negligencia.</li>
      <li>Prohibido modificar configuraciones sin autorización.</li>
    </ul>
    <div style="margin-top: 8px;">
      Acepto responsabilidad por costo de reparación o reposición en caso de daño, pérdida o no devolución oportuna.
    </div>
  </div>
  `}

  <div class="final-text bold">En señal de conformidad, firmo este documento.</div>

  <div class="signatures">
    <div class="signature">
      <div class="signature-line"></div>
      <div><strong>Colaborador</strong><br>${empleado?.nombre_empleado || ''}<br>${empleado?.puesto || ''}</div>
    </div>
    <div class="signature">
      <div class="signature-line"></div>
      <div><strong>${esAsignacion ? 'Recepción y conformidad' : 'Entrega y conformidad'}</strong><br>Departamento de Sistemas</div>
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