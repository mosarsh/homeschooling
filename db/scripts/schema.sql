create table if not exists companies (
    id bigint not null,
    created_at timestamptz,
    updated_at timestamptz,
    deleted_at timestamptz,
    name text,
    active boolean,
    primary key (id) 
);

create table if not exists locations (
    id bigint not null,
    created_at timestamptz,
    updated_at timestamptz,
    deleted_at timestamptz,
    name text,
    active boolean,
    address text,
    company_id bigint,
    primary key (id),
    foreign key (company_id) REFERENCES companies (id)
);

create table if not exists roles (
    id bigint not null,
    access_level bigint,
    name text,
    primary key (id) 
);

create table if not exists users (
    id bigint not null,
    created_at timestamptz,
    updated_at timestamptz,
    deleted_at timestamptz,
    first_name text,
    last_name text,
    username text,
    password text,
    email text,
    mobile text,
    phone text,
    address text,
    active boolean,
    last_login timestamptz,
    last_password_change timestamptz,
    token text,
    role_id bigint,
    company_id bigint,
    location_id bigint,
    primary key (id),
    foreign key (role_id) REFERENCES roles (id)
);
