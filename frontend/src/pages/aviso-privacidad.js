import React from "react";
import { useNavigate } from 'react-router-dom';

const AvisoPrivacidad = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-4xl border border-gray-100 overflow-y-auto max-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Aviso de Privacidad.
        </h1>
        <p className="text-gray-500 mb-6">
          <strong>Fecha de última actualización:</strong> Agosto 2025.
        </p>

        <section className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-indigo-600">1. Identidad y Domicilio del Responsable</h2>
            <p>
              T.T.O.B., con domicilio en Tehuacan, Puebla, es responsable del tratamiento de sus datos personales.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-600">2. Datos Personales Recabados</h2>
            <p>Para las finalidades señaladas en el presente aviso, recabamos los siguientes datos personales:</p>
            <h3 className="font-medium mt-3">a) Datos de identificación:</h3>
            <ul className="list-disc ml-6">
              <li>Nombre completo</li>
              <li>Fecha de nacimiento</li>
              <li>CURP</li>
              <li>RFC</li>
              <li>Identificación oficial vigente</li>
            </ul>

            <h3 className="font-medium mt-3">b) Datos de contacto:</h3>
            <ul className="list-disc ml-6">
              <li>Domicilio particular</li>
              <li>Teléfono fijo y/o móvil</li>
              <li>Correo electrónico</li>
            </ul>

            <h3 className="font-medium mt-3">c) Datos financieros:</h3>
            <ul className="list-disc ml-6">
              <li>Historial crediticio</li>
              <li>Ingresos y egresos mensuales</li>
              <li>Información bancaria</li>
              <li>Bienes inmuebles y muebles</li>
            </ul>

            <h3 className="font-medium mt-3">d) Datos laborales:</h3>
            <ul className="list-disc ml-6">
              <li>Lugar de trabajo</li>
              <li>Puesto</li>
              <li>Antigüedad laboral</li>
              <li>Ingresos comprobables</li>
            </ul>

            <h3 className="font-medium mt-3">e) Datos patrimoniales:</h3>
            <ul className="list-disc ml-6">
              <li>Propiedades</li>
              <li>Vehículos</li>
              <li>Inversiones</li>
            </ul>

            <h3 className="font-medium mt-3">f) Datos de referencias personales:</h3>
            <ul className="list-disc ml-6">
              <li>Nombres y datos de contacto de familiares directos</li>
              <li>Referencias personales no familiares</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mt-3">Finalidades:</h3>
            <ul className="list-disc ml-6">
              <li>Ofrecer nuevos productos y servicios</li>
              <li>Realizar evaluaciones de satisfacción</li>
              <li>Enviar promociones y ofertas</li>
              <li>Estudios internos sobre hábitos financieros</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-600">3. Transferencias</h2>
            <p>Sus datos personales podrán ser transferidos a las siguientes personas y entidades:</p>
            <ul className="list-disc ml-6">
              <li>Autoridades financieras, judiciales o administrativas</li>
              <li>Empresas de cobranza</li>
              <li>Proveedores de servicios bajo acuerdos de confidencialidad</li>
              <li>Instituciones de información crediticia</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-600">4. Medios para Ejercer los Derechos ARCO</h2>
            <p>
              Usted tiene derecho de acceder a sus datos personales que poseemos y a los detalles del tratamiento de los mismos, así como a rectificarlos en caso de ser inexactos o incompletos; cancelarlos cuando considere que no se requieren para alguna de las finalidades señaladas en el presente aviso, estén siendo utilizados para finalidades no consentidas o haya finalizado la relación contractual o de servicio, u oponerse al tratamiento de los mismos para fines específicos.

              Para ejercer cualquiera de los derechos ARCO, deberá presentar la solicitud respectiva a través del siguiente correo electrónico: [correo electrónico designado] o por escrito en nuestro domicilio.

              Su solicitud deberá contener:
            </p>
            <ul className="list-disc ml-6 mt-2">
              <li>Nombre completo</li>
              <li>Documento que acredite su identidad</li>
              <li>Descripción clara de los datos</li>
              <li>Cualquier documento que facilite la localización</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-600">5. Revocación del Consentimiento</h2>
            <p>Usted puede revocar el consentimiento que, en su caso, nos haya otorgado para el tratamiento de sus datos personales. Sin embargo, es importante que tenga en cuenta que no en todos los casos podremos atender su solicitud o concluir el tratamiento de forma inmediata, ya que es posible que por alguna obligación legal requiramos seguir tratando sus datos.

              Para revocar su consentimiento, deberá presentar su solicitud a través de los medios señalados en el apartado anterior.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-600">6. Limitación de Uso o Divulgación</h2>
            <p>Puede limitar el uso o divulgación de sus datos personales mediante su inscripción en el Registro Público para Evitar Publicidad, que está a cargo de la Procuraduría Federal del Consumidor. Para mayor información, visite: www.gob.mx/profeco</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-600">7. Uso de Tecnologías de Rastreo</h2>
            <p>Informamos que en nuestra página de internet utilizamos cookies, web beacons y otras tecnologías a través de las cuales es posible monitorear su comportamiento como usuario de internet, así como brindarle un mejor servicio y experiencia al navegar en nuestra página.

              Los datos personales que obtenemos de estas tecnologías de rastreo son los siguientes:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Identificadores de sesión</li>
              <li>Idioma preferido por el usuario</li>
              <li>Región en la que se encuentra el usuario</li>
              <li>Tipo de navegador del usuario</li>
              <li>Tipo de sistema operativo del usuario</li>
              <li>Fecha y hora del inicio y final de una sesión de usuario</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-600">8. Cambios al Aviso</h2>
            <p>Nos reservamos el derecho de efectuar en cualquier momento modificaciones o actualizaciones al presente aviso de privacidad, para la atención de novedades legislativas, políticas internas o nuevos requerimientos para la prestación u ofrecimiento de nuestros servicios o productos.

              Estas modificaciones estarán disponibles al público a través de los siguientes medios:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Comunicados enviados al correo electrónico que nos haya proporcionado</li>
              <li>Publicación en nuestra página de internet [URL]</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-600">9. Consentimiento</h2>
            <p>Al proporcionar sus datos personales, ya sea en formato físico o digital, usted acepta que sean tratados conforme a los términos y condiciones del presente aviso de privacidad.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-600">10. Contacto</h2>
            <p>Si tiene dudas sobre el presente aviso de privacidad, puede contactar a nuestro departamento de datos personales:</p>
            <ul className="list-disc ml-6">
              <li>Correo: </li>
              <li>Teléfono:</li>
              <li>Domicilio: </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-600">11. Autoridades</h2>
            <p>En caso de que considere que su derecho a la protección de datos personales ha sido vulnerado por alguna conducta de nuestros empleados o por nuestras actuaciones o respuestas, presume que en el tratamiento de sus datos personales existe alguna violación a las disposiciones previstas en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, podrá interponer la queja o denuncia correspondiente ante el Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI). Para más información, visite: www.inai.org.mx</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AvisoPrivacidad;
