-- Create user if it doesn't exist
CREATE USER "user" WITH PASSWORD 'password';

-- Create database
CREATE DATABASE digital_menu OWNER "user";

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE digital_menu TO "user";

-- Allow user to create databases (for Prisma shadow database)
ALTER USER "user" CREATEDB;
