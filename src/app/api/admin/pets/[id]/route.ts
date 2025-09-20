import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No tienes permisos de administrador" },
        { status: 403 }
      );
    }

    // Get pet with images
    const pet = await db.pet.findUnique({
      where: { id: params.id },
      include: {
        images: true
      }
    });

    if (!pet) {
      return NextResponse.json(
        { error: "Mascota no encontrada" },
        { status: 404 }
      );
    }

    // Delete image files
    for (const image of pet.images) {
      try {
        const filePath = path.join(process.cwd(), "public", image.url);
        await import("fs").then(fs => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      } catch (error) {
        console.error("Error deleting image file:", error);
      }
    }

    // Delete pet and all related data (cascade delete)
    await db.pet.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Mascota eliminada exitosamente" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al eliminar la mascota" },
      { status: 500 }
    );
  }
}