const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updatePublicSettings() {
    const publicKeys = ['platform_name', 'company_email', 'company_phone', 'company_address', 'company_description'];

    for (const key of publicKeys) {
        await prisma.setting.update({
            where: { key },
            data: { isPublic: true }
        });
        console.log('✅ Marcado como público:', key);
    }

    console.log('🎉 Todas las configuraciones de contacto están marcadas como públicas');
    await prisma.$disconnect();
}

updatePublicSettings().catch(console.error);