-- Fix the "Business can insert team members" policy that still causes recursion
-- The policy directly queries dashboard_users instead of using SECURITY DEFINER helper functions

-- Drop the old problematic policy
DROP POLICY IF EXISTS "Business can insert team members" ON dashboard_users;

-- Recreate using the SECURITY DEFINER helper functions
CREATE POLICY "Business can insert team members" ON dashboard_users
FOR INSERT TO public
WITH CHECK (
  -- Admin can insert anyone
  is_admin()
  OR
  -- Business users can insert team members
  (
    (get_my_role() = 'business'::user_role) AND 
    (
      -- Can insert independent creators linked to their studio
      ((role = 'independent'::user_role) AND (EXISTS (
        SELECT 1 FROM creators c
        WHERE c.id = dashboard_users.creator_id AND c.studio_id = get_my_studio_id()
      )))
      OR 
      -- Can insert other business users in their studio
      ((role = 'business'::user_role) AND (studio_id = get_my_studio_id()))
    )
  )
);

-- Also ensure Admins can read all users policy exists
DROP POLICY IF EXISTS "Admins can read all users" ON dashboard_users;
CREATE POLICY "Admins can read all users" ON dashboard_users
FOR SELECT TO public
USING (is_admin());
