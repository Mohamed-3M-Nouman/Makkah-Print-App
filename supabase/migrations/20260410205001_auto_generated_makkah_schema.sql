-- ============================================================================
-- Makkah Print Center - Auto-Generated Database Schema
-- Generated from: lib/mockData.ts, lib/pricing-config.ts
-- Date: 2026-04-10
-- ============================================================================

-- ============================================================================
-- 1. CUSTOM ENUMS (derived from TypeScript union types)
-- ============================================================================

-- From: OrderStatus type in mockData.ts
CREATE TYPE public.order_status AS ENUM (
    'pending_review',
    'confirmed',
    'printing',
    'completed',
    'out_for_delivery',
    'delivered'
);

-- From: Order.serviceType in mockData.ts
CREATE TYPE public.service_type AS ENUM (
    'print',
    'stationery',
    'design'
);

-- From: Order.delivery in mockData.ts
CREATE TYPE public.delivery_method AS ENUM (
    'pickup',
    'home'
);

-- From: Order.paymentMethod in mockData.ts
CREATE TYPE public.payment_method AS ENUM (
    'cash',
    'wallet'
);

-- From: OrderItem.type in mockData.ts
CREATE TYPE public.item_type AS ENUM (
    'document',
    'image_batch'
);

-- From: OrderItem.color in mockData.ts
CREATE TYPE public.color_mode AS ENUM (
    'bw',
    'color'
);

-- From: OrderItem.inkType in mockData.ts
CREATE TYPE public.ink_type AS ENUM (
    'laser',
    'inkjet'
);

-- From: OrderItem.sides in mockData.ts
CREATE TYPE public.print_sides AS ENUM (
    'single',
    'double'
);

-- User roles for RLS policies
CREATE TYPE public.user_role AS ENUM (
    'customer',
    'operator',
    'admin'
);


-- ============================================================================
-- 2. PROFILES TABLE (linked to Supabase auth.users)
-- ============================================================================
-- Maps to: Order.customerName, Order.customerPhone, Order.customerEmail

CREATE TABLE public.profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role        public.user_role NOT NULL DEFAULT 'customer',
    full_name   TEXT,
    phone       TEXT,
    email       TEXT,
    avatar_url  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'User profiles linked to Supabase auth. Stores role, name, phone for customers and operators.';


-- ============================================================================
-- 3. ORDERS TABLE
-- ============================================================================
-- Maps to: Order interface in mockData.ts

