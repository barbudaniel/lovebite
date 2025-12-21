-- Migration: Add new role enum values to user_role
-- This must be committed first before values can be used
-- 
-- Role changes:
--   model -> independent (individual content creators)
--   studio -> business (businesses managing multiple creators)

ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'independent';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'business';

