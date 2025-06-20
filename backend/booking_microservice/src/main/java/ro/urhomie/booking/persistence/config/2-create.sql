CREATE TABLE booking (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id       BIGINT NOT NULL,
    provider_id     BIGINT NOT NULL,
    service_id      VARCHAR(64) NOT NULL,
    scheduled_at    DATETIME NOT NULL,
    finish_at       DATETIME DEFAULT NULL,
    status          ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'FINISHED') NOT NULL,
    extra_details   TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE booking_log (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id      BIGINT NOT NULL,
    changed_by_id   BIGINT,
    old_status      ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'FINISHED'),
    new_status      ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'FINISHED') NOT NULL,
    message         TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE CASCADE
);
