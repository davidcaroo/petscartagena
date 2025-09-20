import { db } from "../src/lib/db";

async function createTestAdoptions() {
  try {
    console.log("🔍 Verificando usuarios y mascotas existentes...");
    
    // Obtener usuarios que no sean admin y no sean propietarios de mascotas
    const users = await db.user.findMany({
      where: {
        role: "USER",
        NOT: {
          pets: {
            some: {}
          }
        }
      },
      take: 5
    });
    
    // Obtener mascotas disponibles
    const pets = await db.pet.findMany({
      where: {
        isAvailable: true
      },
      take: 5,
      include: {
        owner: true
      }
    });
    
    console.log(`✅ Encontrados ${users.length} usuarios y ${pets.length} mascotas`);
    
    if (users.length < 2 || pets.length < 2) {
      console.log("❌ No hay suficientes usuarios o mascotas para crear adopciones de prueba");
      return;
    }
    
    // Crear adopciones de prueba
    const adoptions = [
      {
        userId: users[0].id,
        petId: pets[0].id,
        status: "PENDING" as const,
        message: "Hola, estoy muy interesado en adoptar a esta hermosa mascota. Tengo experiencia con animales y un hogar muy amoroso para ofrecer. Trabajo desde casa, así que tendría mucho tiempo para dedicarle.",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
      },
      {
        userId: users[1].id,
        petId: pets[1].id,
        status: "PENDING" as const,
        message: "Me encantaría darle un hogar a esta mascota. Tengo un patio grande y mucha experiencia cuidando animales. Vivo en una casa con jardín y sin otras mascotas.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
      }
    ];
    
    // Solo crear más adopciones si hay suficientes usuarios y mascotas
    if (users.length >= 4 && pets.length >= 4) {
      adoptions.push(
        {
          userId: users[2].id,
          petId: pets[2].id,
          status: "ACCEPTED" as const,
          message: "¡Estoy emocionado de adoptar a esta mascota! Prometo cuidarla muy bien. Tengo toda la documentación lista.",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 días atrás
        },
        {
          userId: users[3].id,
          petId: pets[3].id,
          status: "REJECTED" as const,
          message: "Me gustaría adoptar esta mascota para mi hijo. Tenemos una casa pequeña pero mucho amor que dar.",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
        }
      );
    }
    
    console.log(`📝 Creando ${adoptions.length} solicitudes de adopción...`);
    
    for (const adoption of adoptions) {
      try {
        const created = await db.adoptionRequest.create({
          data: adoption,
          include: {
            user: { select: { name: true, email: true } },
            pet: { select: { name: true, type: true } }
          }
        });
        
        console.log(`✅ Creada adopción: ${created.user.name} quiere adoptar a ${created.pet.name} (${created.status})`);
      } catch (error) {
        console.log(`⚠️ Error creando adopción: ${error}`);
      }
    }
    
    // Mostrar resumen
    const totalAdoptions = await db.adoptionRequest.count();
    const pendingAdoptions = await db.adoptionRequest.count({
      where: { status: "PENDING" }
    });
    
    console.log(`\n📊 Resumen:`);
    console.log(`   Total de adopciones: ${totalAdoptions}`);
    console.log(`   Adopciones pendientes: ${pendingAdoptions}`);
    
    console.log("\n🎉 ¡Datos de prueba creados exitosamente!");
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await db.$disconnect();
  }
}

createTestAdoptions();