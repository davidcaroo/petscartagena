const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        console.log('👑 Creando usuario administrador...\n');

        // Datos del admin
        const adminData = {
            name: 'Administrador PetsCartagena',
            email: 'admin@petscartagena.com',
            password: 'admin123456', // Cambiar después
            role: 'ADMIN',
            phone: '+57 300 123 4567'
        };

        // Verificar si ya existe
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminData.email }
        });

        if (existingAdmin) {
            console.log('⚠️  El usuario admin ya existe');
            return;
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(adminData.password, 12);

        // Crear usuario admin
        const admin = await prisma.user.create({
            data: {
                name: adminData.name,
                email: adminData.email,
                password: hashedPassword,
                role: adminData.role,
                phone: adminData.phone,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                createdAt: true
            }
        });

        console.log('✅ Usuario administrador creado exitosamente!\n');
        console.log('📋 CREDENCIALES DE ACCESO:');
        console.log('🔹 Email: admin@petscartagena.com');
        console.log('🔹 Contraseña: admin123456');
        console.log('🔹 Rol: ADMIN');
        console.log('\n🚨 IMPORTANTE: Cambia la contraseña después del primer login');
        console.log('\n👤 Datos del usuario:');
        console.log(`   ID: ${admin.id}`);
        console.log(`   Nombre: ${admin.name}`);
        console.log(`   Teléfono: ${admin.phone}`);
        console.log(`   Creado: ${admin.createdAt.toLocaleString()}`);

    } catch (error) {
        console.error('❌ Error al crear administrador:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();