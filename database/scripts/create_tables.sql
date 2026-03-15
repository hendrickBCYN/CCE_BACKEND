CREATE DATABASE IF NOT EXISTS cce_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cce_db;

CREATE TABLE users (
  id            INT             NOT NULL AUTO_INCREMENT,
  google_id     VARCHAR(255)    NOT NULL,
  email         VARCHAR(255)    NOT NULL,
  display_name  VARCHAR(255)    NOT NULL,
  avatar_url    VARCHAR(512)    NULL,
  role          ENUM('admin', 'editor', 'viewer') NOT NULL DEFAULT 'viewer',
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uk_users_google_id (google_id),
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE configurations (
  id            INT             NOT NULL AUTO_INCREMENT,
  user_id       INT             NOT NULL,
  name          VARCHAR(255)    NOT NULL,
  unity_data    JSON            NOT NULL,
  is_latest     BOOLEAN         NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_configurations_user_id (user_id),

  CONSTRAINT fk_configurations_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
