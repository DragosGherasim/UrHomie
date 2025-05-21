CREATE TABLE user_account (
    id                  BIGINT                                      PRIMARY KEY AUTO_INCREMENT,
    email               VARCHAR(128)                                NOT NULL UNIQUE,
    password            VARCHAR(256)                                NOT NULL,
    role                ENUM('CLIENT', 'SERVICE_PROVIDER')          NOT NULL
);