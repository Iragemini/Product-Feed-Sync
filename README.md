# Product Feed Sync

A Node.js application that synchronizes product data from a Google Shopping XML feed with a PostgreSQL database and Redis cache. The application is designed to handle large XML feeds efficiently while maintaining data consistency.

## Task Requirements

The application implements a product feed synchronization that:
- Downloads a product feed in Google Shopping XML format from a specified URL
- Parses and stores products in a database with required fields:
  - `id`
  - `title`
  - `link`
  - `image_link`
  - `price`
  - `availability`
- Handles large feeds (50MB+) efficiently with streaming processing
- Maintains data consistency by:
  - Overwriting existing records with the same ID
  - Removing products no longer present in the feed
- Uses Redis for tracking product IDs to enable efficient sync operations

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Redis
- Docker (to run dependencies locally)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Iragemini/Product-Feed-Sync.git
cd Product-Feed-Sync
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`, and configure it with the correct Redis, PostgreSQL, and server port values.

## Configuration

The application uses the following environment variables:

- `PORT` - Server port
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `REDIS_HOST` - Redis host
- `REDIS_PORT` - Redis port

## Running the Application

```bash
npm start
```

### Using Docker

```bash
npm run docker:start
```
This command will:

- Start Redis and PostgreSQL containers using Docker
- Automatically initialize the database, including creating required tables and stored functions

## API Endpoints

### Search Products by title

```
GET /products/search?title=your+query
```

Response:
```json
[
  {
    "id": "string",
    "title": "string",
    "link": "string",
    "image_link": "string",
    "price": "number",
    "currency": "string",
    "availability": "string"
  }
]
```

## Database Schema

The application uses the following database schema:

```sql
CREATE TABLE feed.products(
  id text PRIMARY KEY,
  title text NOT NULL,
  link text NOT NULL,
  image_link text,
  price numeric(10, 2) NOT NULL,
  currency text NOT NULL,
  availability text NOT NULL
);
```
