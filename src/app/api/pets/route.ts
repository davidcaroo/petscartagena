import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/jwt-auth";
import { writeFile } from "fs/promises";
import path from "path";
import { PetType, PetSize, PetGender } from "@prisma/client";

export const POST = requireRole('OWNER')(async (request: NextRequest, user) => {
  try {
    const formData = await request.formData();
    
    // Extract pet data
    const petData = {
      name: formData.get("name") as string,
      type: formData.get("type") as PetType,
      breed: formData.get("breed") as string || null,
      age: parseInt(formData.get("age") as string),
      color: formData.get("color") as string || null,
      size: formData.get("size") as PetSize || null,
      gender: formData.get("gender") as PetGender || null,
      description: formData.get("description") as string,
      favoriteFood: formData.get("favoriteFood") as string || null,
      favoriteToy: formData.get("favoriteToy") as string || null,
      medicalTreatment: formData.get("medicalTreatment") as string || null,
      ownerId: user.id
    };

    // Validate required fields
    if (!petData.name || !petData.type || !petData.age || !petData.description) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Create pet
    const pet = await db.pet.create({
      data: petData
    });

    // Handle image uploads
    const imageUrls: string[] = [];
    for (let i = 0; i < 5; i++) {
      const image = formData.get(`image${i}`) as File;
      if (image) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate unique filename
        const fileName = `${pet.id}-${Date.now()}-${i}${path.extname(image.name)}`;
        const filePath = path.join(process.cwd(), "public", "uploads", "pets", fileName);
        
        // Ensure directory exists
        await import("fs").then(fs => {
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
        });
        
        // Write file
        await writeFile(filePath, buffer);
        
        const imageUrl = `/uploads/pets/${fileName}`;
        imageUrls.push(imageUrl);
        
        // Save image to database
        await db.petImage.create({
          data: {
            url: imageUrl,
            petId: pet.id,
            order: i
          }
        });
      }
    }

    // Return created pet with images
    const createdPet = await db.pet.findUnique({
      where: { id: pet.id },
      include: {
        images: {
          orderBy: {
            order: "asc"
          }
        }
      }
    });

    return NextResponse.json(createdPet, { status: 201 });
  } catch (error) {
    console.error("Error creating pet:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al crear la mascota" },
      { status: 500 }
    );
  }
});