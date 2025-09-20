const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
    try {
        console.log('🔍 Revisando usuarios en la base de datos...\n');

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (users.length === 0) {
            console.log('❌ No hay usuarios en la base de datos');
        } else {
            console.log(`✅ Encontrados ${users.length} usuarios:\n`);

            users.forEach((user, index) => {
                console.log(`${index + 1}. ${user.name || 'Sin nombre'}`);
                console.log(`   📧 Email: ${user.email}`);
                console.log(`   👤 Rol: ${user.role}`);
                console.log(`   📅 Creado: ${user.createdAt.toLocaleDateString()}`);
                console.log('');
            });

            // Verificar si hay admin
            const adminUsers = users.filter(user => user.role === 'ADMIN');
            if (adminUsers.length > 0) {
                console.log('🎯 Usuarios ADMIN encontrados:');
                adminUsers.forEach(admin => {
                    console.log(`   👑 ${admin.name} (${admin.email})`);
                });
            } else {
                console.log('⚠️  No hay usuarios con rol ADMIN');
            }
        }

    } catch (error) {
        console.error('❌ Error al consultar usuarios:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();