-- Migration: Update role values and constraints
-- Converts existing data:
--   model -> independent
--   studio -> business

-- Step 1: Drop the old api_users constraint first
ALTER TABLE api_users DROP CONSTRAINT IF EXISTS api_users_role_check;

-- Step 2: Update existing dashboard_users rows
UPDATE dashboard_users SET role = 'independent' WHERE role = 'model';
UPDATE dashboard_users SET role = 'business' WHERE role = 'studio';

-- Step 3: Update existing api_users rows  
UPDATE api_users SET role = 'independent' WHERE role = 'model';
UPDATE api_users SET role = 'business' WHERE role = 'studio';

-- Step 4: Add new constraint with updated values
ALTER TABLE api_users ADD CONSTRAINT api_users_role_check 
  CHECK (role::text = ANY (ARRAY['admin'::character varying, 'business'::character varying, 'independent'::character varying]::text[]));

-- Step 5: Update default value for dashboard_users role column
ALTER TABLE dashboard_users ALTER COLUMN role SET DEFAULT 'independent'::user_role;

-- Note: Old enum values (model, studio) cannot be removed in PostgreSQL without recreating the type.
-- They will remain but won't be used. This is a PostgreSQL limitation.

