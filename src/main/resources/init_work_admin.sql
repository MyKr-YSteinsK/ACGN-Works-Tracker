CREATE DATABASE IF NOT EXISTS acgn DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE acgn;

CREATE TABLE IF NOT EXISTS user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS work_admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    score INT NOT NULL,
    period VARCHAR(32) NOT NULL,
    type VARCHAR(16) NOT NULL
);

INSERT INTO work_admin (name, score, period, type)
SELECT '葬送的芙莉莲', 49, '2024秋', 'Anime'
WHERE NOT EXISTS (
    SELECT 1 FROM work_admin WHERE name = '葬送的芙莉莲' AND period = '2024秋' AND type = 'Anime'
);

INSERT INTO work_admin (name, score, period, type)
SELECT '败犬女主太多了', 43, '2024夏', 'Anime'
WHERE NOT EXISTS (
    SELECT 1 FROM work_admin WHERE name = '败犬女主太多了' AND period = '2024夏' AND type = 'Anime'
);

INSERT INTO work_admin (name, score, period, type)
SELECT 'DAVE THE DIVER', 47, '2024春', 'Game'
WHERE NOT EXISTS (
    SELECT 1 FROM work_admin WHERE name = 'DAVE THE DIVER' AND period = '2024春' AND type = 'Game'
);
