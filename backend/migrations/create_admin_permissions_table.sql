
-- ============================================
-- جدول صلاحيات المساعدين الإداريين
-- ============================================

-- جدول لتخزين الصلاحيات المخصصة للمساعدين الإداريين
CREATE TABLE IF NOT EXISTS admin_permissions (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_name VARCHAR(100) NOT NULL,
    permission_category VARCHAR(50) NOT NULL, -- 'users', 'tenders', 'offers', 'analytics', 'system'
    can_read BOOLEAN DEFAULT FALSE,
    can_create BOOLEAN DEFAULT FALSE,
    can_update BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    can_approve BOOLEAN DEFAULT FALSE,
    granted_by INTEGER REFERENCES users(id), -- super_admin الذي منح الصلاحية
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(admin_id, permission_name)
);

-- فهرس لتسريع البحث
CREATE INDEX IF NOT EXISTS idx_admin_permissions_admin_id ON admin_permissions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_category ON admin_permissions(permission_category);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_active ON admin_permissions(is_active);

-- جدول لتسجيل تاريخ تغيير الصلاحيات
CREATE TABLE IF NOT EXISTS admin_permission_history (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_name VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'granted', 'revoked', 'modified', 'expired'
    previous_value JSONB,
    new_value JSONB,
    changed_by INTEGER REFERENCES users(id),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- فهرس لتسجيل التاريخ
CREATE INDEX IF NOT EXISTS idx_permission_history_admin_id ON admin_permission_history(admin_id);
CREATE INDEX IF NOT EXISTS idx_permission_history_created_at ON admin_permission_history(created_at DESC);

-- إدراج الصلاحيات الافتراضية للمساعدين الإداريين
-- هذه الصلاحيات يمكن تخصيصها لاحقاً من قبل super_admin

-- صلاحيات إدارة المستخدمين
INSERT INTO admin_permissions (admin_id, permission_name, permission_category, can_read, can_create, can_update, can_delete, can_approve)
SELECT 
    u.id,
    'manage_users',
    'users',
    TRUE,
    TRUE,
    TRUE,
    FALSE, -- لا يمكن حذف المستخدمين افتراضياً
    FALSE
FROM users u
WHERE u.role = 'admin' AND u.id NOT IN (SELECT admin_id FROM admin_permissions WHERE permission_name = 'manage_users')
ON CONFLICT (admin_id, permission_name) DO NOTHING;

-- صلاحيات إدارة المناقصات
INSERT INTO admin_permissions (admin_id, permission_name, permission_category, can_read, can_create, can_update, can_delete, can_approve)
SELECT 
    u.id,
    'manage_tenders',
    'tenders',
    TRUE,
    FALSE, -- لا يمكن إنشاء مناقصات افتراضياً
    TRUE,
    FALSE,
    TRUE -- يمكن الموافقة على المناقصات
FROM users u
WHERE u.role = 'admin' AND u.id NOT IN (SELECT admin_id FROM admin_permissions WHERE permission_name = 'manage_tenders')
ON CONFLICT (admin_id, permission_name) DO NOTHING;

-- صلاحيات مراجعة العروض
INSERT INTO admin_permissions (admin_id, permission_name, permission_category, can_read, can_create, can_update, can_delete, can_approve)
SELECT 
    u.id,
    'review_offers',
    'offers',
    TRUE,
    FALSE,
    TRUE,
    FALSE,
    TRUE
FROM users u
WHERE u.role = 'admin' AND u.id NOT IN (SELECT admin_id FROM admin_permissions WHERE permission_name = 'review_offers')
ON CONFLICT (admin_id, permission_name) DO NOTHING;

-- صلاحيات عرض التحليلات
INSERT INTO admin_permissions (admin_id, permission_name, permission_category, can_read, can_create, can_update, can_delete, can_approve)
SELECT 
    u.id,
    'view_analytics',
    'analytics',
    TRUE,
    FALSE,
    FALSE,
    FALSE,
    FALSE
FROM users u
WHERE u.role = 'admin' AND u.id NOT IN (SELECT admin_id FROM admin_permissions WHERE permission_name = 'view_analytics')
ON CONFLICT (admin_id, permission_name) DO NOTHING;

-- Trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_admin_permissions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_admin_permissions_timestamp
    BEFORE UPDATE ON admin_permissions
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_permissions_timestamp();

-- Trigger لتسجيل التغييرات في جدول التاريخ
CREATE OR REPLACE FUNCTION log_admin_permission_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO admin_permission_history (admin_id, permission_name, action, new_value, changed_by)
        VALUES (NEW.admin_id, NEW.permission_name, 'granted', row_to_json(NEW), NEW.granted_by);
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO admin_permission_history (admin_id, permission_name, action, previous_value, new_value, changed_by)
        VALUES (NEW.admin_id, NEW.permission_name, 'modified', row_to_json(OLD), row_to_json(NEW), NEW.granted_by);
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO admin_permission_history (admin_id, permission_name, action, previous_value)
        VALUES (OLD.admin_id, OLD.permission_name, 'revoked', row_to_json(OLD));
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_admin_permission_changes
    AFTER INSERT OR UPDATE OR DELETE ON admin_permissions
    FOR EACH ROW
    EXECUTE FUNCTION log_admin_permission_changes();

COMMENT ON TABLE admin_permissions IS 'جدول لتخزين الصلاحيات المخصصة لكل مساعد إداري (admin)';
COMMENT ON TABLE admin_permission_history IS 'سجل تاريخي لجميع التغييرات على صلاحيات المساعدين الإداريين';
