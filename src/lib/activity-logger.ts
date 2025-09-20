import { db } from "@/lib/db";

export type ActivityType = 
  | 'USER_REGISTRATION'
  | 'USER_VERIFICATION' 
  | 'PET_REGISTRATION'
  | 'PET_ADOPTION_REQUEST'
  | 'CHAT_STARTED'
  | 'ADOPTION_APPROVED'
  | 'ADOPTION_REJECTED'
  | 'ADMIN_ACTION'
  | 'SYSTEM_EVENT';

interface LogActivityParams {
  type: ActivityType;
  action: string;
  description: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export async function logActivity({
  type,
  action,
  description,
  userId,
  metadata
}: LogActivityParams) {
  try {
    await db.activity.create({
      data: {
        type,
        action,
        description,
        userId,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    });
  } catch (error) {
    console.error("Error logging activity:", error);
    // No lanzamos el error para que no afecte la funcionalidad principal
  }
}

// Funciones específicas para diferentes tipos de actividades
export const ActivityLogger = {
  userRegistered: (userId: string, userName: string, userEmail: string) => 
    logActivity({
      type: 'USER_REGISTRATION',
      action: 'Nuevo usuario',
      description: `${userName} se registró en la plataforma`,
      userId,
      metadata: { email: userEmail }
    }),

  userVerified: (userId: string, userName: string) =>
    logActivity({
      type: 'USER_VERIFICATION',
      action: 'Usuario verificado',
      description: `${userName} verificó su cuenta`,
      userId
    }),

  petRegistered: (userId: string, petName: string, petType: string, petBreed?: string) =>
    logActivity({
      type: 'PET_REGISTRATION',
      action: 'Nueva mascota',
      description: `${petName} (${petBreed || petType}) registrado para adopción`,
      userId,
      metadata: { petName, petType, petBreed }
    }),

  adoptionRequested: (userId: string, userName: string, petName: string, ownerId: string) =>
    logActivity({
      type: 'PET_ADOPTION_REQUEST',
      action: 'Solicitud de adopción',
      description: `${userName} quiere adoptar a ${petName}`,
      userId,
      metadata: { petName, ownerId }
    }),

  chatStarted: (userId: string, userName: string, otherUserName: string, petName?: string) =>
    logActivity({
      type: 'CHAT_STARTED',
      action: 'Chat iniciado',
      description: `${userName} inició conversación con ${otherUserName}${petName ? ` sobre ${petName}` : ''}`,
      userId,
      metadata: { otherUserName, petName }
    }),

  adoptionApproved: (userId: string, petName: string, adopterName: string) =>
    logActivity({
      type: 'ADOPTION_APPROVED',
      action: 'Adopción aprobada',
      description: `${adopterName} adoptó a ${petName}`,
      userId,
      metadata: { petName, adopterName }
    }),

  adoptionRejected: (userId: string, petName: string, adopterName: string) =>
    logActivity({
      type: 'ADOPTION_REJECTED',
      action: 'Adopción rechazada',
      description: `Solicitud de adopción de ${petName} por ${adopterName} fue rechazada`,
      userId,
      metadata: { petName, adopterName }
    }),

  adminAction: (adminId: string, action: string, description: string, metadata?: Record<string, any>) =>
    logActivity({
      type: 'ADMIN_ACTION',
      action,
      description,
      userId: adminId,
      metadata
    }),

  systemEvent: (action: string, description: string, metadata?: Record<string, any>) =>
    logActivity({
      type: 'SYSTEM_EVENT',
      action,
      description,
      metadata
    })
};