'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('VulnConfigurations', [{
                name: 'Fuerza Bruta',
                description: 'Fuerza Bruta',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Errores en la lógica',
                description: 'Errores en la lógica',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Inyección de CRLF',
                description: 'Inyección de CRLF',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Almacenamiento de información sensible',
                description: 'Almacenamiento de información sensible',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Inyección de código',
                description: 'Inyección de código',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Inyección de Comandos – Genèico',
                description: 'Inyección de Comandos – Genèico',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Cross-Site Request Forgery (CSRF)',
                description: 'Cross-Site Request Forgery (CSRF)',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Cross-site Scripting (XSS) – DOM',
                description: 'Cross-site Scripting (XSS) – DOM',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Cross-site Scripting (XSS) – Reflejado',
                description: 'Cross-site Scripting (XSS) – Reflejado',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Cross-site Scripting (XSS) – Almacenado',
                description: 'Cross-site Scripting (XSS) – Almacenado',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Criptografia',
                description: 'Criptografia',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Denegación de servicio',
                description: 'Denegación de servicio',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'División de respuesta HTTP',
                description: 'División de respuesta HTTP',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Heap-based Buffer Overflow',
                description: 'Heap-based Buffer Overflow',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Control de acceso inadecuado',
                description: 'Control de acceso inadecuado',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Autenticación incorrecta',
                description: 'Autenticación incorrecta',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Validación incorrecta del certificado',
                description: 'Validación incorrecta del certificado',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Divulgación de información',
                description: 'Divulgación de información',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Exposición de información a traves de la lista de directorios',
                description: 'Exposición de información a traves de la lista de directorios',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Exposición de información a traves de un mensaje de error',
                description: 'Exposición de información a traves de un mensaje de error',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Referencia de Objeto Directo Inseguro (IDOR)',
                description: 'Referencia de Objeto Directo Inseguro (IDOR)',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Almacenamiento inseguro de información sensible',
                description: 'Almacenamiento inseguro de información sensible',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Expiración de sesión insuficiente',
                description: 'Expiración de sesión insuficiente',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Credenciales insuficientemente protegidas',
                description: 'Credenciales insuficientemente protegidas',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Código de depuración de sobra (Backdoor)',
                description: 'Código de depuración de sobra (Backdoor)',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Malware',
                description: 'Malware',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Hombre en el medio (MITM)',
                description: 'Hombre en el medio (MITM)',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Corrupción de la memoria',
                description: 'Corrupción de la memoria',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Inyección de comandos del sistema operativo',
                description: 'Inyección de comandos del sistema operativo',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Error deshabilitado',
                description: 'Error deshabilitado',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Redireccionamiento Inválido',
                description: 'Redireccionamiento Inválido',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Path Traversal',
                description: 'Path Traversal',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Phishing',
                description: 'Phishing',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Almacenamiento en texto plano de una contraseña',
                description: 'Almacenamiento en texto plano de una contraseña',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Violación de la privacidad',
                description: 'Violación de la privacidad',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Escalamiento de privilegios',
                description: 'Escalamiento de privilegios',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Inclusión Remota de Archivos (RFI)',
                description: 'Inclusión Remota de Archivos (RFI)',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Inyección de SQL',
                description: 'Inyección de SQL',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Falsificación de solicitud de servidor (SSRF)',
                description: 'Falsificación de solicitud de servidor (SSRF)',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Reajuste de la IU (Clickjacking)',
                description: 'Reajuste de la IU (Clickjacking)',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Transporte sin protección de credenciales',
                description: 'Transporte sin protección de credenciales',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Cambio de contraseña sin verificar',
                description: 'Cambio de contraseña sin verificar',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Uso de una clave despues de su fecha de vencimiento',
                description: 'Uso de una clave despues de su fecha de vencimiento',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('AssetTypes', null, {});
    }
};