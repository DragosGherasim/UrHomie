CREATE TABLE booking_details (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    city            VARCHAR(100),
    address         VARCHAR(255),
    phone_number    VARCHAR(30),
    scheduled_at    DATETIME NOT NULL,
    extra_details   TEXT DEFAULT NULL
);

CREATE TABLE booking (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id           BIGINT NOT NULL,
    provider_id         BIGINT NOT NULL,
    service_id          VARCHAR(64) NOT NULL,
    booking_details_id  BIGINT NOT NULL,
    status              ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'FINISHED') NOT NULL,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    finish_at           DATETIME DEFAULT NULL,

    FOREIGN KEY (booking_details_id) REFERENCES booking_details(id) ON DELETE CASCADE
);

CREATE TABLE booking_log (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id          BIGINT NOT NULL,
    changed_by_id       BIGINT,
    old_status          ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'FINISHED'),
    new_status          ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'FINISHED') NOT NULL,
    decline_message     TEXT DEFAULT NULL,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE CASCADE
);