CREATE TABLE public.orders (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status          public.order_status NOT NULL DEFAULT 'pending_review',
    service_type    public.service_type NOT NULL DEFAULT 'print',
    delivery        public.delivery_method NOT NULL DEFAULT 'pickup',
    payment_method  public.payment_method NOT NULL DEFAULT 'cash',
    total_price     NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    delivery_fee    NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.orders IS 'Print orders placed by customers. Maps directly to the Order interface in the frontend.';
COMMENT ON COLUMN public.orders.delivery_fee IS 'Snapshot of delivery fee at time of order, sourced from pricing_config.';


-- ============================================================================
-- 4. ORDER ITEMS TABLE
-- ============================================================================
-- Maps to: OrderItem interface in mockData.ts

CREATE TABLE public.order_items (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id        BIGINT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    file_names      TEXT[] NOT NULL DEFAULT '{}',       -- Array to support string | string[] from TS
    file_urls       TEXT[] NOT NULL DEFAULT '{}',       -- Supabase Storage URLs for uploaded files
    type            public.item_type NOT NULL DEFAULT 'document',
    page_count      INTEGER NOT NULL DEFAULT 1,
    color           public.color_mode NOT NULL DEFAULT 'bw',
    ink_type        public.ink_type,                     -- nullable, only relevant when color = 'color'
    pages_per_sheet INTEGER NOT NULL DEFAULT 1,
    sides           public.print_sides NOT NULL DEFAULT 'single',
    print_range     TEXT NOT NULL DEFAULT 'الكل',
    quantity        INTEGER NOT NULL DEFAULT 1,
    item_price      NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.order_items IS 'Individual print items within an order. Maps to OrderItem interface.';
COMMENT ON COLUMN public.order_items.file_names IS 'Original file names. Uses TEXT[] to support both single files and image batches.';
COMMENT ON COLUMN public.order_items.file_urls IS 'Supabase Storage download URLs for the uploaded files.';


-- ============================================================================
-- 5. PRICING CONFIG TABLE
-- ============================================================================
-- Maps to: PRICING_CONFIG in pricing-config.ts
-- Stored in DB to allow operator/admin dynamic updates from the Settings page.

CREATE TABLE public.pricing_config (
    id                      INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),  -- Singleton row
    bw_single               NUMERIC(10, 2) NOT NULL DEFAULT 0.50,
    bw_double               NUMERIC(10, 2) NOT NULL DEFAULT 0.75,
    color_inkjet_single     NUMERIC(10, 2) NOT NULL DEFAULT 1.00,
    color_inkjet_double     NUMERIC(10, 2) NOT NULL DEFAULT 1.50,
    color_laser_single      NUMERIC(10, 2) NOT NULL DEFAULT 3.00,
    color_laser_double      NUMERIC(10, 2) NOT NULL DEFAULT 4.50,
    delivery                NUMERIC(10, 2) NOT NULL DEFAULT 25.00,
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.pricing_config IS 'Singleton table for dynamic pricing. Maps to PRICING_CONFIG in pricing-config.ts. Only one row allowed (id=1).';

-- Seed the default pricing row
INSERT INTO public.pricing_config (id) VALUES (1);


-- ============================================================================
-- 6. INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);


-- ============================================================================
-- 7. UPDATED_AT TRIGGER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER on_profiles_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_orders_updated
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_pricing_config_updated
    BEFORE UPDATE ON public.pricing_config
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ============================================================================
-- 8. AUTO-CREATE PROFILE ON SIGNUP (Supabase Auth Hook)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, role, full_name, email, phone)
    VALUES (
        NEW.id,
        'customer',
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.email, ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_config ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- 9a. HELPER: Check if user is operator or admin
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_operator_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('operator', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;


-- ============================================================================
-- 9b. PROFILES POLICIES
-- ============================================================================

-- Customers can read their own profile
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Customers can update their own profile (but not their role)
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Operators/Admins can view all profiles (for order customer info)
CREATE POLICY "Operators can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_operator_or_admin());

-- Admins can update any profile (e.g., to promote users to operator)
CREATE POLICY "Admins can update any profile"
    ON public.profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Allow the trigger to insert profiles on signup
CREATE POLICY "Service role can insert profiles"
    ON public.profiles FOR INSERT
    WITH CHECK (true);


-- ============================================================================
-- 9c. ORDERS POLICIES
-- ============================================================================

-- Customers can view their own orders
CREATE POLICY "Customers can view their own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = customer_id);

-- Customers can create orders for themselves
CREATE POLICY "Customers can insert their own orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

-- Operators/Admins have full SELECT access to all orders (dashboard)
CREATE POLICY "Operators can view all orders"
    ON public.orders FOR SELECT
    USING (public.is_operator_or_admin());

-- Operators/Admins can update any order (change status, etc.)
CREATE POLICY "Operators can update any order"
    ON public.orders FOR UPDATE
    USING (public.is_operator_or_admin());

-- Operators/Admins can delete orders (archival)
CREATE POLICY "Operators can delete orders"
    ON public.orders FOR DELETE
    USING (public.is_operator_or_admin());


-- ============================================================================
-- 9d. ORDER ITEMS POLICIES
-- ============================================================================

-- Customers can view items of their own orders
CREATE POLICY "Customers can view their own order items"
    ON public.order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.customer_id = auth.uid()
        )
    );

-- Customers can insert items for their own orders
CREATE POLICY "Customers can insert their own order items"
    ON public.order_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.customer_id = auth.uid()
        )
    );

-- Operators/Admins have full access to all order items
CREATE POLICY "Operators can view all order items"
    ON public.order_items FOR SELECT
    USING (public.is_operator_or_admin());

CREATE POLICY "Operators can update any order item"
    ON public.order_items FOR UPDATE
    USING (public.is_operator_or_admin());

CREATE POLICY "Operators can delete any order item"
    ON public.order_items FOR DELETE
    USING (public.is_operator_or_admin());


-- ============================================================================
-- 9e. PRICING CONFIG POLICIES
-- ============================================================================

-- Everyone can read pricing (needed for customer-facing price calculations)
CREATE POLICY "Anyone can read pricing"
    ON public.pricing_config FOR SELECT
    USING (true);

-- Only operators/admins can update pricing (from Settings page)
CREATE POLICY "Operators can update pricing"
    ON public.pricing_config FOR UPDATE
    USING (public.is_operator_or_admin());


-- ============================================================================
-- SCHEMA GENERATION COMPLETE
-- ============================================================================
