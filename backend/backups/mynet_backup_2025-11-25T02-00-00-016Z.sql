--
-- PostgreSQL database dump
--

\restrict vaeFYlNMkyLUpKsGYe0G3QezR1qaaeItUG3WKIjwSO6gzVHKRNxp6QKirwhIhQH

-- Dumped from database version 16.9 (415ebe8)
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addenda; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.addenda (
    id integer NOT NULL,
    tender_id integer NOT NULL,
    addendum_number character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    inquiry_responses jsonb DEFAULT '[]'::jsonb,
    published_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    published_by integer,
    document_url character varying(500),
    version integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.addenda OWNER TO neondb_owner;

--
-- Name: addenda_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.addenda_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.addenda_id_seq OWNER TO neondb_owner;

--
-- Name: addenda_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.addenda_id_seq OWNED BY public.addenda.id;


--
-- Name: addendum_notifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.addendum_notifications (
    id integer NOT NULL,
    addendum_id integer NOT NULL,
    user_id integer NOT NULL,
    sent_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    read_at timestamp with time zone,
    notification_method character varying(50) DEFAULT 'email'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.addendum_notifications OWNER TO neondb_owner;

--
-- Name: addendum_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.addendum_notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.addendum_notifications_id_seq OWNER TO neondb_owner;

--
-- Name: addendum_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.addendum_notifications_id_seq OWNED BY public.addendum_notifications.id;


--
-- Name: archive_policies; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.archive_policies (
    id integer NOT NULL,
    entity_type character varying(50) NOT NULL,
    retention_days integer DEFAULT 2555 NOT NULL,
    archive_action character varying(20) DEFAULT 'archive'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.archive_policies OWNER TO neondb_owner;

--
-- Name: archive_policies_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.archive_policies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.archive_policies_id_seq OWNER TO neondb_owner;

--
-- Name: archive_policies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.archive_policies_id_seq OWNED BY public.archive_policies.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    user_id integer,
    action character varying(100) NOT NULL,
    entity_type character varying(50),
    entity_id integer,
    details jsonb,
    ip_address character varying(45),
    user_agent text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.audit_logs OWNER TO neondb_owner;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO neondb_owner;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: encryption_keys; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.encryption_keys (
    id integer NOT NULL,
    key_id character varying(255) NOT NULL,
    encrypted_key text NOT NULL,
    key_type character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    rotated_at timestamp with time zone,
    expires_at timestamp with time zone,
    is_active boolean DEFAULT true
);


ALTER TABLE public.encryption_keys OWNER TO neondb_owner;

--
-- Name: encryption_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.encryption_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.encryption_keys_id_seq OWNER TO neondb_owner;

--
-- Name: encryption_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.encryption_keys_id_seq OWNED BY public.encryption_keys.id;


--
-- Name: feature_flag_audits; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.feature_flag_audits (
    id integer NOT NULL,
    feature_id integer,
    admin_id integer,
    action character varying(50),
    previous_status boolean,
    new_status boolean,
    reason text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.feature_flag_audits OWNER TO neondb_owner;

--
-- Name: feature_flag_audits_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.feature_flag_audits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.feature_flag_audits_id_seq OWNER TO neondb_owner;

--
-- Name: feature_flag_audits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.feature_flag_audits_id_seq OWNED BY public.feature_flag_audits.id;


--
-- Name: feature_flags; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.feature_flags (
    id integer NOT NULL,
    feature_name character varying(100) NOT NULL,
    feature_key character varying(100) NOT NULL,
    description text,
    is_enabled boolean DEFAULT false,
    category character varying(50),
    requires_erp boolean DEFAULT false,
    requires_payment boolean DEFAULT false,
    requires_websocket boolean DEFAULT false,
    enabled_at timestamp with time zone,
    disabled_at timestamp with time zone,
    created_by integer,
    updated_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.feature_flags OWNER TO neondb_owner;

--
-- Name: feature_flags_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.feature_flags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.feature_flags_id_seq OWNER TO neondb_owner;

--
-- Name: feature_flags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.feature_flags_id_seq OWNED BY public.feature_flags.id;


--
-- Name: inquiry_responses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.inquiry_responses (
    id integer NOT NULL,
    inquiry_id integer NOT NULL,
    tender_id integer NOT NULL,
    response_text text NOT NULL,
    attachments jsonb DEFAULT '[]'::jsonb,
    answered_by integer,
    answered_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_public boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.inquiry_responses OWNER TO neondb_owner;

--
-- Name: inquiry_responses_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.inquiry_responses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inquiry_responses_id_seq OWNER TO neondb_owner;

--
-- Name: inquiry_responses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.inquiry_responses_id_seq OWNED BY public.inquiry_responses.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    invoice_number character varying(50) NOT NULL,
    po_id integer,
    supplier_id integer,
    buyer_id integer,
    amount numeric(15,2),
    tax_amount numeric(15,2),
    total_amount numeric(15,2) NOT NULL,
    currency character varying(3) DEFAULT 'TND'::character varying,
    status character varying(20) DEFAULT 'pending'::character varying,
    issue_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    due_date timestamp with time zone,
    payment_date timestamp with time zone,
    attachments jsonb,
    notes text,
    is_archived boolean DEFAULT false,
    archived_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    updated_by integer,
    is_deleted boolean DEFAULT false,
    CONSTRAINT check_invoice_amount_positive CHECK ((amount > (0)::numeric))
);


ALTER TABLE public.invoices OWNER TO neondb_owner;

--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoices_id_seq OWNER TO neondb_owner;

--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sender_id integer,
    receiver_id integer,
    related_entity_type character varying(50),
    related_entity_id integer,
    subject character varying(255),
    content text,
    is_read boolean DEFAULT false,
    attachments jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.messages OWNER TO neondb_owner;

--
-- Name: mfa_codes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.mfa_codes (
    id integer NOT NULL,
    user_id integer,
    code character varying(6) NOT NULL,
    purpose character varying(50) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    is_used boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mfa_codes OWNER TO neondb_owner;

--
-- Name: mfa_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.mfa_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mfa_codes_id_seq OWNER TO neondb_owner;

--
-- Name: mfa_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.mfa_codes_id_seq OWNED BY public.mfa_codes.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer,
    type character varying(50),
    title character varying(255),
    message text,
    is_read boolean DEFAULT false,
    related_entity_type character varying(50),
    related_entity_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO neondb_owner;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO neondb_owner;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: offers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.offers (
    id integer NOT NULL,
    tender_id integer,
    supplier_id integer,
    offer_number character varying(50) NOT NULL,
    total_amount numeric(15,2),
    currency character varying(3) DEFAULT 'TND'::character varying,
    delivery_time character varying(100),
    payment_terms text,
    technical_proposal text,
    financial_proposal text,
    attachments jsonb,
    status character varying(20) DEFAULT 'submitted'::character varying,
    evaluation_score numeric(5,2),
    evaluation_notes text,
    submitted_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_winner boolean DEFAULT false,
    encrypted_data text,
    decryption_key_id character varying(255),
    encryption_iv character varying(255),
    is_archived boolean DEFAULT false,
    archived_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    updated_by integer,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.offers OWNER TO neondb_owner;

--
-- Name: offers_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.offers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.offers_id_seq OWNER TO neondb_owner;

--
-- Name: offers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.offers_id_seq OWNED BY public.offers.id;


--
-- Name: opening_reports; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.opening_reports (
    id integer NOT NULL,
    tender_id integer NOT NULL,
    opened_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    opened_by integer,
    total_offers_received integer DEFAULT 0,
    total_valid_offers integer DEFAULT 0,
    total_invalid_offers integer DEFAULT 0,
    offers_data jsonb DEFAULT '[]'::jsonb,
    status character varying(20) DEFAULT 'open'::character varying,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.opening_reports OWNER TO neondb_owner;

--
-- Name: opening_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.opening_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.opening_reports_id_seq OWNER TO neondb_owner;

--
-- Name: opening_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.opening_reports_id_seq OWNED BY public.opening_reports.id;


--
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.purchase_orders (
    id integer NOT NULL,
    po_number character varying(50) NOT NULL,
    tender_id integer,
    offer_id integer,
    supplier_id integer,
    buyer_id integer,
    total_amount numeric(15,2),
    currency character varying(3) DEFAULT 'TND'::character varying,
    status character varying(20) DEFAULT 'pending'::character varying,
    issue_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    delivery_date timestamp with time zone,
    payment_terms text,
    terms_and_conditions text,
    items jsonb,
    attachments jsonb,
    notes text,
    is_archived boolean DEFAULT false,
    archived_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    updated_by integer,
    is_deleted boolean DEFAULT false,
    CONSTRAINT check_po_amount_positive CHECK ((total_amount > (0)::numeric))
);


ALTER TABLE public.purchase_orders OWNER TO neondb_owner;

--
-- Name: purchase_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.purchase_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_orders_id_seq OWNER TO neondb_owner;

--
-- Name: purchase_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.purchase_orders_id_seq OWNED BY public.purchase_orders.id;


--
-- Name: purchase_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.purchase_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    buyer_id integer,
    supplier_id integer,
    title character varying(255) NOT NULL,
    description text,
    category character varying(100),
    quantity integer,
    unit character varying(50),
    budget numeric(15,2) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_budget_positive CHECK ((budget > (0)::numeric)),
    CONSTRAINT check_quantity_positive CHECK ((quantity > 0))
);


ALTER TABLE public.purchase_requests OWNER TO neondb_owner;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    reviewer_id integer,
    reviewed_user_id integer,
    tender_id integer,
    rating integer NOT NULL,
    comment text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO neondb_owner;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO neondb_owner;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.subscription_plans (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'TND'::character varying,
    duration_days integer NOT NULL,
    features jsonb,
    max_tenders integer,
    max_offers integer,
    max_products integer DEFAULT 50,
    storage_limit integer DEFAULT 5,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.subscription_plans OWNER TO neondb_owner;

--
-- Name: subscription_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.subscription_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subscription_plans_id_seq OWNER TO neondb_owner;

--
-- Name: subscription_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.subscription_plans_id_seq OWNED BY public.subscription_plans.id;


--
-- Name: supplier_features; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.supplier_features (
    id integer NOT NULL,
    supplier_id integer NOT NULL,
    feature_key character varying(100) NOT NULL,
    feature_name character varying(255),
    category character varying(50),
    is_enabled boolean DEFAULT false,
    enabled_by integer,
    reason text,
    enabled_at timestamp with time zone,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.supplier_features OWNER TO neondb_owner;

--
-- Name: supplier_features_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.supplier_features_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supplier_features_id_seq OWNER TO neondb_owner;

--
-- Name: supplier_features_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.supplier_features_id_seq OWNED BY public.supplier_features.id;


--
-- Name: supplier_verifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.supplier_verifications (
    id integer NOT NULL,
    user_id integer,
    company_registration character varying(100) NOT NULL,
    tax_id character varying(50),
    verification_document jsonb,
    verification_status character varying(20) DEFAULT 'pending'::character varying,
    verified_at timestamp with time zone,
    verified_by integer,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.supplier_verifications OWNER TO neondb_owner;

--
-- Name: supplier_verifications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.supplier_verifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supplier_verifications_id_seq OWNER TO neondb_owner;

--
-- Name: supplier_verifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.supplier_verifications_id_seq OWNED BY public.supplier_verifications.id;


--
-- Name: tender_award_line_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tender_award_line_items (
    id integer NOT NULL,
    tender_id integer,
    line_item_id character varying(50) NOT NULL,
    item_description text NOT NULL,
    total_quantity numeric(15,2) NOT NULL,
    unit character varying(50),
    awarded_offers jsonb DEFAULT '[]'::jsonb,
    status character varying(20) DEFAULT 'pending'::character varying,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    updated_by integer
);


ALTER TABLE public.tender_award_line_items OWNER TO neondb_owner;

--
-- Name: tender_award_line_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.tender_award_line_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tender_award_line_items_id_seq OWNER TO neondb_owner;

--
-- Name: tender_award_line_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.tender_award_line_items_id_seq OWNED BY public.tender_award_line_items.id;


--
-- Name: tender_history; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tender_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tender_id integer,
    user_id integer,
    action character varying(100) NOT NULL,
    previous_state character varying(50),
    new_state character varying(50),
    metadata jsonb,
    ip_address character varying(45),
    user_agent text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tender_history OWNER TO neondb_owner;

--
-- Name: tender_inquiries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tender_inquiries (
    id integer NOT NULL,
    tender_id integer NOT NULL,
    supplier_id integer NOT NULL,
    subject character varying(255) NOT NULL,
    inquiry_text text NOT NULL,
    attachments jsonb DEFAULT '[]'::jsonb,
    status character varying(20) DEFAULT 'pending'::character varying,
    submitted_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.tender_inquiries OWNER TO neondb_owner;

--
-- Name: tender_inquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.tender_inquiries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tender_inquiries_id_seq OWNER TO neondb_owner;

--
-- Name: tender_inquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.tender_inquiries_id_seq OWNED BY public.tender_inquiries.id;


--
-- Name: tenders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tenders (
    id integer NOT NULL,
    tender_number character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    category character varying(100),
    budget_min numeric(15,2),
    budget_max numeric(15,2),
    currency character varying(3) DEFAULT 'TND'::character varying,
    status character varying(20) DEFAULT 'draft'::character varying,
    publish_date timestamp with time zone,
    deadline timestamp with time zone,
    opening_date timestamp with time zone,
    requirements jsonb,
    attachments jsonb,
    buyer_id integer,
    is_public boolean DEFAULT true,
    evaluation_criteria jsonb,
    first_offer_at timestamp with time zone,
    is_archived boolean DEFAULT false,
    archived_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    updated_by integer,
    is_deleted boolean DEFAULT false,
    lots jsonb DEFAULT '[]'::jsonb,
    participation_eligibility text,
    mandatory_documents jsonb DEFAULT '[]'::jsonb,
    disqualification_criteria text,
    submission_method character varying(50),
    sealed_envelope_requirements text,
    contact_person character varying(255),
    contact_email character varying(255),
    contact_phone character varying(20),
    technical_specifications text,
    queries_start_date timestamp with time zone,
    queries_end_date timestamp with time zone,
    offer_validity_days integer DEFAULT 90,
    alert_type character varying(50) DEFAULT 'before_48h'::character varying,
    CONSTRAINT check_budget_min_max CHECK ((budget_min <= budget_max))
);


ALTER TABLE public.tenders OWNER TO neondb_owner;

--
-- Name: tenders_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.tenders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tenders_id_seq OWNER TO neondb_owner;

--
-- Name: tenders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.tenders_id_seq OWNED BY public.tenders.id;


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_profiles (
    id integer NOT NULL,
    user_id integer,
    bio text,
    profile_picture character varying(255),
    address text,
    city character varying(100),
    country character varying(100),
    postal_code character varying(20),
    tax_id character varying(50),
    rating numeric(3,2) DEFAULT 0,
    total_reviews integer DEFAULT 0,
    preferences jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_profiles OWNER TO neondb_owner;

--
-- Name: user_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_profiles_id_seq OWNER TO neondb_owner;

--
-- Name: user_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_profiles_id_seq OWNED BY public.user_profiles.id;


--
-- Name: user_subscriptions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_subscriptions (
    id integer NOT NULL,
    user_id integer,
    plan_id integer,
    start_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    end_date timestamp with time zone,
    status character varying(20) DEFAULT 'active'::character varying,
    payment_method character varying(50),
    transaction_id character varying(255),
    auto_renew boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_subscriptions OWNER TO neondb_owner;

--
-- Name: user_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_subscriptions_id_seq OWNER TO neondb_owner;

--
-- Name: user_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_subscriptions_id_seq OWNED BY public.user_subscriptions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    password_salt character varying(255) NOT NULL,
    full_name character varying(100),
    phone character varying(20),
    role character varying(20) DEFAULT 'viewer'::character varying,
    company_name character varying(200),
    company_registration character varying(100),
    is_verified boolean DEFAULT false,
    is_active boolean DEFAULT true,
    last_login timestamp with time zone,
    mfa_enabled boolean DEFAULT false,
    mfa_secret character varying(255),
    mfa_backup_codes jsonb,
    average_rating numeric(3,2) DEFAULT 0,
    preferred_categories jsonb DEFAULT '[]'::jsonb,
    service_locations jsonb DEFAULT '[]'::jsonb,
    minimum_budget numeric(15,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    updated_by integer,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: addenda id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addenda ALTER COLUMN id SET DEFAULT nextval('public.addenda_id_seq'::regclass);


--
-- Name: addendum_notifications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addendum_notifications ALTER COLUMN id SET DEFAULT nextval('public.addendum_notifications_id_seq'::regclass);


--
-- Name: archive_policies id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.archive_policies ALTER COLUMN id SET DEFAULT nextval('public.archive_policies_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: encryption_keys id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.encryption_keys ALTER COLUMN id SET DEFAULT nextval('public.encryption_keys_id_seq'::regclass);


--
-- Name: feature_flag_audits id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feature_flag_audits ALTER COLUMN id SET DEFAULT nextval('public.feature_flag_audits_id_seq'::regclass);


--
-- Name: feature_flags id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feature_flags ALTER COLUMN id SET DEFAULT nextval('public.feature_flags_id_seq'::regclass);


--
-- Name: inquiry_responses id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inquiry_responses ALTER COLUMN id SET DEFAULT nextval('public.inquiry_responses_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: mfa_codes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mfa_codes ALTER COLUMN id SET DEFAULT nextval('public.mfa_codes_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: offers id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.offers ALTER COLUMN id SET DEFAULT nextval('public.offers_id_seq'::regclass);


--
-- Name: opening_reports id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.opening_reports ALTER COLUMN id SET DEFAULT nextval('public.opening_reports_id_seq'::regclass);


--
-- Name: purchase_orders id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_orders ALTER COLUMN id SET DEFAULT nextval('public.purchase_orders_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: subscription_plans id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subscription_plans ALTER COLUMN id SET DEFAULT nextval('public.subscription_plans_id_seq'::regclass);


--
-- Name: supplier_features id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.supplier_features ALTER COLUMN id SET DEFAULT nextval('public.supplier_features_id_seq'::regclass);


--
-- Name: supplier_verifications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.supplier_verifications ALTER COLUMN id SET DEFAULT nextval('public.supplier_verifications_id_seq'::regclass);


--
-- Name: tender_award_line_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tender_award_line_items ALTER COLUMN id SET DEFAULT nextval('public.tender_award_line_items_id_seq'::regclass);


--
-- Name: tender_inquiries id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tender_inquiries ALTER COLUMN id SET DEFAULT nextval('public.tender_inquiries_id_seq'::regclass);


--
-- Name: tenders id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tenders ALTER COLUMN id SET DEFAULT nextval('public.tenders_id_seq'::regclass);


--
-- Name: user_profiles id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_profiles ALTER COLUMN id SET DEFAULT nextval('public.user_profiles_id_seq'::regclass);


--
-- Name: user_subscriptions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.user_subscriptions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: addenda; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.addenda (id, tender_id, addendum_number, title, content, inquiry_responses, published_at, published_by, document_url, version, created_at, updated_at, is_deleted) FROM stdin;
\.


--
-- Data for Name: addendum_notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.addendum_notifications (id, addendum_id, user_id, sent_at, read_at, notification_method, created_at) FROM stdin;
\.


--
-- Data for Name: archive_policies; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.archive_policies (id, entity_type, retention_days, archive_action, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.audit_logs (id, user_id, action, entity_type, entity_id, details, ip_address, user_agent, created_at) FROM stdin;
1	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 16:49:52.159781+00
2	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 16:50:18.687715+00
3	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 16:54:00.949369+00
4	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 17:05:29.81331+00
5	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 17:05:30.688667+00
6	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 17:05:48.041774+00
7	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 17:05:48.768049+00
8	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 17:05:58.167436+00
9	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 17:05:58.926254+00
10	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 17:18:49.676139+00
11	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 17:18:50.374669+00
12	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 17:18:58.05581+00
13	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 17:18:58.798015+00
14	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 17:18:59.795662+00
15	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 17:19:00.666725+00
16	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 18:32:48.642335+00
17	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 18:32:49.49077+00
18	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:13:15.536455+00
19	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:13:16.414929+00
20	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:14:19.016932+00
21	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:14:19.858653+00
22	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:14:31.592273+00
23	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:14:32.307561+00
24	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:14:55.385213+00
25	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:14:56.22839+00
26	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:19:22.514836+00
27	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:19:23.299098+00
28	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:35:33.803446+00
29	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:35:35.241343+00
30	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:41:43.699065+00
31	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:41:44.827673+00
32	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:43:01.522033+00
33	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:43:02.597346+00
34	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:49:36.466473+00
35	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:49:36.997727+00
36	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 19:55:41.916747+00
37	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 19:55:42.198834+00
38	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 19:55:43.440382+00
39	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 19:55:53.321541+00
40	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 19:55:53.936018+00
41	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 19:56:03.545348+00
42	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 19:56:12.922629+00
43	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 19:57:51.618666+00
44	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 20:04:09.7466+00
45	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 20:04:10.709134+00
46	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 20:09:11.861413+00
47	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 20:25:06.428875+00
48	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 20:25:07.210795+00
49	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 20:25:21.892704+00
50	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 20:26:23.528556+00
51	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 20:29:11.99384+00
52	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 20:29:13.691197+00
53	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 20:31:01.560823+00
54	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-22 20:31:02.566849+00
55	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 20:36:01.959518+00
56	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 20:36:24.565065+00
57	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 20:39:02.976295+00
58	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 20:39:29.412258+00
59	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 20:54:39.02849+00
60	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 20:55:04.1883+00
61	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 20:55:04.770725+00
62	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 22:32:19.310895+00
63	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 22:32:19.741601+00
64	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 23:01:39.567239+00
65	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 23:01:40.009789+00
66	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 23:13:43.177034+00
67	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 23:13:43.617115+00
68	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 23:19:01.424426+00
69	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 23:19:01.878595+00
70	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 23:19:32.070349+00
71	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 23:19:32.981861+00
72	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 23:19:35.760173+00
73	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 23:19:36.260476+00
74	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 23:26:32.741178+00
75	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 23:26:33.169436+00
76	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 23:45:06.235763+00
77	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 23:45:06.685574+00
78	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 23:54:20.222587+00
79	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 23:54:20.667963+00
80	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 23:56:44.530347+00
81	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-22 23:56:44.95197+00
82	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 00:01:25.277469+00
83	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 00:01:25.728987+00
84	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 00:08:50.4317+00
85	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 00:08:50.930232+00
86	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 00:09:11.379431+00
87	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 00:09:11.801618+00
88	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 00:09:16.578429+00
89	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 00:09:16.998871+00
90	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 00:34:09.037227+00
91	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 00:34:09.536012+00
92	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 00:38:01.03402+00
93	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 00:38:01.477903+00
94	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 01:00:08.41172+00
95	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 01:00:08.885885+00
96	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 01:50:46.749032+00
97	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 01:50:47.200268+00
98	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 01:51:45.937754+00
99	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 01:51:46.376936+00
100	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 01:57:00.398632+00
101	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 01:57:00.848282+00
102	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 02:01:34.384144+00
103	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 02:01:34.808419+00
104	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 02:21:10.067035+00
105	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 02:21:10.519007+00
106	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 05:07:42.618236+00
107	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 05:07:43.054329+00
108	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 05:15:15.278296+00
109	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 05:15:15.716399+00
110	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 05:16:51.398962+00
111	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 05:16:51.818789+00
112	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 05:19:07.71502+00
113	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 05:19:08.147845+00
114	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 05:37:29.698049+00
115	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 05:37:30.136549+00
116	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 05:38:31.502002+00
117	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 05:38:31.934751+00
118	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 09:43:39.79151+00
119	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 09:43:40.219256+00
120	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 09:48:14.167077+00
121	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 09:48:14.601957+00
122	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 09:52:15.738237+00
123	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 09:52:16.191288+00
124	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 09:58:44.631833+00
125	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 09:58:45.078133+00
126	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 10:01:23.130128+00
127	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 10:01:23.549616+00
128	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 10:03:13.828452+00
129	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 10:03:14.266354+00
130	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 10:08:22.385265+00
131	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 10:08:22.938687+00
132	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 12:37:21.463282+00
133	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 13:03:10.225093+00
134	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 13:06:25.853789+00
135	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 13:06:30.287285+00
136	2	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-23 13:08:40.140213+00
137	2	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-23 13:08:45.100436+00
138	2	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-23 13:08:50.426873+00
139	2	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-23 13:08:54.099047+00
140	2	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-23 13:09:01.556632+00
141	2	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-23 13:09:05.836505+00
142	2	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-23 13:09:09.159455+00
143	2	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-23 13:11:32.509629+00
144	\N	read	tender	\N	{"message": "Failed to get tenders: terminating connection due to administrator command"}	\N	\N	2025-11-23 13:13:30.688126+00
145	\N	read	tender	\N	{"message": "All tenders fetched with filters"}	\N	\N	2025-11-23 13:13:47.545306+00
146	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 13:16:22.250456+00
147	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 13:30:00.831048+00
148	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 13:42:32.969344+00
149	2	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 13:53:55.503663+00
150	2	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-23 13:56:05.948938+00
151	2	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-23 13:56:15.73687+00
152	2	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-23 13:56:18.791625+00
153	3	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 16:07:30.559823+00
154	3	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 16:16:26.266979+00
155	3	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 16:23:29.15445+00
156	3	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 16:28:43.627433+00
157	3	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 16:37:59.491069+00
158	3	read	tender	\N	{"message": "My tenders fetched"}	\N	\N	2025-11-23 16:48:43.446152+00
159	3	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-24 23:48:49.781966+00
160	3	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-24 23:53:56.700246+00
161	3	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-24 23:53:59.591347+00
162	3	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-24 23:54:02.568061+00
163	3	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-24 23:54:04.846965+00
164	3	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-24 23:54:07.068048+00
165	3	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-24 23:54:09.267309+00
166	3	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-24 23:54:11.684569+00
167	3	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-24 23:55:38.251266+00
168	3	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-24 23:55:40.601032+00
169	3	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-24 23:55:43.09999+00
170	3	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-25 00:00:43.352263+00
171	3	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-25 00:00:46.736617+00
172	3	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-25 00:00:54.351836+00
173	3	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-25 00:01:13.209149+00
174	3	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-25 00:03:22.113896+00
175	3	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-25 00:14:36.198732+00
176	3	create	tender	\N	{"message": "Failed to create tender: INSERT has more expressions than target columns"}	\N	\N	2025-11-25 00:25:29.138402+00
177	3	create	tender	6	{"message": "Tender created successfully"}	\N	\N	2025-11-25 00:29:24.466035+00
\.


--
-- Data for Name: encryption_keys; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.encryption_keys (id, key_id, encrypted_key, key_type, created_at, rotated_at, expires_at, is_active) FROM stdin;
\.


--
-- Data for Name: feature_flag_audits; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.feature_flag_audits (id, feature_id, admin_id, action, previous_status, new_status, reason, created_at) FROM stdin;
\.


--
-- Data for Name: feature_flags; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.feature_flags (id, feature_name, feature_key, description, is_enabled, category, requires_erp, requires_payment, requires_websocket, enabled_at, disabled_at, created_by, updated_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: inquiry_responses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.inquiry_responses (id, inquiry_id, tender_id, response_text, attachments, answered_by, answered_at, is_public, created_at, updated_at, is_deleted) FROM stdin;
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.invoices (id, invoice_number, po_id, supplier_id, buyer_id, amount, tax_amount, total_amount, currency, status, issue_date, due_date, payment_date, attachments, notes, is_archived, archived_at, created_at, updated_at, created_by, updated_by, is_deleted) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.messages (id, sender_id, receiver_id, related_entity_type, related_entity_id, subject, content, is_read, attachments, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_codes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.mfa_codes (id, user_id, code, purpose, expires_at, is_used, created_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notifications (id, user_id, type, title, message, is_read, related_entity_type, related_entity_id, created_at) FROM stdin;
\.


--
-- Data for Name: offers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.offers (id, tender_id, supplier_id, offer_number, total_amount, currency, delivery_time, payment_terms, technical_proposal, financial_proposal, attachments, status, evaluation_score, evaluation_notes, submitted_at, is_winner, encrypted_data, decryption_key_id, encryption_iv, is_archived, archived_at, created_at, updated_at, created_by, updated_by, is_deleted) FROM stdin;
1	1	4	OFFER-1763830160566-1-0	19176.17	TND	30 days	Net 30	\N	\N	\N	submitted	\N	\N	2025-11-22 16:49:20.620541+00	f	\N	\N	\N	f	\N	2025-11-22 16:49:20.620541+00	2025-11-22 16:49:20.620541+00	\N	\N	f
2	1	5	OFFER-1763830160695-1-1	29967.04	TND	30 days	Net 30	\N	\N	\N	submitted	\N	\N	2025-11-22 16:49:20.74936+00	f	\N	\N	\N	f	\N	2025-11-22 16:49:20.74936+00	2025-11-22 16:49:20.74936+00	\N	\N	f
3	2	4	OFFER-1763830160807-2-0	24650.97	TND	30 days	Net 30	\N	\N	\N	submitted	\N	\N	2025-11-22 16:49:20.860918+00	f	\N	\N	\N	f	\N	2025-11-22 16:49:20.860918+00	2025-11-22 16:49:20.860918+00	\N	\N	f
4	2	5	OFFER-1763830160919-2-1	24485.08	TND	30 days	Net 30	\N	\N	\N	submitted	\N	\N	2025-11-22 16:49:20.972871+00	f	\N	\N	\N	f	\N	2025-11-22 16:49:20.972871+00	2025-11-22 16:49:20.972871+00	\N	\N	f
5	3	4	OFFER-1763830161031-3-0	18147.58	TND	30 days	Net 30	\N	\N	\N	submitted	\N	\N	2025-11-22 16:49:21.084621+00	f	\N	\N	\N	f	\N	2025-11-22 16:49:21.084621+00	2025-11-22 16:49:21.084621+00	\N	\N	f
6	3	5	OFFER-1763830161142-3-1	16366.37	TND	30 days	Net 30	\N	\N	\N	submitted	\N	\N	2025-11-22 16:49:21.196303+00	f	\N	\N	\N	f	\N	2025-11-22 16:49:21.196303+00	2025-11-22 16:49:21.196303+00	\N	\N	f
7	4	4	OFFER-1763830161254-4-0	27688.67	TND	30 days	Net 30	\N	\N	\N	submitted	\N	\N	2025-11-22 16:49:21.308302+00	f	\N	\N	\N	f	\N	2025-11-22 16:49:21.308302+00	2025-11-22 16:49:21.308302+00	\N	\N	f
8	4	5	OFFER-1763830161366-4-1	16118.03	TND	30 days	Net 30	\N	\N	\N	submitted	\N	\N	2025-11-22 16:49:21.419908+00	f	\N	\N	\N	f	\N	2025-11-22 16:49:21.419908+00	2025-11-22 16:49:21.419908+00	\N	\N	f
9	5	4	OFFER-1763830161478-5-0	28906.08	TND	30 days	Net 30	\N	\N	\N	submitted	\N	\N	2025-11-22 16:49:21.53248+00	f	\N	\N	\N	f	\N	2025-11-22 16:49:21.53248+00	2025-11-22 16:49:21.53248+00	\N	\N	f
10	5	5	OFFER-1763830161590-5-1	15581.76	TND	30 days	Net 30	\N	\N	\N	submitted	\N	\N	2025-11-22 16:49:21.644243+00	f	\N	\N	\N	f	\N	2025-11-22 16:49:21.644243+00	2025-11-22 16:49:21.644243+00	\N	\N	f
\.


--
-- Data for Name: opening_reports; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.opening_reports (id, tender_id, opened_at, opened_by, total_offers_received, total_valid_offers, total_invalid_offers, offers_data, status, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.purchase_orders (id, po_number, tender_id, offer_id, supplier_id, buyer_id, total_amount, currency, status, issue_date, delivery_date, payment_terms, terms_and_conditions, items, attachments, notes, is_archived, archived_at, created_at, updated_at, created_by, updated_by, is_deleted) FROM stdin;
\.


--
-- Data for Name: purchase_requests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.purchase_requests (id, buyer_id, supplier_id, title, description, category, quantity, unit, budget, status, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.reviews (id, reviewer_id, reviewed_user_id, tender_id, rating, comment, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.subscription_plans (id, name, description, price, currency, duration_days, features, max_tenders, max_offers, max_products, storage_limit, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: supplier_features; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.supplier_features (id, supplier_id, feature_key, feature_name, category, is_enabled, enabled_by, reason, enabled_at, expires_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: supplier_verifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.supplier_verifications (id, user_id, company_registration, tax_id, verification_document, verification_status, verified_at, verified_by, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tender_award_line_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.tender_award_line_items (id, tender_id, line_item_id, item_description, total_quantity, unit, awarded_offers, status, notes, created_at, updated_at, created_by, updated_by) FROM stdin;
\.


--
-- Data for Name: tender_history; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.tender_history (id, tender_id, user_id, action, previous_state, new_state, metadata, ip_address, user_agent, created_at) FROM stdin;
ce822c57-7ac9-4dc9-b694-5903c485225b	6	3	created	\N	draft	{"title": "شراء مواد مكتبية"}	\N	\N	2025-11-25 00:29:24.578319+00
\.


--
-- Data for Name: tender_inquiries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.tender_inquiries (id, tender_id, supplier_id, subject, inquiry_text, attachments, status, submitted_at, created_at, updated_at, is_deleted) FROM stdin;
\.


--
-- Data for Name: tenders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.tenders (id, tender_number, title, description, category, budget_min, budget_max, currency, status, publish_date, deadline, opening_date, requirements, attachments, buyer_id, is_public, evaluation_criteria, first_offer_at, is_archived, archived_at, created_at, updated_at, created_by, updated_by, is_deleted, lots, participation_eligibility, mandatory_documents, disqualification_criteria, submission_method, sealed_envelope_requirements, contact_person, contact_email, contact_phone, technical_specifications, queries_start_date, queries_end_date, offer_validity_days, alert_type) FROM stdin;
1	TEND-1763830159748-0	Office Supplies Procurement	Buy office supplies for Q1 2025	Supplies	5000.00	15000.00	TND	open	\N	\N	\N	\N	\N	2	t	\N	\N	f	\N	2025-11-22 16:49:19.802467+00	2025-11-22 16:49:19.802467+00	\N	\N	f	[]	\N	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N	90	before_48h
2	TEND-1763830159896-1	IT Equipment Purchase	Buy laptops and servers	IT	50000.00	100000.00	TND	open	\N	\N	\N	\N	\N	2	t	\N	\N	f	\N	2025-11-22 16:49:19.950546+00	2025-11-22 16:49:19.950546+00	\N	\N	f	[]	\N	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N	90	before_48h
3	TEND-1763830160008-2	Cleaning Services	Weekly cleaning services	Services	2000.00	5000.00	TND	open	\N	\N	\N	\N	\N	2	t	\N	\N	f	\N	2025-11-22 16:49:20.062334+00	2025-11-22 16:49:20.062334+00	\N	\N	f	[]	\N	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N	90	before_48h
4	TEND-1763830160121-3	Marketing Campaign	Digital marketing services	Marketing	25000.00	50000.00	TND	open	\N	\N	\N	\N	\N	2	t	\N	\N	f	\N	2025-11-22 16:49:20.174872+00	2025-11-22 16:49:20.174872+00	\N	\N	f	[]	\N	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N	90	before_48h
5	TEND-1763830160233-4	Transportation Services	Employee transportation	Transport	10000.00	20000.00	TND	open	\N	\N	\N	\N	\N	2	t	\N	\N	f	\N	2025-11-22 16:49:20.286606+00	2025-11-22 16:49:20.286606+00	\N	\N	f	[]	\N	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N	90	before_48h
6	TND-20251125-721525F9	شراء مواد مكتبية	شراء مواد مكتبية شراء مواد مكتبية	supplies	100.00	120.00	TND	draft	2025-10-25 01:00:00+00	2025-11-29 17:29:00+00	2025-11-30 17:29:00+00	[{"text": "ازرق", "type": "technical", "priority": "desirable"}]	[]	3	t	{"price": 30, "quality": 40, "delivery": 20, "experience": 10}	\N	f	\N	2025-11-25 00:29:24.346107+00	2025-11-25 00:29:24.346107+00	3	\N	f	[{"objet": "informatique", "numero": "informatique", "articles": [{"name": "ordinateur", "unit": "pièce", "quantity": "05"}, {"name": "imprimante", "unit": "pièce", "quantity": "02"}]}, {"objet": "bureautique", "numero": "bureautique", "articles": [{"name": "stylo bleu", "unit": "pièce", "quantity": "20"}]}]		[]		electronic		marwen marwen	toietimarwen@hotmail.fr	58275216		\N	\N	90	before_48h
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_profiles (id, user_id, bio, profile_picture, address, city, country, postal_code, tax_id, rating, total_reviews, preferences, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_subscriptions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_subscriptions (id, user_id, plan_id, start_date, end_date, status, payment_method, transaction_id, auto_renew, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, email, password_hash, password_salt, full_name, phone, role, company_name, company_registration, is_verified, is_active, last_login, mfa_enabled, mfa_secret, mfa_backup_codes, average_rating, preferred_categories, service_locations, minimum_budget, created_at, updated_at, created_by, updated_by, is_deleted) FROM stdin;
3	buyer2	buyer2@test.tn	5ac381ad05168b86b38eb202470ee69473d2027953279991196651572951eb631c5664a45b94042661bc372b5afc982053751ff23994876c9af96692fe1ea74b	7c68984ccb294d88fb356e4ffb3a2a6e	Buyer Two	\N	buyer	Company B	\N	t	t	2025-11-25 00:37:39.832892+00	f	\N	\N	0.00	[]	[]	0.00	2025-11-22 16:49:19.117383+00	2025-11-22 16:49:19.117383+00	\N	\N	f
5	supplier2	supplier2@test.tn	3cc9fd7ebaa9bdd81669d77619d7fb01c793e17542042aeeab65d1610caa7615b0ee5785d533ae39d1cae9601c9b12d440fe63379c3d17a202b3c2ab3d456ba8	420a877b01b9dc07cbfee197bcdc8315	Supplier Two	\N	supplier	Supply Co B	\N	t	t	\N	f	\N	\N	0.00	[]	[]	0.00	2025-11-22 16:49:19.342545+00	2025-11-22 16:49:19.342545+00	\N	\N	f
6	supplier3	supplier3@test.tn	dcda048fbda8caaa66805de6af3e6e0ed29d8f9c2026c41b295c98160be764686240dfad95195ff5ccf9059765c4ac4628c8975232d9d99fcf83f3b9a8f9f627	ee8c478b8a59328b3969123e83baf6f8	Supplier Three	\N	supplier	Supply Co C	\N	t	t	\N	f	\N	\N	0.00	[]	[]	0.00	2025-11-22 16:49:19.455072+00	2025-11-22 16:49:19.455072+00	\N	\N	f
2	buyer1	buyer1@test.tn	a0b42bb699b636a140b324048a5e1a5c853efb46fd0458a1b46fa7d7df9b55c2438a8da3a1999e6f328bc2e615d6845139c09e059a651c6c818c5ebafad16a15	ad5898d7af1aad53c9a17607c6bdeb7b	Buyer One	\N	buyer	Company A	\N	t	t	2025-11-23 16:27:00.151314+00	f	\N	\N	0.00	[]	[]	0.00	2025-11-22 16:49:18.922883+00	2025-11-22 16:49:18.922883+00	\N	\N	f
4	supplier1	supplier1@test.tn	9ba3ba4633106acd6b5f487a1c5248601b2fa5c36e0263b2cc1211fdb897f1464d80adf14e177f1323e04de59556ee82cc6dddf9737bd2884861670587fc5346	e417f083d31a2a07ff76448f7a38bb30	Supplier One	\N	supplier	Supply Co A	\N	t	t	2025-11-22 20:54:52.058065+00	f	\N	\N	0.00	[]	[]	0.00	2025-11-22 16:49:19.230237+00	2025-11-22 16:49:19.230237+00	\N	\N	f
1	superadmin	superadmin@mynet.tn	05fe287aef9fea75eacb1528d6ade6bb88835892fd631dc89997f219203338127bc4758dbafc195085c83d905f02cf20a0c344d1bd54e565f841f5283a7c62c3	086c7ba0abcd5664d0404487bd97353b	Super Administrator	+216 20 000 000	super_admin	MyNet.tn	ADMIN-001	t	t	2025-11-23 13:03:05.060677+00	f	\N	\N	0.00	[]	[]	0.00	2025-11-22 16:41:19.538626+00	2025-11-22 16:41:19.538626+00	\N	\N	f
7	admin	admin@test.tn	152801d29163c282def9aab47c83bcc17531557d4ef699485ca83da5d9342d63bf4506014282740b1e6038b51905e77b3f499e015457cfcfe1b626872aaa547e	5b3e26d36305366a27bce804fa9ec29a	Admin User	\N	admin	Admin	\N	t	t	2025-11-23 00:00:21.982006+00	f	\N	\N	0.00	[]	[]	0.00	2025-11-22 16:49:19.568115+00	2025-11-22 16:49:19.568115+00	\N	\N	f
\.


--
-- Name: addenda_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.addenda_id_seq', 1, false);


--
-- Name: addendum_notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.addendum_notifications_id_seq', 1, false);


--
-- Name: archive_policies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.archive_policies_id_seq', 1, false);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 177, true);


--
-- Name: encryption_keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.encryption_keys_id_seq', 1, false);


--
-- Name: feature_flag_audits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.feature_flag_audits_id_seq', 1, false);


--
-- Name: feature_flags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.feature_flags_id_seq', 1, false);


--
-- Name: inquiry_responses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.inquiry_responses_id_seq', 1, false);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.invoices_id_seq', 1, false);


--
-- Name: mfa_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.mfa_codes_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: offers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.offers_id_seq', 10, true);


--
-- Name: opening_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.opening_reports_id_seq', 1, false);


--
-- Name: purchase_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.purchase_orders_id_seq', 1, false);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- Name: subscription_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.subscription_plans_id_seq', 1, false);


--
-- Name: supplier_features_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.supplier_features_id_seq', 1, false);


--
-- Name: supplier_verifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.supplier_verifications_id_seq', 1, false);


--
-- Name: tender_award_line_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.tender_award_line_items_id_seq', 1, false);


--
-- Name: tender_inquiries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.tender_inquiries_id_seq', 1, false);


--
-- Name: tenders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.tenders_id_seq', 6, true);


--
-- Name: user_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_profiles_id_seq', 1, false);


--
-- Name: user_subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_subscriptions_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: addenda addenda_addendum_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addenda
    ADD CONSTRAINT addenda_addendum_number_key UNIQUE (addendum_number);


--
-- Name: addenda addenda_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addenda
    ADD CONSTRAINT addenda_pkey PRIMARY KEY (id);


--
-- Name: addendum_notifications addendum_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addendum_notifications
    ADD CONSTRAINT addendum_notifications_pkey PRIMARY KEY (id);


--
-- Name: archive_policies archive_policies_entity_type_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.archive_policies
    ADD CONSTRAINT archive_policies_entity_type_key UNIQUE (entity_type);


--
-- Name: archive_policies archive_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.archive_policies
    ADD CONSTRAINT archive_policies_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: encryption_keys encryption_keys_key_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.encryption_keys
    ADD CONSTRAINT encryption_keys_key_id_key UNIQUE (key_id);


--
-- Name: encryption_keys encryption_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.encryption_keys
    ADD CONSTRAINT encryption_keys_pkey PRIMARY KEY (id);


--
-- Name: feature_flag_audits feature_flag_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feature_flag_audits
    ADD CONSTRAINT feature_flag_audits_pkey PRIMARY KEY (id);


--
-- Name: feature_flags feature_flags_feature_key_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_feature_key_key UNIQUE (feature_key);


--
-- Name: feature_flags feature_flags_feature_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_feature_name_key UNIQUE (feature_name);


--
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- Name: inquiry_responses inquiry_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inquiry_responses
    ADD CONSTRAINT inquiry_responses_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_invoice_number_key UNIQUE (invoice_number);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: mfa_codes mfa_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mfa_codes
    ADD CONSTRAINT mfa_codes_pkey PRIMARY KEY (id);


--
-- Name: mfa_codes mfa_codes_user_id_purpose_is_used_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mfa_codes
    ADD CONSTRAINT mfa_codes_user_id_purpose_is_used_key UNIQUE (user_id, purpose, is_used);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: offers offers_offer_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_offer_number_key UNIQUE (offer_number);


--
-- Name: offers offers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_pkey PRIMARY KEY (id);


--
-- Name: opening_reports opening_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.opening_reports
    ADD CONSTRAINT opening_reports_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_po_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_po_number_key UNIQUE (po_number);


--
-- Name: purchase_requests purchase_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT purchase_requests_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: subscription_plans subscription_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);


--
-- Name: supplier_features supplier_features_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.supplier_features
    ADD CONSTRAINT supplier_features_pkey PRIMARY KEY (id);


--
-- Name: supplier_features supplier_features_supplier_id_feature_key_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.supplier_features
    ADD CONSTRAINT supplier_features_supplier_id_feature_key_key UNIQUE (supplier_id, feature_key);


--
-- Name: supplier_verifications supplier_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.supplier_verifications
    ADD CONSTRAINT supplier_verifications_pkey PRIMARY KEY (id);


--
-- Name: supplier_verifications supplier_verifications_user_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.supplier_verifications
    ADD CONSTRAINT supplier_verifications_user_id_key UNIQUE (user_id);


--
-- Name: tender_award_line_items tender_award_line_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tender_award_line_items
    ADD CONSTRAINT tender_award_line_items_pkey PRIMARY KEY (id);


--
-- Name: tender_award_line_items tender_award_line_items_tender_id_line_item_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tender_award_line_items
    ADD CONSTRAINT tender_award_line_items_tender_id_line_item_id_key UNIQUE (tender_id, line_item_id);


--
-- Name: tender_history tender_history_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tender_history
    ADD CONSTRAINT tender_history_pkey PRIMARY KEY (id);


--
-- Name: tender_inquiries tender_inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tender_inquiries
    ADD CONSTRAINT tender_inquiries_pkey PRIMARY KEY (id);


--
-- Name: tenders tenders_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tenders
    ADD CONSTRAINT tenders_pkey PRIMARY KEY (id);


--
-- Name: tenders tenders_tender_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tenders
    ADD CONSTRAINT tenders_tender_number_key UNIQUE (tender_number);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);


--
-- Name: user_subscriptions user_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_subscriptions
    ADD CONSTRAINT user_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_addenda_number; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_addenda_number ON public.addenda USING btree (addendum_number);


--
-- Name: idx_addenda_tender; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_addenda_tender ON public.addenda USING btree (tender_id);


--
-- Name: idx_addendum_notifications_addendum; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_addendum_notifications_addendum ON public.addendum_notifications USING btree (addendum_id);


--
-- Name: idx_addendum_notifications_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_addendum_notifications_user ON public.addendum_notifications USING btree (user_id);


--
-- Name: idx_audit_entity; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_audit_entity ON public.audit_logs USING btree (entity_type, entity_id);


--
-- Name: idx_audit_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_audit_user ON public.audit_logs USING btree (user_id);


--
-- Name: idx_encryption_keys_active; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_encryption_keys_active ON public.encryption_keys USING btree (is_active);


--
-- Name: idx_feature_flag_audits_feature; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_feature_flag_audits_feature ON public.feature_flag_audits USING btree (feature_id);


--
-- Name: idx_feature_flags_category; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_feature_flags_category ON public.feature_flags USING btree (category);


--
-- Name: idx_feature_flags_enabled; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_feature_flags_enabled ON public.feature_flags USING btree (is_enabled);


--
-- Name: idx_inquiry_responses_inquiry; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_inquiry_responses_inquiry ON public.inquiry_responses USING btree (inquiry_id);


--
-- Name: idx_inquiry_responses_tender; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_inquiry_responses_tender ON public.inquiry_responses USING btree (tender_id);


--
-- Name: idx_invoices_archived; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_invoices_archived ON public.invoices USING btree (is_archived);


--
-- Name: idx_messages_entity; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_messages_entity ON public.messages USING btree (related_entity_type, related_entity_id);


--
-- Name: idx_messages_receiver; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_messages_receiver ON public.messages USING btree (receiver_id);


--
-- Name: idx_messages_sender; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_messages_sender ON public.messages USING btree (sender_id);


--
-- Name: idx_mfa_codes_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_mfa_codes_user ON public.mfa_codes USING btree (user_id);


--
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id);


--
-- Name: idx_offers_archived; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_offers_archived ON public.offers USING btree (is_archived);


--
-- Name: idx_offers_is_winner; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_offers_is_winner ON public.offers USING btree (is_winner);


--
-- Name: idx_offers_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_offers_status ON public.offers USING btree (status);


--
-- Name: idx_offers_submitted_at; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_offers_submitted_at ON public.offers USING btree (submitted_at DESC);


--
-- Name: idx_offers_supplier; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_offers_supplier ON public.offers USING btree (supplier_id);


--
-- Name: idx_offers_supplier_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_offers_supplier_id ON public.offers USING btree (supplier_id);


--
-- Name: idx_offers_tender; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_offers_tender ON public.offers USING btree (tender_id);


--
-- Name: idx_offers_tender_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_offers_tender_id ON public.offers USING btree (tender_id);


--
-- Name: idx_offers_tender_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_offers_tender_status ON public.offers USING btree (tender_id, status);


--
-- Name: idx_offers_tender_supplier; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_offers_tender_supplier ON public.offers USING btree (tender_id, supplier_id);


--
-- Name: idx_opening_reports_opened_at; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_opening_reports_opened_at ON public.opening_reports USING btree (opened_at DESC);


--
-- Name: idx_opening_reports_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_opening_reports_status ON public.opening_reports USING btree (status);


--
-- Name: idx_opening_reports_tender; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_opening_reports_tender ON public.opening_reports USING btree (tender_id);


--
-- Name: idx_po_archived; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_po_archived ON public.purchase_orders USING btree (is_archived);


--
-- Name: idx_po_tender; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_po_tender ON public.purchase_orders USING btree (tender_id);


--
-- Name: idx_purchase_requests_buyer; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_purchase_requests_buyer ON public.purchase_requests USING btree (buyer_id);


--
-- Name: idx_purchase_requests_supplier; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_purchase_requests_supplier ON public.purchase_requests USING btree (supplier_id);


--
-- Name: idx_subscriptions_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_subscriptions_user ON public.user_subscriptions USING btree (user_id);


--
-- Name: idx_supplier_features_enabled; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_supplier_features_enabled ON public.supplier_features USING btree (is_enabled);


--
-- Name: idx_supplier_features_expires; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_supplier_features_expires ON public.supplier_features USING btree (expires_at);


--
-- Name: idx_supplier_features_supplier; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_supplier_features_supplier ON public.supplier_features USING btree (supplier_id);


--
-- Name: idx_supplier_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_supplier_id ON public.offers USING btree (supplier_id);


--
-- Name: idx_supplier_verifications_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_supplier_verifications_status ON public.supplier_verifications USING btree (verification_status);


--
-- Name: idx_supplier_verifications_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_supplier_verifications_user ON public.supplier_verifications USING btree (user_id);


--
-- Name: idx_tender_award_items_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tender_award_items_status ON public.tender_award_line_items USING btree (status);


--
-- Name: idx_tender_award_items_tender; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tender_award_items_tender ON public.tender_award_line_items USING btree (tender_id);


--
-- Name: idx_tender_history_tender; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tender_history_tender ON public.tender_history USING btree (tender_id);


--
-- Name: idx_tender_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tender_id ON public.tenders USING btree (buyer_id);


--
-- Name: idx_tender_inquiries_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tender_inquiries_status ON public.tender_inquiries USING btree (status);


--
-- Name: idx_tender_inquiries_supplier; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tender_inquiries_supplier ON public.tender_inquiries USING btree (supplier_id);


--
-- Name: idx_tender_inquiries_tender; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tender_inquiries_tender ON public.tender_inquiries USING btree (tender_id);


--
-- Name: idx_tenders_archived; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tenders_archived ON public.tenders USING btree (is_archived);


--
-- Name: idx_tenders_buyer; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tenders_buyer ON public.tenders USING btree (buyer_id);


--
-- Name: idx_tenders_buyer_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tenders_buyer_id ON public.tenders USING btree (buyer_id);


--
-- Name: idx_tenders_buyer_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tenders_buyer_status ON public.tenders USING btree (buyer_id, status);


--
-- Name: idx_tenders_created_at; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tenders_created_at ON public.tenders USING btree (created_at DESC);


--
-- Name: idx_tenders_deadline; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tenders_deadline ON public.tenders USING btree (deadline DESC);


--
-- Name: idx_tenders_is_public; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tenders_is_public ON public.tenders USING btree (is_public);


--
-- Name: idx_tenders_not_deleted; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tenders_not_deleted ON public.tenders USING btree (is_deleted) WHERE (is_deleted = false);


--
-- Name: idx_tenders_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tenders_status ON public.tenders USING btree (status);


--
-- Name: idx_user_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_user_id ON public.messages USING btree (sender_id, receiver_id);


--
-- Name: idx_user_profiles_bio; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_user_profiles_bio ON public.user_profiles USING gin (to_tsvector('french'::regconfig, bio));


--
-- Name: idx_user_profiles_city; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_user_profiles_city ON public.user_profiles USING btree (city);


--
-- Name: idx_user_profiles_country; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_user_profiles_country ON public.user_profiles USING btree (country);


--
-- Name: idx_user_profiles_rating; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_user_profiles_rating ON public.user_profiles USING btree (rating DESC);


--
-- Name: idx_user_profiles_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_user_profiles_user ON public.user_profiles USING btree (user_id);


--
-- Name: idx_users_active; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_active ON public.users USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_users_average_rating; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_average_rating ON public.users USING btree (average_rating DESC);


--
-- Name: idx_users_company_name; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_company_name ON public.users USING gin (to_tsvector('french'::regconfig, (company_name)::text));


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_email ON public.users USING btree (email) WHERE ((is_deleted = false) AND (is_active = true));


--
-- Name: idx_users_is_active; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_is_active ON public.users USING btree (is_active);


--
-- Name: idx_users_is_verified; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_is_verified ON public.users USING btree (is_verified);


--
-- Name: idx_users_preferred_categories; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_preferred_categories ON public.users USING gin (preferred_categories);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: idx_users_service_locations; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_service_locations ON public.users USING gin (service_locations);


--
-- Name: addenda addenda_published_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addenda
    ADD CONSTRAINT addenda_published_by_fkey FOREIGN KEY (published_by) REFERENCES public.users(id);


--
-- Name: addenda addenda_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addenda
    ADD CONSTRAINT addenda_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.tenders(id) ON DELETE CASCADE;


--
-- Name: addendum_notifications addendum_notifications_addendum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addendum_notifications
    ADD CONSTRAINT addendum_notifications_addendum_id_fkey FOREIGN KEY (addendum_id) REFERENCES public.addenda(id) ON DELETE CASCADE;


--
-- Name: addendum_notifications addendum_notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addendum_notifications
    ADD CONSTRAINT addendum_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: feature_flag_audits feature_flag_audits_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feature_flag_audits
    ADD CONSTRAINT feature_flag_audits_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(id);


--
-- Name: feature_flag_audits feature_flag_audits_feature_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feature_flag_audits
    ADD CONSTRAINT feature_flag_audits_feature_id_fkey FOREIGN KEY (feature_id) REFERENCES public.feature_flags(id);


--
-- Name: feature_flags feature_flags_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: feature_flags feature_flags_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: offers fk_offers_tender; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT fk_offers_tender FOREIGN KEY (tender_id) REFERENCES public.tenders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchase_orders fk_po_offer; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT fk_po_offer FOREIGN KEY (offer_id) REFERENCES public.offers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: inquiry_responses inquiry_responses_answered_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inquiry_responses
    ADD CONSTRAINT inquiry_responses_answered_by_fkey FOREIGN KEY (answered_by) REFERENCES public.users(id);


--
-- Name: inquiry_responses inquiry_responses_inquiry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inquiry_responses
    ADD CONSTRAINT inquiry_responses_inquiry_id_fkey FOREIGN KEY (inquiry_id) REFERENCES public.tender_inquiries(id) ON DELETE CASCADE;


--
-- Name: inquiry_responses inquiry_responses_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inquiry_responses
    ADD CONSTRAINT inquiry_responses_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.tenders(id) ON DELETE CASCADE;


--
-- Name: invoices invoices_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(id);


--
-- Name: invoices invoices_po_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_po_id_fkey FOREIGN KEY (po_id) REFERENCES public.purchase_orders(id);


--
-- Name: invoices invoices_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.users(id);


--
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id);


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: mfa_codes mfa_codes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mfa_codes
    ADD CONSTRAINT mfa_codes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: offers offers_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.users(id);


--
-- Name: offers offers_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.tenders(id);


--
-- Name: opening_reports opening_reports_opened_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.opening_reports
    ADD CONSTRAINT opening_reports_opened_by_fkey FOREIGN KEY (opened_by) REFERENCES public.users(id);


--
-- Name: opening_reports opening_reports_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.opening_reports
    ADD CONSTRAINT opening_reports_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.tenders(id) ON DELETE CASCADE;


--
-- Name: purchase_orders purchase_orders_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(id);


--
-- Name: purchase_orders purchase_orders_offer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_offer_id_fkey FOREIGN KEY (offer_id) REFERENCES public.offers(id);


--
-- Name: purchase_orders purchase_orders_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.users(id);


--
-- Name: purchase_orders purchase_orders_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.tenders(id);


--
-- Name: purchase_requests purchase_requests_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT purchase_requests_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(id);


--
-- Name: purchase_requests purchase_requests_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT purchase_requests_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.users(id);


--
-- Name: reviews reviews_reviewed_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewed_user_id_fkey FOREIGN KEY (reviewed_user_id) REFERENCES public.users(id);


--
-- Name: reviews reviews_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users(id);


--
-- Name: reviews reviews_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.tenders(id);


--
-- Name: supplier_features supplier_features_enabled_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.supplier_features
    ADD CONSTRAINT supplier_features_enabled_by_fkey FOREIGN KEY (enabled_by) REFERENCES public.users(id);


--
-- Name: supplier_features supplier_features_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.supplier_features
    ADD CONSTRAINT supplier_features_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.users(id);


--
-- Name: supplier_verifications supplier_verifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.supplier_verifications
    ADD CONSTRAINT supplier_verifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: supplier_verifications supplier_verifications_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.supplier_verifications
    ADD CONSTRAINT supplier_verifications_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(id);


--
-- Name: tender_award_line_items tender_award_line_items_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tender_award_line_items
    ADD CONSTRAINT tender_award_line_items_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: tender_award_line_items tender_award_line_items_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tender_award_line_items
    ADD CONSTRAINT tender_award_line_items_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.tenders(id) ON DELETE CASCADE;


--
-- Name: tender_award_line_items tender_award_line_items_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tender_award_line_items
    ADD CONSTRAINT tender_award_line_items_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: tender_history tender_history_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tender_history
    ADD CONSTRAINT tender_history_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.tenders(id);


--
-- Name: tender_history tender_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tender_history
    ADD CONSTRAINT tender_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: tender_inquiries tender_inquiries_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tender_inquiries
    ADD CONSTRAINT tender_inquiries_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.users(id);


--
-- Name: tender_inquiries tender_inquiries_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tender_inquiries
    ADD CONSTRAINT tender_inquiries_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.tenders(id) ON DELETE CASCADE;


--
-- Name: tenders tenders_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tenders
    ADD CONSTRAINT tenders_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(id);


--
-- Name: user_profiles user_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_subscriptions user_subscriptions_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_subscriptions
    ADD CONSTRAINT user_subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);


--
-- Name: user_subscriptions user_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_subscriptions
    ADD CONSTRAINT user_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict vaeFYlNMkyLUpKsGYe0G3QezR1qaaeItUG3WKIjwSO6gzVHKRNxp6QKirwhIhQH

