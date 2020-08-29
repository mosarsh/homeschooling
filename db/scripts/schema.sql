create extension if not exists "uuid-ossp";

create table if not exists public.schools (
    id bigserial primary key,
    name varchar (250) not null,
    address varchar (250) not null,
    postal varchar (50),
    phone text [],
    uuid uuid not null default uuid_generate_v1()
);

create table if not exists public.roles (
    id bigserial primary key,
    access_level bigint,
    name varchar (50)
);

create table if not exists public.users (
    id bigserial primary key,
    first_name varchar (50),
    last_name varchar (50),
    email varchar (50) unique not null,
    password text,
    active boolean,
    phone text [],
    address varchar (250),
    last_login timestamptz,
    last_password_change timestamptz,
    token text,
    role_id bigint not null,
    school_id bigint,
    locked_at timestamptz,
    created_at timestamptz,
    updated_at timestamptz,
    deleted_at timestamptz,
    uuid uuid not null default uuid_generate_v1(),
    foreign key (role_id) REFERENCES roles (id),
    foreign key (school_id) REFERENCES schools (id)
);

create table if not exists public.classes (
    id bigint primary key,
    name varchar (250),
    school_id bigint not null,
    created_at timestamptz,
    foreign key (school_id) REFERENCES schools (id)
);

create table if not exists public.subjectes (
    id bigserial primary key,
    name varchar (250),
    school_id bigint not null,
    foreign key (school_id) REFERENCES schools (id)
);