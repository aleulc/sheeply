import React from "react";
import { useNavigate } from 'react-router-dom';

const Terminos = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-4xl border border-gray-100 overflow-y-auto max-h-screen">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Términos y Condiciones.
                </h1>
                <p className="text-gray-500 mb-6">
                    <strong>Fecha de última actualización:</strong> Agosto 2025.
                </p>

                <section className="space-y-6 text-gray-700 leading-relaxed">
                    <div>
                        <h2 className="text-xl font-semibold text-indigo-600">1. Aceptación de los Términos</h2>
                        <p>
                            Al acceder y utilizar el Sistema de Gestión de Préstamos Personales ("el Sistema"), propiedad de [Nombre de la Empresa], con domicilio en [Dirección Completa], usted ("el Usuario") acepta estar legalmente obligado por estos Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, no podrá acceder ni utilizar el Sistema.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-indigo-600">2. Definiciones</h2>
                        <ul className="list-disc ml-6">
                            <li>Sistema: Software de gestión de préstamos personales, incluyendo todos sus módulos y funcionalidades.</li>
                            <li>Usuario: Persona autorizada para acceder al Sistema.</li>
                            <li>Cliente: Persona natural o jurídica que solicita o ha obtenido un préstamo.</li>
                            <li>Datos Personales: Información relacionada con una persona física identificada o identificable.</li>
                            <li>Contenido: Toda información, texto, datos y materiales disponibles en el Sistema.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-indigo-600">3. Licencia de Usos</h2>
                        <p>3.1. Se otorga al Usuario una licencia limitada, no exclusiva, no transferible y revocable para utilizar el Sistema conforme a estos Términos.
                            3.2. Esta licencia no incluye:</p>
                        <ul className="list-disc ml-6">
                            <li>Derecho de sublicencia, venta o comercialización del Sistema</li>
                            <li>Modificación, ingeniería inversa o descompilación del código fuente</li>
                            <li>Uso para fines ilegales o no autorizados</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-indigo-600">4. Registro y Cuentas</h2>
                        <p>
                            4.1. Para acceder al Sistema, el Usuario debe registrarse proporcionando información veraz y completa.
                            4.2. Cada Usuario es responsable de:
                        </p>
                        <ul className="list-disc ml-6 mt-2">
                            <li>Mantener la confidencialidad de sus credenciales</li>
                            <li>Todas las actividades realizadas bajo su cuenta</li>
                            <li>Notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-indigo-600">5. Uso Aceptable</h2>
                        <p>5.1. El Usuario se compromete a:</p>
                        <ul className="list-disc ml-6 mt-2">
                            <li>Utilizar el Sistema únicamente para fines legítimos de gestión de préstamos</li>
                            <li>Respetar todas las leyes y regulaciones aplicables</li>
                            <li>No interferir con la seguridad o funcionamiento del Sistema</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-indigo-600">6. Gestión de Préstamos</h2>
                        <p>6.1. El Sistema facilita la gestión de préstamos pero no constituye asesoría financiera.
                            6.2. T.T.O.B no es responsable por:</p>
                        <ul className="list-disc ml-6 mt-2">
                            <li>Decisiones crediticias tomadas por los Usuarios</li>
                            <li>Exactitud de la información proporcionada por los Clientes</li>
                            <li>Cumplimiento de pagos por parte de los Clientes</li>

                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-indigo-600">7. Propiedad Intelectual</h2>
                        <p>7.1. Todos los derechos de propiedad intelectual sobre el Sistema son propiedad exclusiva de T.T.O.B.
                            7.2. Se prohíbe:</p>
                        <ul className="list-disc ml-6 mt-2">
                            <li>Copiar, modificar o distribuir el Sistema sin autorización</li>
                            <li>Utilizar marcas, logos o contenido del Sistema sin permiso</li>
                            <li>Eliminar avisos de propiedad intelectual</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-indigo-600">8. Datos Personales</h2>
                        <p>8.1. El tratamiento de datos personales se rige por nuestro Aviso de Privacidad.
                            8.2. El Usuario se compromete a:</p>
                        <ul className="list-disc ml-6 mt-2">
                            <li>Tratar datos personales conforme a la normativa aplicable</li>
                            <li>Implementar medidas de seguridad adecuadas</li>
                              <li>Obtener consentimientos necesarios de los Clientes</li> 
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-indigo-600">9. Responsabilidades</h2>
                        <p>9.1. Del Usuario:</p>
                    <ul className="list-disc ml-6">
                            <li>Verificar la exactitud de la información ingresada</li>
                            <li>Mantener copias de seguridad de su información crítica</li>
                    </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-indigo-600">10. Limitación de Responsabilidad</h2>
                        <p>10.1. El Sistema se proporciona "TAL CUAL" y "SEGÚN DISPONIBILIDAD" sin garantías de ningún tipo.
10.2. T.T.O.B no será responsable por:</p>
                        <ul className="list-disc ml-6">
                            <li>Daños indirectos, incidentales o consecuentes </li>
                            <li>Pérdida de datos o beneficios</li>
                            <li>Interrupciones del servicio no causadas intencionalmente</li>
                            <li>Errores en cálculos derivados de información incorrecta ingresada por el Usuario</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-indigo-600">11. Modificaciones al Sistema y Términos</h2>
                        <p>11.1. T.T.O.B se reserva el derecho de:</p>
                        <ul className="list-disc ml-6">
                            <li>Modificar el Sistema y sus funcionalidades </li>
                            <li>Actualizar estos Términos periódicamente</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-indigo-600">12. Confidencialidad</h2>
                        <p>12.1. El Usuario se compromete a mantener la confidencialidad de:</p>
                        <ul className="list-disc ml-6">
                            <li>Información técnica del Sistema</li>
                            <li>Procesos comerciales propietarios</li>
                            <li>Datos sensibles de Clientes</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-indigo-600">13. Terminación</h2>
                        <p>13.1. Cualquiera de las partes puede terminar este acuerdo con 30 días de notificación por escrito.
13.2. T.T.O.B podrá terminar el acceso inmediatamente si:</p>
                        <ul className="list-disc ml-6">
                            <li>El Usuario incumple estos Términos</li>
                            <li>Se detecta actividad fraudulenta</li>
                             <li>Hay requerimiento legal o judicial</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-indigo-600">14. Disposiciones Generaless</h2>
                        <p>14.1. Ley aplicable: Estos Términos se regirán por las leyes de Mexico.
14.2. Jurisdicción: Cualquier disputa se someterá a los tribunales competentes de Puebla.
14.3. Cesión: El Usuario no podrá ceder sus derechos u obligaciones sin consentimiento por escrito.
14.4. Integridad: Estos Términos constituyen el acuerdo completo entre las partes.
14.5. Divisibilidad: Si alguna disposición es inválida, las demás permanecen vigentes.</p>

                    </div>
                </section>
            </div>
        </div>
    );
};

export default Terminos;
