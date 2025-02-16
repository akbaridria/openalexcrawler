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
npm install