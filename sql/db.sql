-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Oct 24, 2019 at 10:13 AM
-- Server version: 5.7.27
-- PHP Version: 7.2.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--
CREATE DATABASE IF NOT EXISTS `test` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `test`;

-- --------------------------------------------------------

--
-- Table structure for table `t_data`
--

CREATE TABLE `t_data` (
  `id` int(11) NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `data` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `t_data`
--

INSERT INTO `t_data` (`id`, `title`, `data`) VALUES
(2, 'sunandar', 'sunandarsunandarsunandarsunandarsunandarsunandarsunandarsunandarsunandarsunandarsunandarsunandarsunandarsunandarsunandar'),
(1, 'susu', 'sususususususususususus'),
(4, 'test', 'test test test test test test test'),
(6, 'panci', 'panci'),
(8, 'tototototo', 'tongkangtongkangtongkangtongkangtongkang'),
(8, 'babababa', 'bababtututututukkkkkkssss'),
(12, 'mbeee', 'mbeeembeeembeeembeeembeeembeeembeeembeeembeee'),
(13, 'kongko', 'adasdoasduadsiasdoahsodias'),
(14, 'borbro', 'borbroborbroborbroborbroborbro'),
(16, 'borbro', 'borbroborbroborbroborbroborbro');

-- --------------------------------------------------------

--
-- Table structure for table `t_product`
--

CREATE TABLE `t_product` (
  `id` int(10) NOT NULL,
  `product` varchar(50) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `t_product`
--

INSERT INTO `t_product` (`id`, `product`, `description`) VALUES
(1, 'sabun', 'sabun mandi sabun cusi\r\n'),
(1, 'sampo', 'sampo'),
(2, 'jaso', 'jaso'),
(2, 'jaso', 'jaso'),
(2, 'jaso', 'jaso'),
(6, 'panci', 'panci'),
(9, 'sendal', 'sendal'),
(10, 'selop', 'selop');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
