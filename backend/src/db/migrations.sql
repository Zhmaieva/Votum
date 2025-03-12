CREATE DATABASE poll_app;

CREATE TABLE users (
   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
   username VARCHAR(50) UNIQUE NOT NULL,
   email VARCHAR(100) UNIQUE NOT NULL,
   password_hash TEXT NOT NULL,
   created_at TIMESTAMPTZ DEFAULT NOW()
);

