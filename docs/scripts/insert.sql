-- --------------------------------------------------------
INSERT INTO
    `region` (`nombre`)
VALUES
    ('Arica y Parinacota'),
    ('Tarapacá'),
    ('Antofagasta'),
    ('Atacama'),
    ('Coquimbo'),
    ('Valparaíso'),
    (
        'Región del Libertador General Bernardo O’Higgins'
    ),
    ('Región del Maule'),
    ('Región de Ñuble'),
    ('Región del Biobío'),
    ('Región de La Araucanía'),
    ('Región de Los Ríos'),
    ('Región de Los Lagos'),
    (
        'Región de Aysén del General Carlos Ibáñez del Campo'
    ),
    ('Región de Magallanes y de la Antártica Chilena'),
    ('Región Metropolitana de Santiago');

-- --------------------------------------------------------
INSERT INTO
    `ciudad` (`nombre`, `region_id`)
VALUES
    -- Arica y Parinacota
    ('Putre', 1),
    ('Camarones', 1),
    -- Tarapacá
    ('Alto Hospicio', 2),
    ('Pozo Almonte', 2),
    ('Huara', 2),
    ('Pica', 2),
    -- Antofagasta
    ('Calama', 3),
    ('Tocopilla', 3),
    ('Mejillones', 3),
    ('San Pedro de Atacama', 3),
    ('María Elena', 3),
    -- Atacama
    ('Vallenar', 4),
    ('Domeyko', 4),
    ('Tierra Amarilla', 4),
    ('Chañaral', 4),
    ('Diego de Almagro', 4),
    -- Coquimbo
    ('Ovalle', 5),
    ('Illapel', 5),
    ('Vicuña', 5),
    ('Salamanca', 5),
    ('Andacollo', 5),
    ('Monte Patria', 5),
    -- Valparaíso
    ('San Antonio', 6),
    ('Quilpué', 6),
    ('Villa Alemana', 6),
    ('San Felipe', 6),
    ('Quillota', 6),
    ('La Ligua', 6),
    ('Zapallar', 6),
    ('Los Andes', 6),
    ('Cabildo', 6),
    ('Calera', 6),
    ('Cartagena', 6),
    ('El Quisco', 6),
    ('El Tabo', 6),
    ('La Calera', 6),
    ('La Cruz', 6),
    ('Limache', 6),
    ('Olmué', 6),
    ('Petorca', 6),
    ('Puchuncaví', 6),
    ('Rinconada', 6),
    ('Santo Domingo', 6),
    -- Región del Libertador General Bernardo O’Higgins
    ('San Fernando', 7),
    ('Santa Cruz', 7),
    ('Pichilemu', 7),
    ('Machalí', 7),
    -- Región del Maule
    ('Cauquenes', 8),
    ('Curicó', 8),
    ('Linares', 8),
    ('Parral', 8),
    ('Molina', 8),
    ('Constitución', 8),
    -- Región de Ñuble
    ('Bulnes', 9),
    ('San Carlos', 9),
    ('Yungay', 9),
    ('Quirihue', 9),
    ('Coelemu', 9),
    ('El Carmen', 9),
    -- Región del Biobío
    ('Los Ángeles', 10),
    ('Talcahuano', 10),
    ('Chiguayante', 10),
    ('Coronel', 10),
    ('Lota', 10),
    ('Tomé', 10),
    ('Hualpén', 10),
    -- Región de La Araucanía
    ('Angol', 11),
    ('Villarrica', 11),
    ('Pucón', 11),
    ('Lautaro', 11),
    ('Nueva Imperial', 11),
    -- Región de Los Ríos
    ('La Unión', 12),
    ('Río Bueno', 12),
    ('Panguipulli', 12),
    ('Paillaco', 12),
    -- Región de Los Lagos
    ('Osorno', 13),
    ('Castro', 13),
    ('Ancud', 13),
    ('Frutillar', 13),
    ('Fresia', 13),
    ('Chaitén', 13),
    -- Región de Aysén del General Carlos Ibáñez del Campo
    ('Aysén', 14),
    ('Puerto Aysén', 14),
    ('Chile Chico', 14),
    ('Cochrane', 14),
    ('Coyhaique', 14),
    -- Región de Magallanes y de la Antártica Chilena
    ('Puerto Natales', 15),
    ('Porvenir', 15),
    ('Cerro Sombrero', 15),
    ('Punta Arenas', 15),
    ('Puerto Williams', 15),
    -- Región Metropolitana de Santiago
    ('Buin', 16),
    ('Cerro Navia', 16),
    ('Colina', 16),
    ('Conchalí', 16),
    ('Curacaví', 16),
    ('El Bosque', 16),
    ('El Monte', 16),
    ('Estación Central', 16),
    ('Huechuraba', 16),
    ('Independencia', 16),
    ('Isla de Maipo', 16),
    ('La Cisterna', 16),
    ('La Granja', 16),
    ('La Reina', 16),
    ('Lampa', 16),
    ('Lo Barnechea', 16),
    ('Lo Espejo', 16),
    ('Lo Prado', 16),
    ('Macul', 16),
    ('María Pinto', 16),
    ('Melipilla', 16),
    ('Ñuñoa', 16),
    ('Pedro Aguirre Cerda', 16),
    ('Peñalolén', 16),
    ('Pirque', 16),
    ('Providencia', 16),
    ('Pudahuel', 16),
    -- Ya incluido en tu lista anterior
    ('Quilicura', 16),
    ('Quinta Normal', 16),
    ('Recoleta', 16),
    ('Renca', 16),
    ('San Bernardo', 16),
    ('San Joaquín', 16),
    ('San José de Maipo', 16),
    ('San Miguel', 16),
    ('San Pedro', 16),
    ('Santa María', 16),
    ('Santiago', 16),
    -- Centro de Santiago
    ('Talagante', 16),
    ('Tiltil', 16),
    ('Vitacura', 16);

