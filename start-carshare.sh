#!/bin/bash

# Script para auto-iniciar CarShare Frontend
# Este script se ejecutará al arrancar la instancia

# Esperar a que Docker esté disponible
while ! docker info > /dev/null 2>&1; do
    echo "Esperando a que Docker esté disponible..."
    sleep 5
done

# Ir al directorio del proyecto
cd /home/ubuntu/CarShare

# Iniciar el frontend con docker-compose
docker-compose up -d

echo "CarShare Frontend iniciado automáticamente"
