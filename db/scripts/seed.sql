INSERT INTO public.companies VALUES (1, now(), now(), NULL, 'admin_company', true);
INSERT INTO public.locations VALUES (1, now(), now(), NULL, 'admin_location', true, 'admin_address', 1);
INSERT INTO public.roles VALUES (100, 100, 'SUPER_ADMIN');
INSERT INTO public.roles VALUES (110, 110, 'ADMIN');
INSERT INTO public.roles VALUES (120, 120, 'COMPANY_ADMIN');
INSERT INTO public.roles VALUES (130, 130, 'LOCATION_ADMIN');
INSERT INTO public.roles VALUES (200, 200, 'USER');
INSERT INTO public.users (id, created_at, updated_at, first_name, last_name, username, password, email, active, role_id, company_id, location_id) VALUES (1, now(),now(),'Admin', 'Admin', 'admin', '$2a$10$Wyj1RtRZoipLUBWXsQekwus.yFFGbGNLxALzlDeAcWgvoYtcXyTSu', 'johndoe@mail.com', true, 100, 1, 1);