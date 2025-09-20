const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedActivities() {
    try {
        console.log('🌱 Creando actividades de prueba...');

        // Obtener algunos usuarios existentes
        const users = await prisma.user.findMany({
            take: 3
        });

        if (users.length === 0) {
            console.log('❌ No hay usuarios disponibles para crear actividades');
            return;
        }

        // Crear actividades de prueba
        const activities = [
            {
                type: 'USER_REGISTRATION',
                action: 'Nuevo usuario',
                description: `${users[0]?.name || 'Usuario'} se registró en la plataforma`,
                userId: users[0]?.id,
                createdAt: new Date(Date.now() - 5 * 60 * 1000) // Hace 5 minutos
            },
            {
                type: 'PET_REGISTRATION',
                action: 'Nueva mascota',
                description: 'Max (Labrador) registrado para adopción',
                userId: users[1]?.id,
                createdAt: new Date(Date.now() - 15 * 60 * 1000) // Hace 15 minutos
            },
            {
                type: 'PET_ADOPTION_REQUEST',
                action: 'Solicitud de adopción',
                description: `${users[2]?.name || 'Usuario'} quiere adoptar a Luna`,
                userId: users[2]?.id,
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // Hace 1 hora
            },
            {
                type: 'CHAT_STARTED',
                action: 'Chat iniciado',
                description: 'Conversación iniciada entre adoptante y dueño sobre Bobby',
                userId: users[0]?.id,
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // Hace 2 horas
            },
            {
                type: 'ADOPTION_APPROVED',
                action: 'Adopción aprobada',
                description: 'Bella fue adoptada exitosamente',
                userId: users[1]?.id,
                createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // Hace 3 horas
            },
            {
                type: 'SYSTEM_EVENT',
                action: 'Actualización del sistema',
                description: 'Nueva funcionalidad de chat implementada',
                createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // Hace 6 horas
            },
            {
                type: 'USER_VERIFICATION',
                action: 'Usuario verificado',
                description: `${users[0]?.name || 'Usuario'} verificó su cuenta por email`,
                userId: users[0]?.id,
                createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000) // Hace 8 horas
            },
            {
                type: 'PET_REGISTRATION',
                action: 'Nueva mascota',
                description: 'Charlie (Gato Persa) registrado para adopción',
                userId: users[2]?.id,
                createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // Hace 12 horas
            }
        ];

        // Crear las actividades
        for (const activity of activities) {
            await prisma.activity.create({
                data: activity
            });
        }

        console.log(`✅ Se crearon ${activities.length} actividades de prueba`);

    } catch (error) {
        console.error('❌ Error creando actividades:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedActivities();