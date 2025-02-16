# OpenAlex Crawler

A TypeScript-based crawler that fetches and processes academic publications data from the OpenAlex API, specifically focused on graph database related publications.

## Description

This project consists of a distributed crawler system using BullMQ for job queue management and Redis for data coordination. It fetches academic publication data, processes it, and exports it to CSV format. The system is built with TypeScript and uses a worker-based architecture for efficient data processing.

## Prerequisites

- Node.js (v16 or higher)
- Redis server
- PostgreSQL database

## Setup

1. Clone the repository
2. Install dependencies:
```sh
yarn install
```
3. Copy the environment file and configure it:
```sh
cp .env.example .env
```
4. Configure the following environment variables in .env:
   - `DATABASE_URL`: PostgreSQL connection string
   - `REDIS_HOST`: Redis host (default: localhost)
   - `REDIS_PORT`: Redis port (default: 6379)

## Project Structure

```
├── workers/
│   ├── main-worker.ts    # Handles API pagination and job distribution
│   └── scrape-worker.ts  # Processes individual publication data
├── db/
│   └── schema.ts         # Database schema definitions
├── helper/
│   ├── redis.ts         # Redis connection and utilities
│   └── utils.ts         # Common utilities and configurations
├── scripts/
│   └── export-csv.ts    # CSV export functionality
└── main.ts              # Application entry point
```

## Database Setup

Initialize the database schema:
```sh
yarn db:push
```

## Running the Application

### Start All Services
For fresh start when no jobs are in queue:
```sh
yarn start:all
```

### Run Workers Separately
When jobs exist in queue:
```sh
yarn start:worker
```

### Individual Components
- Main worker: `yarn start:main`
- Scrape worker: `yarn start:scrape`
- Main application: `yarn start`

## Data Export

Export collected data to CSV:
```sh
yarn export:csv
```

The exported CSV includes:
- Publication ID
- Title
- Publication Date
- Language
- Published In (Journal/Conference)
- Open Access Status
- URL
- Type
- Authors (comma-separated)

## Troubleshooting

### Common Issues

1. Redis Connection Error
```
Check if Redis server is running:
redis-cli ping
```

2. Database Connection Issues
```
Check PostgreSQL connection:
psql -d your_database_name -c "\conninfo"
```

3. Worker Not Processing
```
Check Redis queue status:
redis-cli
> KEYS *
```
