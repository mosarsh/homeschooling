create extension if not exists "uuid-ossp";

create table if not exists public.school (
    id bigserial primary key,
    name text,
    address text,
    postal text,
    phone text,
    uuid uuid not null default uuid_generate_v1()
);

create table if not exists public.role (
    id bigserial primary key,
    access_level bigint,
    name text
);

create table if not exists public.user (
    id bigserial primary key,
    first_name text,
    last_name text,
    email text,
    password text,
    active boolean,
    phone text,
    address text,
    last_login timestamptz,
    last_password_change timestamptz,
    token text,
    role_id bigint not null,
    school_id bigint not null,
    locked_at timestamptz,
    created_at timestamptz,
    updated_at timestamptz,
    deleted_at timestamptz,
    uuid uuid not null default uuid_generate_v1(),
    foreign key (role_id) REFERENCES role (id),
    foreign key (school_id) REFERENCES school (id)
);

create table if not exists public.class (
    id bigint primary key,
    name text,
    school_id bigint not null,
    created_at timestamptz,
    foreign key (school_id) REFERENCES school (id)
);

create table if not exists public.subject (
    id bigserial primary key,
    name text,
    school_id bigint not null,
    foreign key (school_id) REFERENCES school (id)
);