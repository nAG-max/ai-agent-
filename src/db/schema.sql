-- ====================================================================
-- DATABASE SCHEMA FOR RESEARCHPRO AI
-- Target Database: PostgreSQL
-- Purpose: Persistent storage for business discovery, verification audits,
--          duplicate resolution tracking, and system performance analytics.
-- ====================================================================

-- Enable UUID extension for secure, random record IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SEARCH SESSIONS TABLE
-- Tracks every automated business research pipeline triggered by a customer.
CREATE TABLE search_sessions (
    id VARCHAR(100) PRIMARY KEY DEFAULT 'session_' || EXTRACT(EPOCH FROM NOW())::BIGINT,
    query VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL CHECK (status IN ('searching', 'verifying', 'deduplicating', 'reporting', 'completed', 'failed')),
    progress INT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    businesses_found INT NOT NULL DEFAULT 0,
    businesses_verified INT NOT NULL DEFAULT 0,
    duplicates_removed INT NOT NULL DEFAULT 0,
    duration_ms INT NOT NULL DEFAULT 0,
    website_coverage NUMERIC(5, 2) DEFAULT 0.00,
    phone_coverage NUMERIC(5, 2) DEFAULT 0.00,
    hours_coverage NUMERIC(5, 2) DEFAULT 0.00,
    verification_rate NUMERIC(5, 2) DEFAULT 0.00,
    ai_report TEXT
);

-- Index search sessions for fast dashboard lookups
CREATE INDEX idx_sessions_timestamp ON search_sessions(timestamp DESC);
CREATE INDEX idx_sessions_category_location ON search_sessions(category, location);


-- 2. DISCOVERED BUSINESSES TABLE
-- Stores individual companies discovered and scraped by the crawlers.
CREATE TABLE discovered_businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) REFERENCES search_sessions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website TEXT,
    working_hours TEXT,
    rating NUMERIC(3, 2) DEFAULT 0.00 CHECK (rating >= 0.00 AND rating <= 5.00),
    review_count INT DEFAULT 0,
    verification_score INT DEFAULT 0 CHECK (verification_score >= 0 AND verification_score <= 100),
    verification_confidence VARCHAR(20) DEFAULT 'Low' CHECK (verification_confidence IN ('High', 'Medium', 'Low')),
    services TEXT[], -- Array of discovered clinical/practical services
    specialties TEXT[], -- Array of focus areas
    certifications TEXT[], -- Board certifications and standard credentials
    awards TEXT[], -- Discovered award titles
    image_urls TEXT[], -- Scraped directory visual references
    source_urls TEXT[], -- Array of source links (e.g. Yelp, Facebook, Official Site)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_businesses_session ON discovered_businesses(session_id);
CREATE INDEX idx_businesses_name ON discovered_businesses(name);


-- 3. SOURCE CREDIBILITY AUDIT TABLE
-- Tracks the specific authority platforms checked for each company.
CREATE TABLE business_verification_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES discovered_businesses(id) ON DELETE CASCADE,
    source_name VARCHAR(100) NOT NULL, -- e.g. 'Official Website', 'Google Maps API', 'Yelp Directory'
    verified BOOLEAN DEFAULT FALSE,
    url TEXT,
    last_checked DATE DEFAULT CURRENT_DATE
);

CREATE INDEX idx_sources_business ON business_verification_sources(business_id);


-- 4. CONFLICT DISCREPANCY LOGS
-- Logs contradicting values detected across distinct channels for human inspection.
CREATE TABLE business_conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES discovered_businesses(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL, -- e.g. 'phone', 'working_hours', 'website'
    source VARCHAR(100) NOT NULL, -- Platform asserting the value
    conflict_value TEXT NOT NULL, -- The contradicting entry
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conflicts_business ON business_conflicts(business_id);


-- 5. SOCIAL PROFILES TABLE
-- Captures mapped social handles found during crawler sweeps.
CREATE TABLE business_social_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES discovered_businesses(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- e.g. 'Facebook', 'LinkedIn', 'Instagram'
    url TEXT NOT NULL
);


-- 6. DEDUPLICATED OVERLAPPING RECORDS
-- Holds records of raw duplicate leads absorbed/merged during string-similarity filters.
CREATE TABLE deduplicated_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) REFERENCES search_sessions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    website TEXT,
    duplicate_source VARCHAR(100), -- Directory where duplicate entry originally lived
    merged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_duplicates_session ON deduplicated_records(session_id);


-- 7. SYSTEM POPULAR QUERIES
-- Tracks system-wide global search statistics.
CREATE TABLE popular_queries (
    query VARCHAR(255) PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    count INT DEFAULT 1,
    last_searched TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
