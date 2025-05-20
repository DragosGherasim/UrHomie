import logging
from datetime import datetime
from logging.handlers import TimedRotatingFileHandler
from pathlib import Path

# Setează directorul de loguri în root-ul proiectului, lângă `src/`
PROJECT_ROOT = Path(__file__).resolve().parents[2]  # ajunge la /proiect
LOGS_DIR = PROJECT_ROOT / "logs"
LOGS_DIR.mkdir(exist_ok=True)

# Numele fișierului de log: logYYYYMMDD.txt
today_str = datetime.utcnow().strftime("%Y%m%d")
log_filename = f"log{today_str}.txt"
LOG_FILE = LOGS_DIR / log_filename

def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)

    if not logger.handlers:
        logger.setLevel(logging.INFO)

        formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] %(name)s: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )

        # Consolă (stdout → docker logs)
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

        # Fișier local cu rotire zilnică
        file_handler = TimedRotatingFileHandler(
            LOG_FILE,
            when="midnight",
            interval=1,
            backupCount=7,
            encoding="utf-8",
            utc=True
        )
        file_handler.suffix = "%Y%m%d"
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

    return logger