// Modelo para configuraciones en Prisma
model Setting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  type      SettingType
  category  String
  label     String
  description String?
  isPublic  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("settings")
}

enum SettingType {
  TEXT
  NUMBER
  BOOLEAN
  EMAIL
  URL
  COLOR
  JSON
  FILE
}

// Ejemplos de configuraciones:
/*
{
  key: "platform_name",
  value: "PetsCartagena",
  type: "TEXT",
  category: "general",
  label: "Nombre de la Plataforma",
  description: "Nombre que aparece en el header y emails"
},
{
  key: "max_images_per_pet", 
  value: "5",
  type: "NUMBER",
  category: "pets",
  label: "Máximo de imágenes por mascota"
},
{
  key: "require_phone_verification",
  value: "false", 
  type: "BOOLEAN",
  category: "users",
  label: "Requerir verificación de teléfono"
}
*/