# Etapa de build
FROM ubuntu:22.04 AS builder

ENV DEBIAN_FRONTEND=noninteractive

# Instalează dependențele de sistem + Python 3.11 + build tools
RUN apt-get update && apt-get install --no-install-recommends -y \
    python3.11 python3.11-venv python3.11-dev python3-pip \
    libmariadb-dev-compat pkg-config gcc \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Creează un mediu virtual Python izolat
RUN python3.11 -m venv /opt/venv

# Activează venv-ul
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1

# Setează directorul principal
WORKDIR /app

# Adaugă doar requirements.txt pentru a folosi cache Docker mai eficient
COPY requirements.txt .

# Instalează dependențele
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copiază restul fișierelor aplicației
COPY . .

# Setează PYTHONPATH pentru ca `src/` să fie root valid
ENV PYTHONPATH=/app/src

# Expune portul gRPC
EXPOSE 50051

# Web Socket
EXPOSE 8001

# Comanda de rulare a aplicației (via modul Python)
ENTRYPOINT ["python", "-m", "presentation.main"]

ENV ENVIRONMENT=production