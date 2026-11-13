-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 13-11-2026 a las 17:23:53
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `consultorio`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `disponibilidad`
--

CREATE TABLE `disponibilidad` (
  `id_disponibilidad` int(11) NOT NULL,
  `dia` varchar(15) NOT NULL,
  `hora_desde` time NOT NULL,
  `hora_hasta` time NOT NULL
) ;

--
-- Volcado de datos para la tabla `disponibilidad`
--

INSERT INTO `disponibilidad` (`id_disponibilidad`, `dia`, `hora_desde`, `hora_hasta`) VALUES
(1, 'Lunes', '08:00:00', '12:00:00'),
(2, 'Lunes', '14:00:00', '18:00:00'),
(3, 'Martes', '08:00:00', '12:00:00'),
(4, 'Martes', '14:00:00', '18:00:00'),
(5, 'Mi??rcoles', '08:00:00', '12:00:00'),
(6, 'Mi??rcoles', '14:00:00', '18:00:00'),
(7, 'Jueves', '08:00:00', '12:00:00'),
(8, 'Jueves', '14:00:00', '18:00:00'),
(9, 'Viernes', '08:00:00', '12:00:00'),
(10, 'Viernes', '14:00:00', '18:00:00'),
(11, 'Lunes', '08:00:00', '16:00:00'),
(12, 'Martes', '08:00:00', '16:00:00'),
(13, 'Mi??rcoles', '08:00:00', '16:00:00'),
(14, 'Jueves', '08:00:00', '16:00:00'),
(15, 'Viernes', '08:00:00', '16:00:00'),
(16, 'Lunes', '09:00:00', '13:00:00'),
(17, 'Martes', '09:00:00', '13:00:00'),
(18, 'Mi??rcoles', '09:00:00', '13:00:00'),
(19, 'Jueves', '09:00:00', '13:00:00'),
(20, 'Viernes', '09:00:00', '13:00:00'),
(21, 'Lunes', '15:00:00', '19:00:00'),
(22, 'Martes', '15:00:00', '19:00:00'),
(23, 'Mi??rcoles', '15:00:00', '19:00:00'),
(24, 'Jueves', '15:00:00', '19:00:00'),
(25, 'Viernes', '15:00:00', '19:00:00'),
(26, 'Lunes', '18:00:00', '21:00:00'),
(27, 'Martes', '18:00:00', '21:00:00'),
(28, 'Mi??rcoles', '18:00:00', '21:00:00'),
(29, 'Jueves', '18:00:00', '21:00:00'),
(30, 'Viernes', '18:00:00', '21:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipo`
--

CREATE TABLE `equipo` (
  `id_equipo` int(11) NOT NULL,
  `nombre_equipo` varchar(100) NOT NULL,
  `id_servicio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipo`
--

INSERT INTO `equipo` (`id_equipo`, `nombre_equipo`, `id_servicio`) VALUES
(1, 'Electrocardi??grafo 01', 2),
(2, 'Electrocardi??grafo 02', 2),
(3, 'Ec??grafo General 01', 8),
(4, 'Ec??grafo General 02', 8),
(5, 'Ec??grafo Obst??trico', 8),
(6, 'Equipo de Rayos X', 4),
(7, 'Tom??grafo CT 01', 8),
(8, 'Resonador Magn??tico 01', 8),
(9, 'Dermatoscopio 01', 6),
(10, 'L??mpara Dermatol??gica', 6),
(11, 'Ec??grafo Port??til', 8),
(12, 'Equipo Oftalmol??gico 01', 7),
(13, 'Retin??grafo', 7),
(14, 'Camilla Traumatol??gica', 4),
(15, 'Monitor Multiparam??trico', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico`
--

CREATE TABLE `medico` (
  `matricula_medico` int(11) NOT NULL,
  `apellido_medico` varchar(50) NOT NULL,
  `nombre_medico` varchar(50) NOT NULL,
  `tel_medico` varchar(30) DEFAULT NULL,
  `matricula_supervisor` int(11) DEFAULT NULL,
  `id_servicio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medico`
--

INSERT INTO `medico` (`matricula_medico`, `apellido_medico`, `nombre_medico`, `tel_medico`, `matricula_supervisor`, `id_servicio`) VALUES
(1001, 'P??rez', 'Marcelo', '2964611001', NULL, 1),
(1002, 'G??mez', 'Laura', '2964611002', 1001, 1),
(1003, 'Rodr??guez', 'Carlos', '2964611003', NULL, 2),
(1004, 'Fern??ndez', 'Andrea', '2964611004', 1003, 2),
(1005, 'L??pez', 'Mart??n', '2964611005', NULL, 3),
(1006, 'Mart??nez', 'Sof??a', '2964611006', 1005, 3),
(1007, 'Gonz??lez', 'Pablo', '2964611007', NULL, 4),
(1008, 'S??nchez', 'Carolina', '2964611008', 1007, 4),
(1009, 'Romero', 'Diego', '2964611009', NULL, 5),
(1010, 'Torres', 'Mariana', '2964611010', 1009, 5),
(1011, '??lvarez', 'Ricardo', '2964611011', NULL, 6),
(1012, 'Ruiz', 'Valeria', '2964611012', 1011, 6),
(1013, 'Ram??rez', 'Jorge', '2964611013', NULL, 7),
(1014, 'Flores', 'Natalia', '2964611014', 1013, 7),
(1015, 'Ben??tez', 'Federico', '2964611015', NULL, 8),
(1016, 'Acosta', 'Paula', '2964611016', 1015, 8),
(1017, 'Medina', 'Gustavo', '2964611017', 1001, 1),
(1018, 'Su??rez', 'Ver??nica', '2964611018', 1003, 2),
(1019, 'Herrera', 'Daniel', '2964611019', 1007, 4),
(1020, 'Castro', 'Luc??a', '2964611020', 1009, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico_disponibilidad`
--

CREATE TABLE `medico_disponibilidad` (
  `matricula_medico` int(11) NOT NULL,
  `id_disponibilidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medico_disponibilidad`
--

INSERT INTO `medico_disponibilidad` (`matricula_medico`, `id_disponibilidad`) VALUES
(1001, 1),
(1001, 3),
(1001, 5),
(1001, 9),
(1002, 2),
(1002, 4),
(1002, 6),
(1002, 10),
(1003, 1),
(1003, 5),
(1003, 7),
(1003, 9),
(1004, 2),
(1004, 6),
(1004, 8),
(1004, 10),
(1005, 1),
(1005, 3),
(1005, 7),
(1005, 9),
(1006, 2),
(1006, 4),
(1006, 8),
(1006, 10),
(1007, 1),
(1007, 5),
(1007, 9),
(1007, 11),
(1008, 2),
(1008, 6),
(1008, 10),
(1008, 21),
(1009, 1),
(1009, 3),
(1009, 7),
(1009, 9),
(1010, 2),
(1010, 4),
(1010, 8),
(1010, 10),
(1011, 1),
(1011, 5),
(1011, 7),
(1011, 9),
(1012, 2),
(1012, 6),
(1012, 8),
(1012, 10),
(1013, 1),
(1013, 3),
(1013, 5),
(1013, 9),
(1014, 2),
(1014, 4),
(1014, 6),
(1014, 10),
(1015, 1),
(1015, 5),
(1015, 7),
(1015, 9),
(1016, 2),
(1016, 6),
(1016, 8),
(1016, 10),
(1017, 1),
(1017, 3),
(1017, 9),
(1018, 2),
(1018, 4),
(1018, 10),
(1019, 5),
(1019, 7),
(1019, 9),
(1020, 2),
(1020, 6),
(1020, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `obrasocial`
--

CREATE TABLE `obrasocial` (
  `id_os` int(11) NOT NULL,
  `nombre_os` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `obra_social`
--

CREATE TABLE `obra_social` (
  `id_os` int(11) NOT NULL,
  `nombre_os` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `obra_social`
--

INSERT INTO `obra_social` (`id_os`, `nombre_os`) VALUES
(1, 'OSDE'),
(2, 'Swiss Medical'),
(3, 'Medife'),
(4, 'Galeno'),
(5, 'PAMI'),
(6, 'IOMA'),
(7, 'OSECAC'),
(8, 'Particular');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `os_practica`
--

CREATE TABLE `os_practica` (
  `id_os` int(11) NOT NULL,
  `id_practica` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `os_practica`
--

INSERT INTO `os_practica` (`id_os`, `id_practica`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 12),
(1, 14),
(1, 15),
(1, 18),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 5),
(2, 7),
(2, 8),
(2, 9),
(2, 11),
(2, 12),
(2, 13),
(2, 14),
(2, 15),
(2, 18),
(3, 1),
(3, 2),
(3, 5),
(3, 6),
(3, 8),
(3, 9),
(3, 10),
(3, 12),
(3, 14),
(3, 18),
(4, 1),
(4, 3),
(4, 4),
(4, 5),
(4, 6),
(4, 7),
(4, 8),
(4, 10),
(4, 12),
(4, 14),
(5, 1),
(5, 2),
(5, 3),
(5, 6),
(5, 7),
(5, 10),
(5, 12),
(5, 14),
(6, 1),
(6, 2),
(6, 5),
(6, 6),
(6, 8),
(6, 10),
(6, 12),
(6, 14),
(6, 15),
(7, 1),
(7, 2),
(7, 3),
(7, 5),
(7, 6),
(7, 8),
(7, 9),
(7, 10),
(7, 12),
(8, 1),
(8, 2),
(8, 3),
(8, 4),
(8, 5),
(8, 6),
(8, 7),
(8, 8),
(8, 9),
(8, 10),
(8, 11),
(8, 12),
(8, 13),
(8, 14),
(8, 15),
(8, 16),
(8, 17),
(8, 18),
(8, 19),
(8, 20);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente`
--

CREATE TABLE `paciente` (
  `dni_paciente` int(11) NOT NULL,
  `nombre_paciente` varchar(50) NOT NULL,
  `apellido_paciente` varchar(50) NOT NULL,
  `fec_nac_paciente` date NOT NULL,
  `email_paciente` varchar(50) DEFAULT NULL,
  `nro_afiliado_paciente` int(11) DEFAULT NULL,
  `id_os` int(11) DEFAULT NULL,
  `tel_paciente` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `paciente`
--

INSERT INTO `paciente` (`dni_paciente`, `nombre_paciente`, `apellido_paciente`, `fec_nac_paciente`, `email_paciente`, `nro_afiliado_paciente`, `id_os`, `tel_paciente`) VALUES
(11222333, 'Denis', 'Mansilla', '2008-07-10', 'w@gmail.com', NULL, NULL, NULL),
(30100101, 'Juan', 'P??rez', '1985-03-12', 'juan.perez@gmail.com', 583, 1, '2964610001'),
(30100202, 'Ana', 'G??mez', '1990-07-22', 'ana.gomez@gmail.com', 1247, 2, '2964610002'),
(30100303, 'Mar??a', 'Rodr??guez', '1978-11-05', 'maria.rodriguez@gmail.com', 836, 3, '2964610003'),
(30100404, 'Lucas', 'Fern??ndez', '2001-02-18', 'lucas.fernandez@gmail.com', 4215, 4, '2964610004'),
(30100505, 'Carlos', 'L??pez', '1965-09-30', 'carlos.lopez@gmail.com', 762, 5, '2964610005'),
(30100606, 'Sof??a', 'Mart??nez', '1995-04-15', 'sofia.martinez@gmail.com', 3189, 1, '2964610006'),
(30100707, 'Pedro', 'Gonz??lez', '1982-12-01', 'pedro.gonzalez@gmail.com', 945, 6, '2964610007'),
(30100808, 'Laura', 'S??nchez', '1972-06-17', 'laura.sanchez@gmail.com', 2754, 7, '2964610008'),
(30100909, 'Diego', 'Romero', '1988-08-21', 'diego.romero@gmail.com', 614, 2, '2964610009'),
(30101010, 'Camila', 'Torres', '2003-01-09', 'camila.torres@gmail.com', 3902, 8, '2964610010'),
(30101111, 'Marcelo', '??lvarez', '1975-05-11', 'marcelo.alvarez@gmail.com', 751, 3, '2964610011'),
(30101212, 'Valentina', 'Ruiz', '1992-10-24', 'valentina.ruiz@gmail.com', 1846, 4, '2964610012'),
(30101313, 'Mart??n', 'Ram??rez', '1980-02-28', 'martin.ramirez@gmail.com', 529, 5, '2964610013'),
(30101414, 'Julieta', 'Flores', '1998-06-03', 'julieta.flores@gmail.com', 2471, 1, '2964610014'),
(30101515, 'Ricardo', 'Ben??tez', '1969-12-14', 'ricardo.benitez@gmail.com', 683, 6, '2964610015'),
(30101616, 'Paula', 'Acosta', '1987-03-27', 'paula.acosta@gmail.com', 4158, 7, '2964610016'),
(30101717, 'Nicol??s', 'Medina', '1991-09-19', 'nicolas.medina@gmail.com', 927, 2, '2964610017'),
(30101818, 'Gabriela', 'Su??rez', '1977-01-31', 'gabriela.suarez@gmail.com', 3064, 3, '2964610018'),
(30101919, 'Alejandro', 'Herrera', '1984-07-07', 'alejandro.herrera@gmail.com', 572, 4, '2964610019'),
(30102020, 'Florencia', 'Castro', '2000-11-23', 'florencia.castro@gmail.com', 2183, 8, '2964610020'),
(30102121, 'Roberto', 'Ortiz', '1970-04-08', 'roberto.ortiz@gmail.com', 849, 5, '2964610021'),
(30102222, 'Carolina', 'Silva', '1996-08-16', 'carolina.silva@gmail.com', 3617, 1, '2964610022'),
(30102323, 'Sebasti??n', 'Molina', '1989-05-29', 'sebastian.molina@gmail.com', 694, 2, '2964610023'),
(30102424, 'Patricia', 'Vega', '1974-10-12', 'patricia.vega@gmail.com', 4728, 6, '2964610024'),
(30102525, 'Facundo', 'Rojas', '1993-02-06', 'facundo.rojas@gmail.com', 815, 7, '2964610025'),
(30102626, 'Ver??nica', 'Navarro', '1981-06-25', 'veronica.navarro@gmail.com', 2536, 3, '2964610026'),
(30102727, 'Jorge', 'Dom??nguez', '1967-09-03', 'jorge.dominguez@gmail.com', 731, 5, '2964610027'),
(30102828, 'Agustina', 'Cabrera', '1999-12-20', 'agustina.cabrera@gmail.com', 1694, 4, '2964610028'),
(30102929, 'Daniel', 'Vargas', '1986-01-15', 'daniel.vargas@gmail.com', 458, 1, '2964610029'),
(30103030, 'Silvia', 'M??ndez', '1979-07-31', 'silvia.mendez@gmail.com', 3821, 2, '2964610030'),
(30103131, 'Tom??s', 'Ponce', '1994-03-10', 'tomas.ponce@gmail.com', 967, 3, '2964610031'),
(30103232, 'M??nica', 'Quiroga', '1973-11-18', 'monica.quiroga@gmail.com', 2145, 4, '2964610032'),
(30103333, 'Mateo', 'Peralta', '2002-05-22', 'mateo.peralta@gmail.com', 638, 8, '2964610033'),
(30103434, 'Natalia', 'Correa', '1983-08-04', 'natalia.correa@gmail.com', 3472, 6, '2964610034'),
(30103535, 'Agust??n', 'Sosa', '1997-10-27', 'agustin.sosa@gmail.com', 726, 7, '2964610035'),
(30103636, 'Norma', 'Mansilla', '1964-02-13', 'norma.mansilla@gmail.com', 1958, 5, '2964610036'),
(30103737, 'Leandro', 'Godoy', '1985-12-05', 'leandro.godoy@gmail.com', 864, 1, '2964610037'),
(30103838, 'Romina', 'Luna', '1990-04-19', 'romina.luna@gmail.com', 4231, 2, '2964610038'),
(30103939, 'Eduardo', 'C??ceres', '1976-06-30', 'eduardo.caceres@gmail.com', 619, 3, '2964610039'),
(30104040, 'Martina', 'Vera', '2001-09-11', 'martina.vera@gmail.com', 2758, 8, '2964610040'),
(30104141, 'Esteban', 'Paz', '1988-11-02', 'esteban.paz@gmail.com', 943, 4, '2964610041'),
(30104242, 'Claudia', 'Arias', '1971-03-24', 'claudia.arias@gmail.com', 3164, 6, '2964610042'),
(30104343, 'Ignacio', 'Ferreyra', '1995-07-13', 'ignacio.ferreyra@gmail.com', 782, 7, '2964610043'),
(30104444, 'Mariana', 'Maidana', '1982-10-06', 'mariana.maidana@gmail.com', 2497, 1, '2964610044'),
(30104545, 'Oscar', 'Cardozo', '1968-01-28', 'oscar.cardozo@gmail.com', 531, 5, '2964610045'),
(30104646, 'Luciana', 'Ojeda', '1999-05-17', 'luciana.ojeda@gmail.com', 4076, 2, '2964610046'),
(30104747, 'Cristian', 'Almir??n', '1987-08-09', 'cristian.almiron@gmail.com', 895, 3, '2964610047'),
(30104848, 'Beatriz', 'Valdez', '1975-12-21', 'beatriz.valdez@gmail.com', 1628, 4, '2964610048'),
(30104949, 'Maximiliano', 'Figueroa', '1992-02-14', 'maximiliano.figueroa@gmail.com', 743, 8, '2964610049'),
(30105050, 'Lorena', 'Leiva', '1980-06-08', 'lorena.leiva@gmail.com', 3549, 6, '2964610050');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `practica`
--

CREATE TABLE `practica` (
  `id_practica` int(11) NOT NULL,
  `nombre_practica` varchar(100) NOT NULL,
  `id_servicio` int(11) NOT NULL,
  `duracion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `practica`
--

INSERT INTO `practica` (`id_practica`, `nombre_practica`, `id_servicio`, `duracion`) VALUES
(1, 'Consulta cl??nica', 1, 30),
(2, 'Control general', 1, 30),
(3, 'Electrocardiograma', 2, 20),
(4, 'Ecocardiograma', 2, 45),
(5, 'Control pedi??trico', 3, 30),
(6, 'Consulta traumatol??gica', 4, 30),
(7, 'Radiograf??a', 4, 15),
(8, 'Control ginecol??gico', 5, 30),
(9, 'Papanicolau', 5, 20),
(10, 'Consulta dermatol??gica', 6, 30),
(11, 'Dermatoscop??a', 6, 30),
(12, 'Control oftalmol??gico', 7, 30),
(13, 'Fondo de ojo', 7, 30),
(14, 'Ecograf??a abdominal', 8, 30),
(15, 'Ecograf??a obst??trica', 8, 30),
(16, 'Tomograf??a computada', 8, 45),
(17, 'Resonancia magn??tica', 8, 60),
(18, 'Consulta cardiol??gica', 2, 30),
(19, 'Control de ni??o sano', 3, 30),
(20, 'Ecograf??a musculoesquel??tica', 4, 30);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `practica_equipo`
--

CREATE TABLE `practica_equipo` (
  `id_practica` int(11) NOT NULL,
  `id_equipo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `practica_equipo`
--

INSERT INTO `practica_equipo` (`id_practica`, `id_equipo`) VALUES
(1, 15),
(2, 15),
(3, 1),
(3, 2),
(4, 3),
(4, 4),
(5, 15),
(6, 14),
(7, 6),
(8, 3),
(9, 3),
(10, 9),
(10, 10),
(11, 9),
(12, 12),
(13, 13),
(14, 3),
(14, 4),
(15, 5),
(16, 7),
(17, 8),
(18, 1),
(18, 2),
(19, 15),
(20, 3),
(20, 11);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `practica_medico`
--

CREATE TABLE `practica_medico` (
  `matricula_medico` int(11) NOT NULL,
  `id_practica` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `practica_medico`
--

INSERT INTO `practica_medico` (`matricula_medico`, `id_practica`) VALUES
(1001, 1),
(1001, 2),
(1002, 1),
(1002, 2),
(1003, 3),
(1003, 4),
(1003, 18),
(1004, 3),
(1004, 4),
(1004, 18),
(1005, 5),
(1005, 19),
(1006, 5),
(1006, 19),
(1007, 6),
(1007, 7),
(1007, 20),
(1008, 6),
(1008, 7),
(1008, 20),
(1009, 8),
(1009, 9),
(1010, 8),
(1010, 9),
(1011, 10),
(1011, 11),
(1012, 10),
(1012, 11),
(1013, 12),
(1013, 13),
(1014, 12),
(1014, 13),
(1015, 14),
(1015, 15),
(1015, 16),
(1015, 17),
(1016, 14),
(1016, 15),
(1016, 16),
(1016, 17),
(1017, 1),
(1017, 2),
(1018, 3),
(1018, 18),
(1019, 6),
(1019, 7),
(1020, 8),
(1020, 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registra`
--

CREATE TABLE `registra` (
  `matricula_medico` int(11) NOT NULL,
  `id_turno` int(11) NOT NULL,
  `id_disponibilidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registra`
--

INSERT INTO `registra` (`matricula_medico`, `id_turno`, `id_disponibilidad`) VALUES
(1001, 1, 1),
(1001, 2, 1),
(1001, 22, 1),
(1003, 4, 4),
(1003, 23, 1),
(1005, 6, 3),
(1005, 7, 3),
(1007, 9, 9),
(1009, 11, 1),
(1009, 12, 1),
(1009, 25, 4),
(1011, 14, 4),
(1013, 16, 5),
(1013, 17, 5),
(1013, 27, 5),
(1015, 18, 8),
(1015, 19, 8),
(1015, 21, 9),
(1015, 28, 8),
(1015, 30, 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL,
  `nombre_rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id_rol`, `nombre_rol`) VALUES
(1, 'ADMIN'),
(2, 'MEDICO'),
(3, 'PACIENTE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio`
--

CREATE TABLE `servicio` (
  `id_servicio` int(11) NOT NULL,
  `nombre_servicio` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicio`
--

INSERT INTO `servicio` (`id_servicio`, `nombre_servicio`) VALUES
(1, 'Cl??nica M??dica'),
(2, 'Cardiolog??a'),
(3, 'Pediatr??a'),
(4, 'Traumatolog??a'),
(5, 'Ginecolog??a'),
(6, 'Dermatolog??a'),
(7, 'Oftalmolog??a'),
(8, 'Diagn??stico por Im??genes');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `token_cuenta`
--

CREATE TABLE `token_cuenta` (
  `id_token` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `token_hash` char(64) NOT NULL,
  `tipo` enum('VERIFICACION_EMAIL','RECUPERACION_PASSWORD') NOT NULL,
  `fecha_expiracion` datetime NOT NULL,
  `usado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `token_cuenta`
--

INSERT INTO `token_cuenta` (`id_token`, `id_usuario`, `token_hash`, `tipo`, `fecha_expiracion`, `usado`, `fecha_creacion`) VALUES
(2, 5, 'b7e6996b6c58a790ee1f4ee93a2a5da5bfa9430135af0b89f504aa2761631dca', 'VERIFICACION_EMAIL', '2026-11-13 13:30:39', 0, '2026-11-13 13:00:39'),
(3, 6, '5d60d35f0f128f873d4e82eba3800586003f04173af2740fb9f6d04a161d6646', 'VERIFICACION_EMAIL', '2026-11-13 13:38:18', 1, '2026-11-13 13:08:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turno`
--

CREATE TABLE `turno` (
  `id_turno` int(11) NOT NULL,
  `fecha_turno` date NOT NULL,
  `hora_turno` time NOT NULL,
  `medio_solicitado` varchar(50) DEFAULT NULL,
  `estado_turno` varchar(30) DEFAULT NULL,
  `fecha_confirmacion` datetime DEFAULT NULL,
  `medico_confirmacion` int(11) DEFAULT NULL,
  `dni_paciente` int(11) NOT NULL,
  `id_practica` int(11) NOT NULL,
  `id_equipo` int(11) DEFAULT NULL,
  `id_disponibilidad` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `turno`
--

INSERT INTO `turno` (`id_turno`, `fecha_turno`, `hora_turno`, `medio_solicitado`, `estado_turno`, `fecha_confirmacion`, `medico_confirmacion`, `dni_paciente`, `id_practica`, `id_equipo`, `id_disponibilidad`) VALUES
(1, '2026-09-01', '08:00:00', 'Web', 'Confirmado', '2026-08-28 10:15:00', 1001, 30100101, 1, 15, 1),
(2, '2026-09-01', '09:00:00', 'Tel??fono', 'Confirmado', '2026-08-29 11:20:00', 1001, 30100202, 2, 15, 1),
(3, '2026-09-01', '10:00:00', 'Web', 'Reservado', NULL, NULL, 30100303, 3, 1, 1),
(4, '2026-09-02', '14:00:00', 'WhatsApp', 'Confirmado', '2026-08-30 09:00:00', 1003, 30100404, 4, 3, 4),
(5, '2026-09-02', '15:00:00', 'Web', 'Cancelado', NULL, NULL, 30100505, 18, 1, 4),
(6, '2026-09-03', '08:30:00', 'Tel??fono', 'Confirmado', '2026-09-01 12:00:00', 1005, 30100606, 5, 15, 3),
(7, '2026-09-03', '09:30:00', 'Web', 'Confirmado', '2026-09-01 13:00:00', 1005, 30100707, 19, 15, 3),
(8, '2026-09-03', '14:00:00', 'Web', 'Reservado', NULL, NULL, 30100808, 6, 14, 6),
(9, '2026-09-04', '10:00:00', 'Tel??fono', 'Confirmado', '2026-09-02 15:00:00', 1007, 30100909, 7, 6, 9),
(10, '2026-09-04', '11:00:00', 'Web', 'Cancelado', NULL, NULL, 30101010, 20, 3, 9),
(11, '2026-09-07', '08:00:00', 'Web', 'Confirmado', '2026-09-04 10:00:00', 1009, 30101111, 8, 3, 1),
(12, '2026-09-07', '09:00:00', 'Tel??fono', 'Confirmado', '2026-09-04 11:00:00', 1009, 30101212, 9, 3, 1),
(13, '2026-09-07', '10:00:00', 'Web', 'Cancelado', NULL, NULL, 30101313, 8, 3, 1),
(14, '2026-09-08', '14:00:00', 'Web', 'Confirmado', '2026-09-05 09:30:00', 1011, 30101414, 10, 9, 4),
(15, '2026-09-08', '15:00:00', 'Tel??fono', 'Reservado', NULL, NULL, 30101515, 11, 9, 4),
(16, '2026-09-09', '08:00:00', 'Web', 'Confirmado', '2026-09-06 10:00:00', 1013, 30101616, 12, 12, 5),
(17, '2026-09-09', '09:00:00', 'Web', 'Confirmado', '2026-09-06 11:00:00', 1013, 30101717, 13, 13, 5),
(18, '2026-09-10', '14:00:00', 'Tel??fono', 'Confirmado', '2026-09-07 12:00:00', 1015, 30101818, 14, 3, 8),
(19, '2026-09-10', '15:00:00', 'Web', 'Confirmado', '2026-09-07 13:00:00', 1015, 30101919, 15, 5, 8),
(20, '2026-09-11', '08:00:00', 'Web', 'Reservado', NULL, NULL, 30102020, 16, 7, 9),
(21, '2026-09-11', '09:00:00', 'Tel??fono', 'Confirmado', '2026-09-08 14:00:00', 1015, 30102121, 17, 8, 9),
(22, '2026-09-14', '08:00:00', 'Web', 'Confirmado', '2026-09-11 10:00:00', 1001, 30102222, 1, 15, 1),
(23, '2026-09-14', '09:00:00', 'Web', 'Confirmado', '2026-09-11 11:00:00', 1003, 30102323, 3, 1, 1),
(24, '2026-09-15', '14:00:00', 'WhatsApp', 'Cancelado', NULL, NULL, 30102424, 6, 14, 4),
(25, '2026-09-15', '15:00:00', 'Web', 'Confirmado', '2026-09-12 09:00:00', 1009, 30102525, 8, 3, 4),
(26, '2026-09-16', '08:00:00', 'Tel??fono', 'Reservado', NULL, NULL, 30102626, 10, 9, 5),
(27, '2026-09-16', '09:00:00', 'Web', 'Confirmado', '2026-09-13 10:00:00', 1013, 30102727, 12, 12, 5),
(28, '2026-09-17', '14:00:00', 'Web', 'Confirmado', '2026-09-14 12:00:00', 1015, 30102828, 14, 3, 8),
(29, '2026-09-18', '08:00:00', 'Tel??fono', 'Cancelado', NULL, NULL, 30102929, 16, 7, 9),
(30, '2026-09-18', '09:00:00', 'Web', 'Confirmado', '2026-09-15 13:00:00', 1015, 30103030, 17, 8, 9),
(31, '2026-11-20', '10:00:00', 'telefono', 'Reservado', NULL, NULL, 30102929, 1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `dni_paciente` int(11) DEFAULT NULL,
  `matricula_medico` int(11) DEFAULT NULL,
  `email_verificado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `email`, `password_hash`, `id_rol`, `activo`, `dni_paciente`, `matricula_medico`, `email_verificado`) VALUES
(1, 'admin@turnos.com', '$2b$10$LR4b0bt5EZXT505FMrpd0OSrq64y58d24l2856t.mYrqmt2/qWXSK', 1, 1, NULL, NULL, 1),
(2, 'medico@turnos.com', '$2b$10$ehhFLFth4tPAl8fW4Z/xqubqtn4JNHFUwYLHHaAO1FK9Z/1bEGZdW', 2, 1, NULL, NULL, 0),
(3, 'inactivo@turnos.com', '$2b$10$EtUEn0.y5d8RtEbO7RPVduxI9oPe46b8pmuQhTZkEpX3eYzTTYOm2', 1, 0, NULL, NULL, 0),
(5, 'giandenismansilla@gmail.com', '$2b$10$Gmf9uRbB/UCoM97gZX.op.afv6twa3cPJGWm2qAOHjBjg59NHf7P.', 3, 1, 11222333, NULL, 0),
(6, 'w@gmail.com', '$2b$10$cbu38feHfTAJQBuX.Fahje5mvKww2l/Sxq03XMOUKXcfCxy14aImW', 3, 1, 11222333, NULL, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `disponibilidad`
--
ALTER TABLE `disponibilidad`
  ADD PRIMARY KEY (`id_disponibilidad`);

--
-- Indices de la tabla `equipo`
--
ALTER TABLE `equipo`
  ADD PRIMARY KEY (`id_equipo`),
  ADD KEY `fk_equipo_servicio` (`id_servicio`);

--
-- Indices de la tabla `medico`
--
ALTER TABLE `medico`
  ADD PRIMARY KEY (`matricula_medico`),
  ADD KEY `fk_medico_supervisor` (`matricula_supervisor`),
  ADD KEY `fk_medico_servicio` (`id_servicio`);

--
-- Indices de la tabla `medico_disponibilidad`
--
ALTER TABLE `medico_disponibilidad`
  ADD PRIMARY KEY (`matricula_medico`,`id_disponibilidad`),
  ADD KEY `fk_md_disponibilidad` (`id_disponibilidad`);

--
-- Indices de la tabla `obrasocial`
--
ALTER TABLE `obrasocial`
  ADD PRIMARY KEY (`id_os`),
  ADD UNIQUE KEY `nombre_os` (`nombre_os`);

--
-- Indices de la tabla `obra_social`
--
ALTER TABLE `obra_social`
  ADD PRIMARY KEY (`id_os`);

--
-- Indices de la tabla `os_practica`
--
ALTER TABLE `os_practica`
  ADD PRIMARY KEY (`id_os`,`id_practica`),
  ADD KEY `fk_op_practica` (`id_practica`);

--
-- Indices de la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`dni_paciente`),
  ADD UNIQUE KEY `email_paciente` (`email_paciente`),
  ADD UNIQUE KEY `nro_afiliado_paciente` (`nro_afiliado_paciente`);

--
-- Indices de la tabla `practica`
--
ALTER TABLE `practica`
  ADD PRIMARY KEY (`id_practica`),
  ADD KEY `fk_practica_servicio` (`id_servicio`);

--
-- Indices de la tabla `practica_equipo`
--
ALTER TABLE `practica_equipo`
  ADD PRIMARY KEY (`id_practica`,`id_equipo`),
  ADD KEY `fk_pe_equipo` (`id_equipo`);

--
-- Indices de la tabla `practica_medico`
--
ALTER TABLE `practica_medico`
  ADD PRIMARY KEY (`matricula_medico`,`id_practica`),
  ADD KEY `fk_pm_practica` (`id_practica`);

--
-- Indices de la tabla `registra`
--
ALTER TABLE `registra`
  ADD PRIMARY KEY (`matricula_medico`,`id_turno`,`id_disponibilidad`),
  ADD KEY `id_turno` (`id_turno`),
  ADD KEY `id_disponibilidad` (`id_disponibilidad`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD PRIMARY KEY (`id_servicio`);

--
-- Indices de la tabla `token_cuenta`
--
ALTER TABLE `token_cuenta`
  ADD PRIMARY KEY (`id_token`),
  ADD UNIQUE KEY `token_hash` (`token_hash`),
  ADD KEY `fk_token_usuario` (`id_usuario`);

--
-- Indices de la tabla `turno`
--
ALTER TABLE `turno`
  ADD PRIMARY KEY (`id_turno`),
  ADD KEY `fk_turno_paciente` (`dni_paciente`),
  ADD KEY `fk_turno_practica` (`id_practica`),
  ADD KEY `fk_turno_equipo` (`id_equipo`),
  ADD KEY `fk_turno_disponibilidad` (`id_disponibilidad`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `disponibilidad`
--
ALTER TABLE `disponibilidad`
  MODIFY `id_disponibilidad` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `equipo`
--
ALTER TABLE `equipo`
  MODIFY `id_equipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `obra_social`
--
ALTER TABLE `obra_social`
  MODIFY `id_os` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `practica`
--
ALTER TABLE `practica`
  MODIFY `id_practica` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `id_servicio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `token_cuenta`
--
ALTER TABLE `token_cuenta`
  MODIFY `id_token` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `turno`
--
ALTER TABLE `turno`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `equipo`
--
ALTER TABLE `equipo`
  ADD CONSTRAINT `fk_equipo_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicio` (`id_servicio`);

--
-- Filtros para la tabla `medico`
--
ALTER TABLE `medico`
  ADD CONSTRAINT `fk_medico_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicio` (`id_servicio`),
  ADD CONSTRAINT `fk_medico_supervisor` FOREIGN KEY (`matricula_supervisor`) REFERENCES `medico` (`matricula_medico`);

--
-- Filtros para la tabla `medico_disponibilidad`
--
ALTER TABLE `medico_disponibilidad`
  ADD CONSTRAINT `fk_md_disponibilidad` FOREIGN KEY (`id_disponibilidad`) REFERENCES `disponibilidad` (`id_disponibilidad`),
  ADD CONSTRAINT `fk_md_medico` FOREIGN KEY (`matricula_medico`) REFERENCES `medico` (`matricula_medico`);

--
-- Filtros para la tabla `os_practica`
--
ALTER TABLE `os_practica`
  ADD CONSTRAINT `fk_op_obra_social` FOREIGN KEY (`id_os`) REFERENCES `obra_social` (`id_os`),
  ADD CONSTRAINT `fk_op_practica` FOREIGN KEY (`id_practica`) REFERENCES `practica` (`id_practica`);

--
-- Filtros para la tabla `practica`
--
ALTER TABLE `practica`
  ADD CONSTRAINT `fk_practica_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicio` (`id_servicio`);

--
-- Filtros para la tabla `practica_equipo`
--
ALTER TABLE `practica_equipo`
  ADD CONSTRAINT `fk_pe_equipo` FOREIGN KEY (`id_equipo`) REFERENCES `equipo` (`id_equipo`),
  ADD CONSTRAINT `fk_pe_practica` FOREIGN KEY (`id_practica`) REFERENCES `practica` (`id_practica`);

--
-- Filtros para la tabla `practica_medico`
--
ALTER TABLE `practica_medico`
  ADD CONSTRAINT `fk_pm_medico` FOREIGN KEY (`matricula_medico`) REFERENCES `medico` (`matricula_medico`),
  ADD CONSTRAINT `fk_pm_practica` FOREIGN KEY (`id_practica`) REFERENCES `practica` (`id_practica`);

--
-- Filtros para la tabla `registra`
--
ALTER TABLE `registra`
  ADD CONSTRAINT `registra_ibfk_1` FOREIGN KEY (`matricula_medico`) REFERENCES `medico` (`matricula_medico`),
  ADD CONSTRAINT `registra_ibfk_2` FOREIGN KEY (`id_turno`) REFERENCES `turno` (`id_turno`),
  ADD CONSTRAINT `registra_ibfk_3` FOREIGN KEY (`id_disponibilidad`) REFERENCES `disponibilidad` (`id_disponibilidad`);

--
-- Filtros para la tabla `token_cuenta`
--
ALTER TABLE `token_cuenta`
  ADD CONSTRAINT `fk_token_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `turno`
--
ALTER TABLE `turno`
  ADD CONSTRAINT `fk_turno_disponibilidad` FOREIGN KEY (`id_disponibilidad`) REFERENCES `disponibilidad` (`id_disponibilidad`),
  ADD CONSTRAINT `fk_turno_equipo` FOREIGN KEY (`id_equipo`) REFERENCES `equipo` (`id_equipo`),
  ADD CONSTRAINT `fk_turno_paciente` FOREIGN KEY (`dni_paciente`) REFERENCES `paciente` (`dni_paciente`),
  ADD CONSTRAINT `fk_turno_practica` FOREIGN KEY (`id_practica`) REFERENCES `practica` (`id_practica`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
