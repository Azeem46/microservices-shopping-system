#!/bin/sh

set -e

# Host and port for RabbitMQ
HOST="rabbitmq"
PORT="5672"

# Wait for RabbitMQ to become available
while ! nc -z "$HOST" "$PORT"; do
  echo "Waiting for RabbitMQ..."
  sleep 1
done

echo "RabbitMQ is up - executing command"
exec "$@"
