-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: restaurant
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idadmin_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'admin','123');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_id_UNIQUE` (`category_id`),
  UNIQUE KEY `category_name_UNIQUE` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (2,'หมู'),(1,'เนื้อ');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_history`
--

DROP TABLE IF EXISTS `customer_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_history` (
  `id_customer_history` int NOT NULL AUTO_INCREMENT,
  `customer_count` int NOT NULL,
  `customer_date` varchar(45) NOT NULL,
  `table_number` varchar(45) NOT NULL,
  PRIMARY KEY (`id_customer_history`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_history`
--

LOCK TABLES `customer_history` WRITE;
/*!40000 ALTER TABLE `customer_history` DISABLE KEYS */;
INSERT INTO `customer_history` VALUES (3,1,'2024-07-21 20:33:28','1'),(4,3,'2024-07-21 20:33:38','2'),(5,4,'2024-08-21 20:34:52','1'),(6,5,'2024-08-21 20:36:04','1'),(7,1,'2024-08-22 18:52:37','2'),(8,2,'2024-08-22 19:48:53','2'),(9,1,'2024-08-22 19:50:29','3'),(10,1,'2024-08-22 20:29:06','A1'),(11,1,'2024-08-22 20:59:33','2'),(12,1,'2024-08-22 21:02:02','A1'),(13,2,'2024-08-22 21:02:03','A2'),(14,1,'2024-08-22 21:18:48','A1'),(15,3,'2024-08-27 19:10:49','A2'),(16,1,'2024-08-27 19:24:37','B1'),(17,1,'2024-08-27 19:30:10','B1'),(18,3,'2024-08-27 19:33:54','B1'),(19,3,'2024-08-27 19:47:23','A1'),(20,1,'2024-08-27 19:57:58','A1'),(21,4,'2024-08-27 20:31:40','A2'),(22,1,'2024-08-31 15:15:56','A1'),(23,1,'2024-08-31 22:55:57','A1'),(24,1,'2024-08-31 23:42:31','A2'),(25,2,'2024-09-01 00:10:46','A2'),(26,4,'2024-09-04 20:22:01','A1'),(27,1,'2024-09-04 20:22:16','A2'),(28,3,'2024-10-01 20:18:39','A2'),(29,1,'2024-10-01 20:56:17','A2'),(30,1,'2024-10-01 21:13:08','A1'),(31,123,'2024-10-01 21:38:40','A1'),(32,1,'2024-10-01 21:40:16','B1'),(33,1,'2024-10-01 21:40:51','A1'),(34,1,'2024-10-29 16:16:39','B1'),(35,2,'2024-10-29 19:41:25','B1');
/*!40000 ALTER TABLE `customer_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_order`
--

DROP TABLE IF EXISTS `customer_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_order` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `orders` text,
  `order_date` datetime DEFAULT NULL,
  `order_table` varchar(255) DEFAULT NULL,
  `order_status` varchar(45) DEFAULT NULL COMMENT '2 = waiting 1=success ,   -1=cancel',
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `idorder_UNIQUE` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_order`
--

LOCK TABLES `customer_order` WRITE;
/*!40000 ALTER TABLE `customer_order` DISABLE KEYS */;
INSERT INTO `customer_order` VALUES (103,'ฮิเรนิกุ : 2,คินนิกุ : 1,ตับหมู : 1','2024-08-21 20:34:00','1','-1'),(104,'ตับหมู : 2','2024-08-21 20:34:03','1','-1'),(105,'ตับหมู : 2,คินนิกุ : 1,ฮิเรนิกุ : 2','2024-08-21 20:34:08','1','-1'),(106,'ฮิเรนิกุ : 2','2024-08-21 20:34:23','2','1'),(107,'คินนิกุ : 5','2024-07-21 20:34:26','2','1'),(108,'ตับหมู : 1,คินนิกุ : 1,ฮิเรนิกุ : 1','2024-07-21 20:34:31','2','1'),(109,'ฮิเรนิกุ : 4,คินนิกุ : 4,ตับหมู : 2','2024-08-21 20:35:03','1','1'),(110,'ตับหมู : 1,คินนิกุ : 1,ฮิเรนิกุ : 2','2024-08-21 20:35:08','1','1'),(111,'คินนิกุ : 2','2024-08-21 20:35:12','1','1'),(112,'ฮิเรนิกุ : 4','2024-08-21 20:36:11','1','1'),(113,'ฮิเรนิกุ : 2,คินนิกุ : 1,ตับหมู : 1','2024-08-21 20:36:16','1','1'),(114,'คินนิกุ : 3,ตับหมู : 4,ฮิเรนิกุ : 1','2024-08-21 20:36:23','1','1'),(115,'คินนิกุ : 12,ตับหมู : 4,ฮิเรนิกุ : 1','2024-08-31 15:16:25','A1','1'),(116,'คินนิกุ : 3,ตับหมู : 4,ฮิเรนิกุ : 4','2024-08-31 15:16:37','A1','1'),(117,'คินนิกุ : 13,ตับหมู : 14,ฮิเรนิกุ : 13','2024-09-01 00:16:59','A2','-1'),(118,'ฮิเรนิกุ : 2,คินนิกุ : 4,ตับหมู : 5','2024-09-04 20:51:52','A1','1'),(119,'ฮิเรนิกุ : 1','2024-09-04 21:08:33','A1','-1'),(120,'ฮิเรนิกุ : 3','2024-10-01 20:19:38','A2','1'),(121,'ฮิเรนิกุ : 3','2024-10-01 20:40:32','A2','1'),(122,'ฮิเรนิกุ : 2','2024-10-29 19:41:33','B1','2'),(123,'ฮิเรนิกุ : 1','2024-10-29 19:52:01','B1','1');
/*!40000 ALTER TABLE `customer_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food`
--

DROP TABLE IF EXISTS `food`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food` (
  `food_id` int NOT NULL AUTO_INCREMENT,
  `food_name` varchar(255) NOT NULL,
  `food_description` varchar(255) NOT NULL,
  `food_image` varchar(255) NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`food_id`),
  UNIQUE KEY `idfood_UNIQUE` (`food_id`),
  UNIQUE KEY `food_name_UNIQUE` (`food_name`),
  UNIQUE KEY `food_image_UNIQUE` (`food_image`),
  KEY `category_id _idx` (`category_id`),
  CONSTRAINT `category_id ` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food`
--

LOCK TABLES `food` WRITE;
/*!40000 ALTER TABLE `food` DISABLE KEYS */;
INSERT INTO `food` VALUES (1,'ฮิเรนิกุ','none','ฮิเรนิกุ Hireniku.png',1),(33,'คินนิกุ','','à¸à¸´à¸à¸à¸´à¸à¸¸ kinnilu-1721127422652-849490906.png',1),(34,'ตับหมู','','à¸à¸±à¸à¸«à¸¡à¸¹ pork_liver-1721127452183-711755382.png',2);
/*!40000 ALTER TABLE `food` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tables`
--

DROP TABLE IF EXISTS `tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tables` (
  `table_number` varchar(255) NOT NULL,
  `start_time` varchar(45) DEFAULT NULL,
  `customer_count` int NOT NULL DEFAULT '0',
  `status` varchar(255) NOT NULL DEFAULT 'available',
  PRIMARY KEY (`table_number`),
  UNIQUE KEY `idcustomer_table_UNIQUE` (`table_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tables`
--

LOCK TABLES `tables` WRITE;
/*!40000 ALTER TABLE `tables` DISABLE KEYS */;
INSERT INTO `tables` VALUES ('1','',0,'available'),('12',NULL,0,'available'),('133',NULL,0,'available'),('1332',NULL,0,'available'),('2','',0,'available'),('3','',0,'available'),('4','',0,'available'),('5','',0,'available'),('6','',0,'available'),('7','',0,'available'),('8','',0,'available'),('9','',0,'available'),('A1','2024-10-01 21:40:51',1,'time\'s up'),('A2','2024-10-01 20:56:17',1,'time\'s up'),('B1','2024-10-29 19:41:25',2,'unavailable'),('B2',NULL,0,'available'),('B3',NULL,0,'available');
/*!40000 ALTER TABLE `tables` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-01  1:06:47
