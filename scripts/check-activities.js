const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkActivities() {
    try {
        console.log('🔍 Verificando actividades en la base de datos...');

        const activities = await prisma.activity.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log(`📊 Total de actividades: ${activities.length}`);

        if (activities.length > 0) {
            console.log('\n📋 Últimas 5 actividades:');
            activities.slice(0, 5).forEach((activity, index) => {
                console.log(`${index + 1}. ${activity.action} - ${activity.description}`);
                console.log(`   Tipo: ${activity.type}, Usuario: ${activity.user?.name || 'Sin usuario'}`);
                console.log(`   Fecha: ${activity.createdAt}`);
                console.log('');
            });
        } else {
            console.log('❌ No hay actividades en la base de datos');
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        console.log(`👥 Total de usuarios: ${users.length}`);
        if (users.length > 0) {
            console.log('\n👤 Últimos usuarios:');
            users.slice(-3).forEach((user, index) => {
                console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
                console.log(`   Creado: ${user.createdAt}`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkActivities();