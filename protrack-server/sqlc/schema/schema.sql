DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'status_enum'
        AND n.nspname = 'public'
) THEN CREATE TYPE public.status_enum AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'DELETED'
);
END IF;
END $$;
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    status status_enum NOT NULL DEFAULT 'ACTIVE',
    company_id UUID NULL,
    department_id UUID NULL,
    last_login_at TIMESTAMPTZ NULL,
    created_by UUID NULL,
    updated_by UUID NULL,
    deleted_by UUID NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL
);
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    trade_name VARCHAR(150),
    document VARCHAR(20) UNIQUE,
    document_type VARCHAR(10),
    email VARCHAR(150),
    phone VARCHAR(30),
    website VARCHAR(150),
    address_street VARCHAR(150),
    address_number VARCHAR(20),
    address_complement VARCHAR(100),
    address_neighborhood VARCHAR(100),
    address_city VARCHAR(100),
    address_state VARCHAR(2),
    address_zipcode VARCHAR(20),
    address_country VARCHAR(50) DEFAULT 'BR',
    status status_enum NOT NULL DEFAULT 'ACTIVE',
    timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    created_by UUID NULL,
    updated_by UUID NULL,
    deleted_by UUID NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL
);