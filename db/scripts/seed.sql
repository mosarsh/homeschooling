INSERT INTO public.companies VALUES (1, now(), now(), NULL, 'admin_company', true);
INSERT INTO public.locations VALUES (1, now(), now(), NULL, 'admin_location', true, 'admin_address', 1);
INSERT INTO public.roles VALUES (100, 100, 'SUPER_ADMIN');
INSERT INTO public.roles VALUES (110, 110, 'ADMIN');
INSERT INTO public.roles VALUES (200, 200, 'TEACHER');
INSERT INTO public.roles VALUES (300, 300, 'STUDENT');
INSERT INTO public.roles VALUES (400, 400, 'PARENT');
INSERT INTO public.users (id, created_at, updated_at, first_name, last_name, username, password, email, active, role_id, company_id, location_id) VALUES (1, now(),now(),'Arshak', 'Movsisyan', 'admin', '$2y$12$9pcMYS4blooc8JkvzqK3QuVb58abl/m7cgBIHjAOHeMC3MN/8etP2', 'arshak.movsissian@gmail.com', true, 100, 1, 1);