# Run Kafka
- docker-compose up -d

# Frontend UI
- cd frontend
- node server.js

# Order API
- cd ../order-service
- node index.js

# Kitchen
- cd ../kitchen-service
- node index.js

# Delivery
- cd ../delivery-service
- node index.js

# Status WebSocket
- cd ../status-service
- node index.js
