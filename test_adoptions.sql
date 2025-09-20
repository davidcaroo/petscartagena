-- Datos de prueba para solicitudes de adopción
-- Asegúrate de que estas IDs existan en tu base de datos
-- Primero veamos qué mascotas y usuarios tenemos
SELECT
    'Mascotas disponibles:' as info;

SELECT
    id,
    name,
    type,
    breed,
    ownerId
FROM
    Pet
WHERE
    isAvailable = 1
LIMIT
    5;

SELECT
    'Usuarios disponibles (no propietarios):' as info;

SELECT DISTINCT
    u.id,
    u.name,
    u.email
FROM
    User u
WHERE
    u.id NOT IN (
        SELECT DISTINCT
            ownerId
        FROM
            Pet
        WHERE
            ownerId IS NOT NULL
    )
LIMIT
    5;

-- Crear algunas solicitudes de adopción de prueba
-- NOTA: Reemplaza las IDs por las que realmente existen en tu DB
-- Solicitud pendiente 1
INSERT INTO
    AdoptionRequest (
        id,
        userId,
        petId,
        status,
        message,
        createdAt,
        updatedAt
    )
VALUES
    (
        'adoption_' || datetime ('now', 'localtime') || '_1',
        (
            SELECT
                id
            FROM
                User
            WHERE
                role = 'USER'
            LIMIT
                1
        ),
        (
            SELECT
                id
            FROM
                Pet
            WHERE
                isAvailable = 1
            LIMIT
                1
        ),
        'PENDING',
        'Hola, estoy muy interesado en adoptar a esta hermosa mascota. Tengo experiencia con animales y un hogar muy amoroso para ofrecer. Trabajo desde casa, así que tendría mucho tiempo para dedicarle.',
        datetime ('now', '-2 days'),
        datetime ('now', '-2 days')
    );

-- Solicitud pendiente 2  
INSERT INTO
    AdoptionRequest (
        id,
        userId,
        petId,
        status,
        message,
        createdAt,
        updatedAt
    )
VALUES
    (
        'adoption_' || datetime ('now', 'localtime') || '_2',
        (
            SELECT
                id
            FROM
                User
            WHERE
                role = 'USER'
                AND id != (
                    SELECT
                        id
                    FROM
                        User
                    WHERE
                        role = 'USER'
                    LIMIT
                        1
                )
            LIMIT
                1
            OFFSET
                1
        ),
        (
            SELECT
                id
            FROM
                Pet
            WHERE
                isAvailable = 1
            LIMIT
                1
            OFFSET
                1
        ),
        'PENDING',
        'Me encantaría darle un hogar a esta mascota. Tengo un patio grande y mucha experiencia cuidando animales.',
        datetime ('now', '-1 day'),
        datetime ('now', '-1 day')
    );

-- Solicitud aprobada
INSERT INTO
    AdoptionRequest (
        id,
        userId,
        petId,
        status,
        message,
        createdAt,
        updatedAt
    )
VALUES
    (
        'adoption_' || datetime ('now', 'localtime') || '_3',
        (
            SELECT
                id
            FROM
                User
            WHERE
                role = 'USER'
            LIMIT
                1
            OFFSET
                2
        ),
        (
            SELECT
                id
            FROM
                Pet
            WHERE
                isAvailable = 1
            LIMIT
                1
            OFFSET
                2
        ),
        'ACCEPTED',
        '¡Estoy emocionado de adoptar a esta mascota! Prometo cuidarla muy bien.',
        datetime ('now', '-5 days'),
        datetime ('now', '-3 days')
    );

-- Solicitud rechazada
INSERT INTO
    AdoptionRequest (
        id,
        userId,
        petId,
        status,
        message,
        createdAt,
        updatedAt
    )
VALUES
    (
        'adoption_' || datetime ('now', 'localtime') || '_4',
        (
            SELECT
                id
            FROM
                User
            WHERE
                role = 'USER'
            LIMIT
                1
            OFFSET
                3
        ),
        (
            SELECT
                id
            FROM
                Pet
            WHERE
                isAvailable = 1
            LIMIT
                1
            OFFSET
                3
        ),
        'REJECTED',
        'Me gustaría adoptar esta mascota para mi hijo.',
        datetime ('now', '-7 days'),
        datetime ('now', '-6 days')
    );

SELECT
    'Solicitudes de adopción creadas:' as resultado;

SELECT
    ar.id,
    ar.status,
    u.name as usuario,
    p.name as mascota,
    ar.createdAt
FROM
    AdoptionRequest ar
    JOIN User u ON ar.userId = u.id
    JOIN Pet p ON ar.petId = p.id
ORDER BY
    ar.createdAt DESC;