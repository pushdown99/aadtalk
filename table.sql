CREATE DATABASE aadtalk CHARACTER SET utf8 COLLATE utf8_general_ci;
USE aadtalk;


DROP TABLE users;
CREATE TABLE IF NOT EXISTS users (
  id             int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email          varchar(64) NOT NULL UNIQUE, -- 이메일
  passwd         varchar(64) NOT NULL,        -- 패스워드
  username       varchar(64) NOT NULL,        -- 사용자이름
  registered     timestamp DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (email, passwd, username) VALUES ('haeyun@gmail.com', '1234', '관리자');
