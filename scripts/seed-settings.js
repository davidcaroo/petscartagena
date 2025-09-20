const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const initialSettings = [
    // 🏢 Información de la Empresa
    {
        key: "platform_name",
        value: "PetsCartagena",
        type: "TEXT",
        category: "company",
        label: "Nombre de la Plataforma",
        description: "Nombre que aparece en el header y emails",
        order: 1
    },
    {
        key: "company_email",
        value: "info@petscartagena.com",
        type: "EMAIL",
        category: "company",
        label: "Email de Contacto",
        description: "Email principal de contacto",
        order: 2
    },
    {
        key: "company_phone",
        value: "+57 300 123 4567",
        type: "TEXT",
        category: "company",
        label: "Teléfono de Contacto",
        description: "Número de teléfono principal",
        order: 3
    },
    {
        key: "company_address",
        value: "Cartagena, Colombia",
        type: "TEXT",
        category: "company",
        label: "Dirección",
        description: "Dirección física de la empresa",
        order: 4
    },
    {
        key: "company_description",
        value: "Plataforma líder en adopción responsable de mascotas en Cartagena",
        type: "TEXTAREA",
        category: "company",
        label: "Descripción de la Empresa",
        description: "Descripción que aparece en la página principal",
        order: 5
    },

    // 📧 Configuración de Emails
    {
        key: "email_from_name",
        value: "PetsCartagena",
        type: "TEXT",
        category: "email",
        label: "Nombre del Remitente",
        description: "Nombre que aparece en los emails enviados",
        order: 1
    },
    {
        key: "email_support",
        value: "soporte@petscartagena.com",
        type: "EMAIL",
        category: "email",
        label: "Email de Soporte",
        description: "Email para consultas de soporte",
        order: 2
    },
    {
        key: "email_notifications_enabled",
        value: "true",
        type: "BOOLEAN",
        category: "email",
        label: "Notificaciones por Email",
        description: "Habilitar envío de notificaciones por email",
        order: 3
    },

    // 🐕 Configuración de Mascotas
    {
        key: "max_images_per_pet",
        value: "5",
        type: "NUMBER",
        category: "pets",
        label: "Máximo de Imágenes por Mascota",
        description: "Número máximo de imágenes que se pueden subir por mascota",
        order: 1
    },
    {
        key: "pet_types_allowed",
        value: '["DOG", "CAT"]',
        type: "JSON",
        category: "pets",
        label: "Tipos de Mascotas Permitidos",
        description: "Lista de tipos de mascotas que se pueden registrar",
        order: 2
    },
    {
        key: "require_pet_description",
        value: "true",
        type: "BOOLEAN",
        category: "pets",
        label: "Requerir Descripción",
        description: "Hacer obligatorio el campo descripción",
        order: 3
    },
    {
        key: "max_pets_per_owner",
        value: "10",
        type: "NUMBER",
        category: "pets",
        label: "Máximo de Mascotas por Propietario",
        description: "Límite de mascotas que puede registrar un propietario",
        order: 4
    },

    // 👥 Configuración de Usuarios
    {
        key: "require_email_verification",
        value: "false",
        type: "BOOLEAN",
        category: "users",
        label: "Requerir Verificación de Email",
        description: "Los usuarios deben verificar su email para usar la plataforma",
        order: 1
    },
    {
        key: "require_phone_verification",
        value: "false",
        type: "BOOLEAN",
        category: "users",
        label: "Requerir Verificación de Teléfono",
        description: "Los usuarios deben verificar su teléfono",
        order: 2
    },
    {
        key: "allow_user_registration",
        value: "true",
        type: "BOOLEAN",
        category: "users",
        label: "Permitir Registro de Usuarios",
        description: "Habilitar el registro público de usuarios",
        order: 3
    },
    {
        key: "default_user_role",
        value: "USER",
        type: "SELECT",
        category: "users",
        label: "Rol por Defecto",
        description: "Rol asignado automáticamente a nuevos usuarios",
        order: 4
    },

    // 🔒 Configuración de Seguridad
    {
        key: "session_timeout_hours",
        value: "24",
        type: "NUMBER",
        category: "security",
        label: "Tiempo de Sesión (horas)",
        description: "Tiempo antes de que expire una sesión",
        order: 1
    },
    {
        key: "min_password_length",
        value: "8",
        type: "NUMBER",
        category: "security",
        label: "Longitud Mínima de Contraseña",
        description: "Número mínimo de caracteres para contraseñas",
        order: 2
    },
    {
        key: "require_strong_passwords",
        value: "true",
        type: "BOOLEAN",
        category: "security",
        label: "Requerir Contraseñas Fuertes",
        description: "Exigir mayúsculas, números y símbolos",
        order: 3
    },
    {
        key: "max_login_attempts",
        value: "5",
        type: "NUMBER",
        category: "security",
        label: "Máximo Intentos de Login",
        description: "Intentos antes de bloquear cuenta temporalmente",
        order: 4
    }
];

async function seedSettings() {
    try {
        console.log('🌱 Poblando configuraciones iniciales...\n');

        for (const setting of initialSettings) {
            const existing = await prisma.setting.findUnique({
                where: { key: setting.key }
            });

            if (!existing) {
                await prisma.setting.create({ data: setting });
                console.log(`✅ Creada: ${setting.label}`);
            } else {
                console.log(`⏭️  Ya existe: ${setting.label}`);
            }
        }

        console.log('\n🎉 Configuraciones iniciales completadas!');

        // Mostrar resumen por categoría
        const categories = await prisma.setting.groupBy({
            by: ['category'],
            _count: true
        });

        console.log('\n📊 Resumen por categoría:');
        categories.forEach(cat => {
            const categoryName = {
                'company': '🏢 Empresa',
                'email': '📧 Email',
                'pets': '🐕 Mascotas',
                'users': '👥 Usuarios',
                'security': '🔒 Seguridad'
            }[cat.category] || cat.category;

            console.log(`   ${categoryName}: ${cat._count} configuraciones`);
        });

    } catch (error) {
        console.error('❌ Error poblando configuraciones:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedSettings();