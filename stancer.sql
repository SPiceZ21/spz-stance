CREATE TABLE IF NOT EXISTS `spz_stance` (
  `plate` varchar(64) NOT NULL DEFAULT '',
  `setting` longtext NULL,
  PRIMARY KEY (`plate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;