-- --------------------------------------------------------

INSERT INTO `direccion` (`calle`, `numero`, `departamento`, `codigo_postal`, `ciudad_id`) 
VALUES 
('Calle Principal', '1234', '5A', '56789', 4),
('Avenida Secundaria', '5678', '3B', '56790', 2),
('Calle Tercera', '9101', NULL, '56791', 55),
('Avenida Cuarta', '1121', '9C', '56792', 33),
('Calle Quinta', '3141', '2D', '56793', 28);

INSERT INTO colegio.apoderado_direccion (apoderado_id, direccion_id, tipo_direccion)
VALUES
(1, 1, 'Domicilio'),
(2, 2, 'Domicilio');
-- --------------------------------------------------------
INSERT INTO
    `estado_boleta` (`descripcion`)
VALUES
    ('Pagada'),
    ('Pendiente'),
    ('Anulada');

-- --------------------------------------------------------
INSERT INTO
    `tipo_pago` (`detalle`)
VALUES
    ('Efectivo'),
    ('Tarjeta de Crédito'),
    ('Transferencia Bancaria'),
    ('Cheque');

-- --------------------------------------------------------

-- Insertar roles
INSERT INTO `roles` (`nombre`, `descripcion`) VALUES 
('ADMIN', 'Administrador del sistema'),
('APODERADO', 'Apoderado de un estudiante'),
('PROFESOR', 'Profesor del colegio');

-- --------------------------------------------------------

-- Insertar profesores
INSERT INTO `profesor` (`primer_nombre`, `primer_apellido`, `rut`, `dv`, `correo_electronico`) VALUES
('Juan', 'Perez', '12345678', '9', 'juan.perez@example.com'),
('María', 'Rojas', '87654321', '0', 'maria.rojas@example.com');

-- --------------------------------------------------------

-- Insertar apoderados
INSERT INTO `apoderado` (`primer_nombre`, `primer_apellido`, `rut`, `dv`, `correo_electronico`, `fecha_nacimiento`) VALUES
('Carlos', 'Gomez', '23456789', '8', 'carlos.gomez@example.com', '1980-01-15'),
('Ana', 'Martinez', '98765432', '7', 'ana.martinez@example.com', '1982-05-25');

-- --------------------------------------------------------

INSERT INTO `usuarios` (`username`, `password`, `correo_electronico`, `apoderado_id`, `profesor_id`) VALUES
('juanp', 'password1', 'juan.perez@example.com', NULL, 1),
('mariar', 'password2', 'maria.rojas@example.com', NULL, 2),
('carlosg', 'password3', 'carlos.gomez@example.com', 1, NULL),
('anam', 'password4', 'ana.martinez@example.com', 2, NULL),
('omarg', 'password', 'om.guerra@example.com', NULL, NULL);

-- Asignar roles a usuarios
-- Juan es un profesor
INSERT INTO `usuario_roles` (`usuario_id`, `role_id`) VALUES (1, 3);
-- María es un profesor
INSERT INTO `usuario_roles` (`usuario_id`, `role_id`) VALUES (2, 3);
-- Carlos es un apoderado
INSERT INTO `usuario_roles` (`usuario_id`, `role_id`) VALUES (3, 2);
-- Ana es un apoderado
INSERT INTO `usuario_roles` (`usuario_id`, `role_id`) VALUES (4, 2);
-- omarg es un administrador
INSERT INTO `usuario_roles` (`usuario_id`, `role_id`) VALUES (5, 1);


-- --------------------------------------------------------
-- Insertar dos estudiantes
INSERT INTO `estudiante` (
    `primer_nombre`, `segundo_nombre`, `primer_apellido`, `segundo_apellido`, 
    `fecha_nacimiento`, `rut`, `dv`, `telefono_contacto`, `genero`, 
    `alergico`, `vive_con`, `enfermedad_cronica`
) VALUES 
('Juan', 'Pablo', 'González', 'Pérez', '2005-04-15', '12345678', '9', '123456789', 'Masculino', 'Polen', 'Padres', 'Asma'),
('María', 'Isabel', 'Rodríguez', 'Vargas', '2006-08-22', '12345679', 'K', '987654321', 'Femenino', 'Ninguna', 'Padres', NULL);
('Juan2', 'Pablo2', 'González2', 'Pérez2', '2005-04-15', '12345678', '9', '123456789', 'Masculino', 'Polen', 'Padres', 'Asma'),
('María2', 'Isabel2', 'Rodríguez2', 'Vargas2', '2006-08-22', '12345679', 'K', '987654321', 'Femenino', 'Ninguna', 'Padres', NULL);

-- Relacionar a los estudiantes con el apoderado con id 1
-- Suponiendo que los IDs de los estudiantes insertados son 1 y 2
INSERT INTO `apoderado_estudiante` (`apoderado_id`, `estudiante_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 4);
