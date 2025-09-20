const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestActivity() {
    try {
        console.log('🧪 Creando nueva actividad de prueba...');

        // Obtener un usuario existente
        const user = await prisma.user.findFirst({
            where: {
                role: 'USER'
            }
        });

        if (!user) {
            console.log('❌ No hay usuarios disponibles');
            return;
        }

        // Crear una nueva actividad de prueba
        const activity = await prisma.activity.create({
            data: {
                type: 'SYSTEM_EVENT',
                action: 'Sistema actualizado',
                description: `Nueva funcionalidad de actividades implementada (${new Date().toLocaleTimeString()})`,
                userId: user.id,
                createdAt: new Date() // Fecha actual
            }
        });

        console.log('✅ Nueva actividad creada:', {
            id: activity.id,
            action: activity.action,
            description: activity.description,
            timestamp: activity.createdAt
        });

        // Verificar que apareció en la lista
        const recentActivities = await prisma.activity.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        console.log('\n📊 Últimas 5 actividades:');
        recentActivities.forEach((act, index) => {
            console.log(`${index + 1}. ${act.action} - ${act.description}`);
            console.log(`   Fecha: ${act.createdAt.toLocaleString()}`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestActivity();