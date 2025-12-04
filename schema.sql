--
-- PostgreSQL database dump
--

\restrict wedPXCxuzCzDpJ9fVLGMmCLDoiPRjU82CuDAMSNsZUp1MqckvsrPRh27wLG1siY

-- Dumped from database version 17.6 (Ubuntu 17.6-0ubuntu0.25.04.1)
-- Dumped by pg_dump version 17.6 (Ubuntu 17.6-0ubuntu0.25.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_logs (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    user_id uuid NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    action text NOT NULL,
    changes jsonb,
    created_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.activity_logs OWNER TO postgres;

--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    address character varying(255),
    vat_number character varying(50),
    odoo_company_id bigint,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.companies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_id_seq OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: incidents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.incidents (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    vehicle_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    severity text DEFAULT 'medium'::text NOT NULL,
    status text DEFAULT 'reported'::text NOT NULL,
    reported_by uuid NOT NULL,
    reported_at timestamp with time zone NOT NULL,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.incidents OWNER TO postgres;

--
-- Name: inventory_stocks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_stocks (
    id uuid NOT NULL,
    warehouse_id uuid NOT NULL,
    part_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    quantity bigint DEFAULT 0,
    min_quantity bigint DEFAULT 0,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.inventory_stocks OWNER TO postgres;

--
-- Name: maintenance_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenance_templates (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    interval_km bigint,
    interval_days bigint,
    interval_hours bigint,
    tasks jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.maintenance_templates OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    user_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    type character varying(50) NOT NULL,
    category character varying(50) NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: parts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parts (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    part_number text NOT NULL,
    name text NOT NULL,
    description text,
    brand text,
    unit_price numeric DEFAULT 0,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    supplier_id uuid,
    category text,
    quantity bigint DEFAULT 0,
    min_quantity bigint DEFAULT 0,
    location text,
    deleted_at timestamp with time zone
);


ALTER TABLE public.parts OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id uuid NOT NULL,
    code text NOT NULL,
    module text,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    is_system boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: scheduled_maintenances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scheduled_maintenances (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    vehicle_id uuid NOT NULL,
    template_id uuid,
    title text NOT NULL,
    description text,
    scheduled_date timestamp with time zone NOT NULL,
    priority text DEFAULT 'medium'::text,
    assigned_to uuid,
    estimated_cost numeric DEFAULT 0,
    status text DEFAULT 'scheduled'::text NOT NULL,
    work_order_id uuid,
    notes text,
    created_by uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.scheduled_maintenances OWNER TO postgres;

--
-- Name: stock_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_movements (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    part_id uuid NOT NULL,
    warehouse_id uuid NOT NULL,
    movement_type text NOT NULL,
    quantity bigint NOT NULL,
    reason text,
    work_order_id uuid,
    created_by uuid NOT NULL,
    created_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.stock_movements OWNER TO postgres;

--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    contact_name text,
    email text,
    phone text,
    address text,
    notes text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- Name: tenants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenants (
    id uuid NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.tenants OWNER TO postgres;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    role text DEFAULT 'viewer'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text,
    department text,
    job_title text,
    sites text,
    shift text,
    last_login timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: vehicle_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_documents (
    id uuid NOT NULL,
    vehicle_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    file_url text NOT NULL,
    document_type text NOT NULL,
    expiry_date timestamp with time zone,
    created_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.vehicle_documents OWNER TO postgres;

--
-- Name: vehicle_maintenance_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_maintenance_plans (
    id uuid NOT NULL,
    vehicle_id uuid NOT NULL,
    template_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    last_service_km bigint,
    last_service_date timestamp with time zone,
    next_service_km bigint,
    next_service_date timestamp with time zone,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.vehicle_maintenance_plans OWNER TO postgres;

--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicles (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    plate_number text NOT NULL,
    vin text,
    type text NOT NULL,
    brand text,
    model text,
    year bigint,
    status text DEFAULT 'active'::text NOT NULL,
    current_km bigint DEFAULT 0,
    current_engine_hours bigint DEFAULT 0,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.vehicles OWNER TO postgres;

--
-- Name: warehouses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouses (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    location text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.warehouses OWNER TO postgres;

--
-- Name: work_order_attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_order_attachments (
    id uuid NOT NULL,
    work_order_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    file_url text NOT NULL,
    file_name text,
    created_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.work_order_attachments OWNER TO postgres;

--
-- Name: work_order_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_order_comments (
    id uuid NOT NULL,
    work_order_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    user_id uuid NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.work_order_comments OWNER TO postgres;

--
-- Name: work_order_costs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_order_costs (
    id uuid NOT NULL,
    work_order_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    labor_cost numeric DEFAULT 0,
    parts_cost numeric DEFAULT 0,
    external_service_cost numeric DEFAULT 0,
    total_cost numeric DEFAULT 0,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.work_order_costs OWNER TO postgres;

--
-- Name: work_order_parts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_order_parts (
    id uuid NOT NULL,
    work_order_id uuid NOT NULL,
    part_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    quantity bigint NOT NULL,
    unit_price numeric NOT NULL,
    created_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.work_order_parts OWNER TO postgres;

--
-- Name: work_order_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_order_tasks (
    id uuid NOT NULL,
    work_order_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    is_done boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.work_order_tasks OWNER TO postgres;

--
-- Name: work_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_orders (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    vehicle_id uuid NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    description text,
    status text DEFAULT 'pending'::text NOT NULL,
    priority text DEFAULT 'medium'::text,
    assigned_to uuid,
    scheduled_date timestamp with time zone,
    completed_date timestamp with time zone,
    created_by uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.work_orders OWNER TO postgres;

--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: incidents incidents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_pkey PRIMARY KEY (id);


--
-- Name: inventory_stocks inventory_stocks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_stocks
    ADD CONSTRAINT inventory_stocks_pkey PRIMARY KEY (id);


--
-- Name: maintenance_templates maintenance_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_templates
    ADD CONSTRAINT maintenance_templates_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: parts parts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parts
    ADD CONSTRAINT parts_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_code_key UNIQUE (code);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: scheduled_maintenances scheduled_maintenances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_maintenances
    ADD CONSTRAINT scheduled_maintenances_pkey PRIMARY KEY (id);


--
-- Name: stock_movements stock_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: users uq_users_tenant_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uq_users_tenant_email UNIQUE (tenant_id, email);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vehicle_documents vehicle_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_documents
    ADD CONSTRAINT vehicle_documents_pkey PRIMARY KEY (id);


--
-- Name: vehicle_maintenance_plans vehicle_maintenance_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_maintenance_plans
    ADD CONSTRAINT vehicle_maintenance_plans_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (id);


--
-- Name: work_order_attachments work_order_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_attachments
    ADD CONSTRAINT work_order_attachments_pkey PRIMARY KEY (id);


--
-- Name: work_order_comments work_order_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_comments
    ADD CONSTRAINT work_order_comments_pkey PRIMARY KEY (id);


--
-- Name: work_order_costs work_order_costs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_costs
    ADD CONSTRAINT work_order_costs_pkey PRIMARY KEY (id);


--
-- Name: work_order_parts work_order_parts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_parts
    ADD CONSTRAINT work_order_parts_pkey PRIMARY KEY (id);


--
-- Name: work_order_tasks work_order_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_tasks
    ADD CONSTRAINT work_order_tasks_pkey PRIMARY KEY (id);


--
-- Name: work_orders work_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_pkey PRIMARY KEY (id);


--
-- Name: idx_activity_logs_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_logs_deleted_at ON public.activity_logs USING btree (deleted_at);


--
-- Name: idx_activity_logs_entity_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_logs_entity_id ON public.activity_logs USING btree (entity_id);


--
-- Name: idx_activity_logs_entity_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_logs_entity_type ON public.activity_logs USING btree (entity_type);


--
-- Name: idx_activity_logs_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_logs_tenant_id ON public.activity_logs USING btree (tenant_id);


--
-- Name: idx_activity_logs_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_logs_user_id ON public.activity_logs USING btree (user_id);


--
-- Name: idx_companies_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_companies_deleted_at ON public.companies USING btree (deleted_at);


--
-- Name: idx_companies_vat_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_companies_vat_number ON public.companies USING btree (vat_number);


--
-- Name: idx_incidents_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_incidents_deleted_at ON public.incidents USING btree (deleted_at);


--
-- Name: idx_incidents_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_incidents_tenant_id ON public.incidents USING btree (tenant_id);


--
-- Name: idx_incidents_tenant_status_severity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_incidents_tenant_status_severity ON public.incidents USING btree (tenant_id, status, severity);


--
-- Name: idx_incidents_vehicle_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_incidents_vehicle_id ON public.incidents USING btree (vehicle_id);


--
-- Name: idx_inventory_stocks_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_stocks_deleted_at ON public.inventory_stocks USING btree (deleted_at);


--
-- Name: idx_inventory_stocks_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_stocks_tenant_id ON public.inventory_stocks USING btree (tenant_id);


--
-- Name: idx_maintenance_templates_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_maintenance_templates_deleted_at ON public.maintenance_templates USING btree (deleted_at);


--
-- Name: idx_maintenance_templates_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_maintenance_templates_tenant_id ON public.maintenance_templates USING btree (tenant_id);


--
-- Name: idx_notifications_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_deleted_at ON public.notifications USING btree (deleted_at);


--
-- Name: idx_notifications_is_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_is_read ON public.notifications USING btree (is_read);


--
-- Name: idx_notifications_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_tenant_id ON public.notifications USING btree (tenant_id);


--
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- Name: idx_parts_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_parts_deleted_at ON public.parts USING btree (deleted_at);


--
-- Name: idx_parts_part_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_parts_part_number ON public.parts USING btree (part_number);


--
-- Name: idx_parts_supplier_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_parts_supplier_id ON public.parts USING btree (supplier_id);


--
-- Name: idx_parts_tenant_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_parts_tenant_category ON public.parts USING btree (tenant_id, category);


--
-- Name: idx_parts_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_parts_tenant_id ON public.parts USING btree (tenant_id);


--
-- Name: idx_role_permissions_tenant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_role_permissions_tenant ON public.role_permissions USING btree (tenant_id);


--
-- Name: idx_scheduled_maintenances_assigned_to; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_scheduled_maintenances_assigned_to ON public.scheduled_maintenances USING btree (assigned_to);


--
-- Name: idx_scheduled_maintenances_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_scheduled_maintenances_deleted_at ON public.scheduled_maintenances USING btree (deleted_at);


--
-- Name: idx_scheduled_maintenances_scheduled_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_scheduled_maintenances_scheduled_date ON public.scheduled_maintenances USING btree (scheduled_date);


--
-- Name: idx_scheduled_maintenances_template_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_scheduled_maintenances_template_id ON public.scheduled_maintenances USING btree (template_id);


--
-- Name: idx_scheduled_maintenances_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_scheduled_maintenances_tenant_id ON public.scheduled_maintenances USING btree (tenant_id);


--
-- Name: idx_scheduled_maintenances_tenant_status_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_scheduled_maintenances_tenant_status_date ON public.scheduled_maintenances USING btree (tenant_id, status, scheduled_date);


--
-- Name: idx_scheduled_maintenances_vehicle_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_scheduled_maintenances_vehicle_id ON public.scheduled_maintenances USING btree (vehicle_id);


--
-- Name: idx_scheduled_maintenances_work_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_scheduled_maintenances_work_order_id ON public.scheduled_maintenances USING btree (work_order_id);


--
-- Name: idx_stock_movements_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_deleted_at ON public.stock_movements USING btree (deleted_at);


--
-- Name: idx_stock_movements_part_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_part_id ON public.stock_movements USING btree (part_id);


--
-- Name: idx_stock_movements_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_tenant_id ON public.stock_movements USING btree (tenant_id);


--
-- Name: idx_stock_movements_warehouse_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_warehouse_id ON public.stock_movements USING btree (warehouse_id);


--
-- Name: idx_stock_movements_work_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_work_order_id ON public.stock_movements USING btree (work_order_id);


--
-- Name: idx_suppliers_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_suppliers_deleted_at ON public.suppliers USING btree (deleted_at);


--
-- Name: idx_suppliers_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_suppliers_tenant_id ON public.suppliers USING btree (tenant_id);


--
-- Name: idx_tenant_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_tenant_email ON public.users USING btree (email);


--
-- Name: idx_tenants_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tenants_deleted_at ON public.tenants USING btree (deleted_at);


--
-- Name: idx_user_roles_tenant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_roles_tenant ON public.user_roles USING btree (tenant_id);


--
-- Name: idx_users_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_deleted_at ON public.users USING btree (deleted_at);


--
-- Name: idx_users_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_tenant_id ON public.users USING btree (tenant_id);


--
-- Name: idx_vehicle_documents_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_documents_deleted_at ON public.vehicle_documents USING btree (deleted_at);


--
-- Name: idx_vehicle_documents_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_documents_tenant_id ON public.vehicle_documents USING btree (tenant_id);


--
-- Name: idx_vehicle_documents_vehicle_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_documents_vehicle_id ON public.vehicle_documents USING btree (vehicle_id);


--
-- Name: idx_vehicle_maintenance_plans_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_maintenance_plans_deleted_at ON public.vehicle_maintenance_plans USING btree (deleted_at);


--
-- Name: idx_vehicle_maintenance_plans_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_maintenance_plans_tenant_id ON public.vehicle_maintenance_plans USING btree (tenant_id);


--
-- Name: idx_vehicle_maintenance_plans_vehicle_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_maintenance_plans_vehicle_id ON public.vehicle_maintenance_plans USING btree (vehicle_id);


--
-- Name: idx_vehicles_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicles_deleted_at ON public.vehicles USING btree (deleted_at);


--
-- Name: idx_vehicles_plate_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicles_plate_number ON public.vehicles USING btree (plate_number);


--
-- Name: idx_vehicles_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicles_tenant_id ON public.vehicles USING btree (tenant_id);


--
-- Name: idx_vehicles_vin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicles_vin ON public.vehicles USING btree (vin);


--
-- Name: idx_warehouse_part; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_warehouse_part ON public.inventory_stocks USING btree (warehouse_id, part_id);


--
-- Name: idx_warehouses_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_warehouses_deleted_at ON public.warehouses USING btree (deleted_at);


--
-- Name: idx_warehouses_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_warehouses_tenant_id ON public.warehouses USING btree (tenant_id);


--
-- Name: idx_work_order_attachments_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_order_attachments_deleted_at ON public.work_order_attachments USING btree (deleted_at);


--
-- Name: idx_work_order_attachments_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_order_attachments_tenant_id ON public.work_order_attachments USING btree (tenant_id);


--
-- Name: idx_work_order_attachments_work_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_order_attachments_work_order_id ON public.work_order_attachments USING btree (work_order_id);


--
-- Name: idx_work_order_comments_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_order_comments_deleted_at ON public.work_order_comments USING btree (deleted_at);


--
-- Name: idx_work_order_comments_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_order_comments_tenant_id ON public.work_order_comments USING btree (tenant_id);


--
-- Name: idx_work_order_comments_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_order_comments_user_id ON public.work_order_comments USING btree (user_id);


--
-- Name: idx_work_order_comments_work_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_order_comments_work_order_id ON public.work_order_comments USING btree (work_order_id);


--
-- Name: idx_work_order_costs_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_order_costs_deleted_at ON public.work_order_costs USING btree (deleted_at);


--
-- Name: idx_work_order_costs_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_order_costs_tenant_id ON public.work_order_costs USING btree (tenant_id);


--
-- Name: idx_work_order_costs_work_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_work_order_costs_work_order_id ON public.work_order_costs USING btree (work_order_id);


--
-- Name: idx_work_order_parts_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_order_parts_deleted_at ON public.work_order_parts USING btree (deleted_at);


--
-- Name: idx_work_order_parts_part_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_order_parts_part_id ON public.work_order_parts USING btree (part_id);


--
-- Name: idx_work_order_parts_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_order_parts_tenant_id ON public.work_order_parts USING btree (tenant_id);


--
-- Name: idx_work_order_parts_work_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_order_parts_work_order_id ON public.work_order_parts USING btree (work_order_id);


--
-- Name: idx_work_order_tasks_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_order_tasks_deleted_at ON public.work_order_tasks USING btree (deleted_at);


--
-- Name: idx_work_order_tasks_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_order_tasks_tenant_id ON public.work_order_tasks USING btree (tenant_id);


--
-- Name: idx_work_order_tasks_work_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_order_tasks_work_order_id ON public.work_order_tasks USING btree (work_order_id);


--
-- Name: idx_work_orders_assigned_to; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_orders_assigned_to ON public.work_orders USING btree (assigned_to);


--
-- Name: idx_work_orders_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_orders_deleted_at ON public.work_orders USING btree (deleted_at);


--
-- Name: idx_work_orders_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_orders_tenant_id ON public.work_orders USING btree (tenant_id);


--
-- Name: idx_work_orders_tenant_status_priority; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_orders_tenant_status_priority ON public.work_orders USING btree (tenant_id, status, priority);


--
-- Name: idx_work_orders_tenant_vehicle_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_orders_tenant_vehicle_status ON public.work_orders USING btree (tenant_id, vehicle_id, status);


--
-- Name: idx_work_orders_vehicle_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_orders_vehicle_id ON public.work_orders USING btree (vehicle_id);


--
-- Name: uq_inventory_stocks_tenant_wh_part; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_inventory_stocks_tenant_wh_part ON public.inventory_stocks USING btree (tenant_id, warehouse_id, part_id);


--
-- Name: uq_parts_tenant_part_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_parts_tenant_part_number ON public.parts USING btree (tenant_id, part_number);


--
-- Name: uq_roles_tenant_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_roles_tenant_slug ON public.roles USING btree (tenant_id, slug);


--
-- Name: uq_suppliers_tenant_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_suppliers_tenant_name ON public.suppliers USING btree (tenant_id, name);


--
-- Name: uq_vehicles_tenant_plate; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_vehicles_tenant_plate ON public.vehicles USING btree (tenant_id, plate_number);


--
-- Name: uq_vehicles_tenant_vin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_vehicles_tenant_vin ON public.vehicles USING btree (tenant_id, vin) WHERE (vin IS NOT NULL);


--
-- Name: uq_warehouses_tenant_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_warehouses_tenant_name ON public.warehouses USING btree (tenant_id, name);


--
-- Name: companies set_companies_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: incidents set_incidents_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_incidents_updated_at BEFORE UPDATE ON public.incidents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: inventory_stocks set_inventory_stocks_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_inventory_stocks_updated_at BEFORE UPDATE ON public.inventory_stocks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: maintenance_templates set_maintenance_templates_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_maintenance_templates_updated_at BEFORE UPDATE ON public.maintenance_templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: notifications set_notifications_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: parts set_parts_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_parts_updated_at BEFORE UPDATE ON public.parts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: scheduled_maintenances set_scheduled_maintenances_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_scheduled_maintenances_updated_at BEFORE UPDATE ON public.scheduled_maintenances FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: suppliers set_suppliers_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: tenants set_tenants_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: users set_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: vehicle_maintenance_plans set_vehicle_maintenance_plans_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_vehicle_maintenance_plans_updated_at BEFORE UPDATE ON public.vehicle_maintenance_plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: vehicles set_vehicles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: warehouses set_warehouses_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_warehouses_updated_at BEFORE UPDATE ON public.warehouses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: work_order_comments set_work_order_comments_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_work_order_comments_updated_at BEFORE UPDATE ON public.work_order_comments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: work_order_costs set_work_order_costs_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_work_order_costs_updated_at BEFORE UPDATE ON public.work_order_costs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: work_order_tasks set_work_order_tasks_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_work_order_tasks_updated_at BEFORE UPDATE ON public.work_order_tasks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: work_orders set_work_orders_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_work_orders_updated_at BEFORE UPDATE ON public.work_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: activity_logs fk_activity_logs_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT fk_activity_logs_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: activity_logs fk_activity_logs_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT fk_activity_logs_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: incidents fk_incidents_reported_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT fk_incidents_reported_user FOREIGN KEY (reported_by) REFERENCES public.users(id);


--
-- Name: incidents fk_incidents_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT fk_incidents_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: incidents fk_incidents_vehicle; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT fk_incidents_vehicle FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: inventory_stocks fk_inventory_stocks_part; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_stocks
    ADD CONSTRAINT fk_inventory_stocks_part FOREIGN KEY (part_id) REFERENCES public.parts(id);


--
-- Name: inventory_stocks fk_inventory_stocks_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_stocks
    ADD CONSTRAINT fk_inventory_stocks_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: inventory_stocks fk_inventory_stocks_warehouse; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_stocks
    ADD CONSTRAINT fk_inventory_stocks_warehouse FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- Name: maintenance_templates fk_maintenance_templates_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_templates
    ADD CONSTRAINT fk_maintenance_templates_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: notifications fk_notifications_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notifications_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: notifications fk_notifications_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: parts fk_parts_supplier; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parts
    ADD CONSTRAINT fk_parts_supplier FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: parts fk_parts_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parts
    ADD CONSTRAINT fk_parts_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: scheduled_maintenances fk_scheduled_maintenances_assigned_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_maintenances
    ADD CONSTRAINT fk_scheduled_maintenances_assigned_user FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: scheduled_maintenances fk_scheduled_maintenances_created_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_maintenances
    ADD CONSTRAINT fk_scheduled_maintenances_created_user FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: scheduled_maintenances fk_scheduled_maintenances_template; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_maintenances
    ADD CONSTRAINT fk_scheduled_maintenances_template FOREIGN KEY (template_id) REFERENCES public.maintenance_templates(id);


--
-- Name: scheduled_maintenances fk_scheduled_maintenances_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_maintenances
    ADD CONSTRAINT fk_scheduled_maintenances_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: scheduled_maintenances fk_scheduled_maintenances_vehicle; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_maintenances
    ADD CONSTRAINT fk_scheduled_maintenances_vehicle FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: scheduled_maintenances fk_scheduled_maintenances_work_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_maintenances
    ADD CONSTRAINT fk_scheduled_maintenances_work_order FOREIGN KEY (work_order_id) REFERENCES public.work_orders(id);


--
-- Name: stock_movements fk_stock_movements_created_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT fk_stock_movements_created_user FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: stock_movements fk_stock_movements_part; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT fk_stock_movements_part FOREIGN KEY (part_id) REFERENCES public.parts(id);


--
-- Name: stock_movements fk_stock_movements_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT fk_stock_movements_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: stock_movements fk_stock_movements_warehouse; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT fk_stock_movements_warehouse FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- Name: stock_movements fk_stock_movements_work_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT fk_stock_movements_work_order FOREIGN KEY (work_order_id) REFERENCES public.work_orders(id);


--
-- Name: suppliers fk_suppliers_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT fk_suppliers_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: users fk_users_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: vehicle_documents fk_vehicle_documents_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_documents
    ADD CONSTRAINT fk_vehicle_documents_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: vehicle_documents fk_vehicle_documents_vehicle; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_documents
    ADD CONSTRAINT fk_vehicle_documents_vehicle FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: vehicle_maintenance_plans fk_vehicle_maintenance_plans_template; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_maintenance_plans
    ADD CONSTRAINT fk_vehicle_maintenance_plans_template FOREIGN KEY (template_id) REFERENCES public.maintenance_templates(id);


--
-- Name: vehicle_maintenance_plans fk_vehicle_maintenance_plans_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_maintenance_plans
    ADD CONSTRAINT fk_vehicle_maintenance_plans_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: vehicle_maintenance_plans fk_vehicle_maintenance_plans_vehicle; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_maintenance_plans
    ADD CONSTRAINT fk_vehicle_maintenance_plans_vehicle FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: vehicles fk_vehicles_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT fk_vehicles_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: warehouses fk_warehouses_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT fk_warehouses_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: work_order_attachments fk_work_order_attachments_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_attachments
    ADD CONSTRAINT fk_work_order_attachments_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: work_order_comments fk_work_order_comments_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_comments
    ADD CONSTRAINT fk_work_order_comments_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: work_order_comments fk_work_order_comments_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_comments
    ADD CONSTRAINT fk_work_order_comments_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: work_order_costs fk_work_order_costs_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_costs
    ADD CONSTRAINT fk_work_order_costs_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: work_order_parts fk_work_order_parts_part; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_parts
    ADD CONSTRAINT fk_work_order_parts_part FOREIGN KEY (part_id) REFERENCES public.parts(id);


--
-- Name: work_order_parts fk_work_order_parts_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_parts
    ADD CONSTRAINT fk_work_order_parts_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: work_order_tasks fk_work_order_tasks_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_tasks
    ADD CONSTRAINT fk_work_order_tasks_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: work_orders fk_work_orders_assigned_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT fk_work_orders_assigned_user FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: work_order_attachments fk_work_orders_attachments; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_attachments
    ADD CONSTRAINT fk_work_orders_attachments FOREIGN KEY (work_order_id) REFERENCES public.work_orders(id);


--
-- Name: work_order_comments fk_work_orders_comments; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_comments
    ADD CONSTRAINT fk_work_orders_comments FOREIGN KEY (work_order_id) REFERENCES public.work_orders(id);


--
-- Name: work_order_costs fk_work_orders_cost; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_costs
    ADD CONSTRAINT fk_work_orders_cost FOREIGN KEY (work_order_id) REFERENCES public.work_orders(id);


--
-- Name: work_orders fk_work_orders_created_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT fk_work_orders_created_user FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: work_order_parts fk_work_orders_parts; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_parts
    ADD CONSTRAINT fk_work_orders_parts FOREIGN KEY (work_order_id) REFERENCES public.work_orders(id);


--
-- Name: work_order_tasks fk_work_orders_tasks; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_tasks
    ADD CONSTRAINT fk_work_orders_tasks FOREIGN KEY (work_order_id) REFERENCES public.work_orders(id);


--
-- Name: work_orders fk_work_orders_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT fk_work_orders_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: work_orders fk_work_orders_vehicle; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT fk_work_orders_vehicle FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: roles roles_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict wedPXCxuzCzDpJ9fVLGMmCLDoiPRjU82CuDAMSNsZUp1MqckvsrPRh27wLG1siY

