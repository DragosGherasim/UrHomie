CREATE TABLE user_profile (
    id              BIGINT          PRIMARY KEY,
    email           VARCHAR(125)    NOT NULL UNIQUE,
    first_name      VARCHAR(64)     NOT NULL,
    last_name       VARCHAR(32)     NOT NULL,
    phone_number    VARCHAR(20)     NOT NULL UNIQUE,
    country         VARCHAR(64)     NOT NULL,
    city            VARCHAR(64)     NOT NULL,
    address         VARCHAR(255)    NOT NULL
);

CREATE TABLE client (
    id                  BIGINT      PRIMARY KEY,
    user_profile_id     BIGINT      NOT NULL UNIQUE,
    
    FOREIGN KEY (user_profile_id) REFERENCES user_profile(id) ON DELETE CASCADE
);

CREATE TABLE service_provider (
    id                              BIGINT          PRIMARY KEY,
    user_profile_id                 BIGINT          NOT NULL UNIQUE,
    education                       VARCHAR(255)    NOT NULL,
    certifications                  VARCHAR(255)    NOT NULL,
    experience_descriptions         TEXT            NOT NULL,
    work_schedule                   VARCHAR(64)     NOT NULL,
    coverage_area                   TINYINT         NOT NULL,
    
    FOREIGN KEY (user_profile_id) REFERENCES user_profile(id) ON DELETE CASCADE
);
