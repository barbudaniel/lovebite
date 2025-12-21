-- Update all RLS policies to use new role names (business instead of studio, independent instead of model)

-- ==================== dashboard_users ====================
DROP POLICY IF EXISTS "Studios can read team members" ON dashboard_users;
DROP POLICY IF EXISTS "Studios can insert team members" ON dashboard_users;
DROP POLICY IF EXISTS "Studios can update team members" ON dashboard_users;
DROP POLICY IF EXISTS "Studios can delete team members" ON dashboard_users;

CREATE POLICY "Business can read team members" ON dashboard_users
FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1 FROM dashboard_users my_user
    WHERE my_user.auth_user_id = auth.uid()
    AND my_user.role = 'business'::user_role
    AND (
      (dashboard_users.role = 'independent'::user_role AND EXISTS (
        SELECT 1 FROM creators c
        WHERE c.id = dashboard_users.creator_id
        AND c.studio_id = my_user.studio_id
      ))
      OR (dashboard_users.role = 'business'::user_role AND dashboard_users.studio_id = my_user.studio_id)
    )
  )
);

CREATE POLICY "Business can insert team members" ON dashboard_users
FOR INSERT TO public
WITH CHECK (
  (EXISTS (
    SELECT 1 FROM dashboard_users my_user
    WHERE my_user.auth_user_id = auth.uid()
    AND my_user.role = 'business'::user_role
    AND (
      (dashboard_users.role = 'independent'::user_role AND EXISTS (
        SELECT 1 FROM creators c
        WHERE c.id = dashboard_users.creator_id
        AND c.studio_id = my_user.studio_id
      ))
      OR (dashboard_users.role = 'business'::user_role AND dashboard_users.studio_id = my_user.studio_id)
    )
  ))
  OR (EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'admin'::user_role
  ))
);

CREATE POLICY "Business can update team members" ON dashboard_users
FOR UPDATE TO public
USING (
  (EXISTS (
    SELECT 1 FROM dashboard_users my_user
    WHERE my_user.auth_user_id = auth.uid()
    AND my_user.role = 'business'::user_role
    AND (
      (dashboard_users.role = 'independent'::user_role AND EXISTS (
        SELECT 1 FROM creators c
        WHERE c.id = dashboard_users.creator_id
        AND c.studio_id = my_user.studio_id
      ))
      OR (dashboard_users.role = 'business'::user_role AND dashboard_users.studio_id = my_user.studio_id)
    )
  ))
  OR (EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'admin'::user_role
  ))
)
WITH CHECK (
  (EXISTS (
    SELECT 1 FROM dashboard_users my_user
    WHERE my_user.auth_user_id = auth.uid()
    AND my_user.role = 'business'::user_role
    AND (
      (dashboard_users.role = 'independent'::user_role AND EXISTS (
        SELECT 1 FROM creators c
        WHERE c.id = dashboard_users.creator_id
        AND c.studio_id = my_user.studio_id
      ))
      OR (dashboard_users.role = 'business'::user_role AND dashboard_users.studio_id = my_user.studio_id)
    )
  ))
  OR (EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'admin'::user_role
  ))
);

CREATE POLICY "Business can delete team members" ON dashboard_users
FOR DELETE TO public
USING (
  (EXISTS (
    SELECT 1 FROM dashboard_users my_user
    WHERE my_user.auth_user_id = auth.uid()
    AND my_user.role = 'business'::user_role
    AND (
      (dashboard_users.role = 'independent'::user_role AND EXISTS (
        SELECT 1 FROM creators c
        WHERE c.id = dashboard_users.creator_id
        AND c.studio_id = my_user.studio_id
      ))
      OR (dashboard_users.role = 'business'::user_role AND dashboard_users.studio_id = my_user.studio_id)
    )
  ))
  OR (EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'admin'::user_role
  ))
);

-- ==================== media_uploads ====================
DROP POLICY IF EXISTS "Studios can access their models media" ON media_uploads;
CREATE POLICY "Business can access their creators media" ON media_uploads
FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1 FROM dashboard_users du
    JOIN creators c ON c.studio_id = du.studio_id
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'business'::user_role
    AND c.id = media_uploads.creator_id
  )
);

-- ==================== activity_logs ====================
DROP POLICY IF EXISTS "Studios can read their activity" ON activity_logs;
CREATE POLICY "Business can read their activity" ON activity_logs
FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'business'::user_role
    AND du.studio_id = activity_logs.studio_id
  )
);

-- ==================== media_metadata ====================
DROP POLICY IF EXISTS "Studios can access their models metadata" ON media_metadata;
CREATE POLICY "Business can access their creators metadata" ON media_metadata
FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1 FROM dashboard_users du
    JOIN creators c ON c.studio_id = du.studio_id
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'business'::user_role
    AND c.id = media_metadata.creator_id
  )
);

-- ==================== media_labels ====================
DROP POLICY IF EXISTS "Admins and studios can manage labels" ON media_labels;
CREATE POLICY "Admins and business can manage labels" ON media_labels
FOR ALL TO public
USING (
  EXISTS (
    SELECT 1 FROM dashboard_users
    WHERE dashboard_users.auth_user_id = auth.uid()
    AND dashboard_users.role = ANY (ARRAY['admin'::user_role, 'business'::user_role])
  )
);

-- ==================== bio_links ====================
DROP POLICY IF EXISTS "Creators and studios can manage bio links" ON bio_links;
CREATE POLICY "Creators and business can manage bio links" ON bio_links
FOR ALL TO public
USING (
  EXISTS (
    SELECT 1 FROM dashboard_users du
    LEFT JOIN creators c ON c.id = bio_links.creator_id
    WHERE du.auth_user_id = auth.uid()
    AND (
      du.role = 'admin'::user_role
      OR du.creator_id = bio_links.creator_id
      OR (du.role = 'business'::user_role AND du.studio_id = c.studio_id)
    )
  )
);

-- ==================== bio_link_items ====================
DROP POLICY IF EXISTS "Creators and studios can manage bio link items" ON bio_link_items;
CREATE POLICY "Creators and business can manage bio link items" ON bio_link_items
FOR ALL TO public
USING (
  EXISTS (
    SELECT 1 FROM bio_links bl
    LEFT JOIN dashboard_users du ON du.auth_user_id = auth.uid()
    LEFT JOIN creators c ON c.id = bl.creator_id
    WHERE bl.id = bio_link_items.bio_link_id
    AND (
      du.role = 'admin'::user_role
      OR du.creator_id = bl.creator_id
      OR (du.role = 'business'::user_role AND du.studio_id = c.studio_id)
    )
  )
);

-- ==================== creators ====================
DROP POLICY IF EXISTS "Studios can read their creators" ON creators;
CREATE POLICY "Business can read their creators" ON creators
FOR SELECT TO public
USING (
  active = true
  OR EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.creator_id = creators.id
  )
  OR EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'business'::user_role
    AND du.studio_id = creators.studio_id
  )
  OR EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'admin'::user_role
  )
);

DROP POLICY IF EXISTS "Studios can update their creators" ON creators;
CREATE POLICY "Business can update their creators" ON creators
FOR UPDATE TO public
USING (
  EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.creator_id = creators.id
  )
  OR EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'business'::user_role
    AND du.studio_id = creators.studio_id
  )
  OR EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'admin'::user_role
  )
);

DROP POLICY IF EXISTS "Studios can insert creators" ON creators;
CREATE POLICY "Business can insert creators" ON creators
FOR INSERT TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'business'::user_role
    AND du.studio_id = creators.studio_id
  )
  OR EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'admin'::user_role
  )
);

-- ==================== studio_invites ====================
DROP POLICY IF EXISTS "Studios can see their sent invites" ON studio_invites;
CREATE POLICY "Business can see their sent invites" ON studio_invites
FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'business'::user_role
    AND du.studio_id = studio_invites.studio_id
  )
);

DROP POLICY IF EXISTS "Studios can create invites" ON studio_invites;
CREATE POLICY "Business can create invites" ON studio_invites
FOR INSERT TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'business'::user_role
    AND du.studio_id = studio_invites.studio_id
  )
  OR EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'admin'::user_role
  )
);

DROP POLICY IF EXISTS "Studios can cancel invites" ON studio_invites;
CREATE POLICY "Business can cancel invites" ON studio_invites
FOR UPDATE TO public
USING (
  status = 'pending'
  AND EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'business'::user_role
    AND du.studio_id = studio_invites.studio_id
  )
);

DROP POLICY IF EXISTS "Studios can delete old invites" ON studio_invites;
CREATE POLICY "Business can delete old invites" ON studio_invites
FOR DELETE TO public
USING (
  status = ANY (ARRAY['cancelled', 'declined'])
  AND EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'business'::user_role
    AND du.studio_id = studio_invites.studio_id
  )
);

-- ==================== notifications ====================
DROP POLICY IF EXISTS "Studios can create notifications" ON notifications;
CREATE POLICY "Business can create notifications" ON notifications
FOR INSERT TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'admin'::user_role
  )
  OR EXISTS (
    SELECT 1 FROM dashboard_users du
    JOIN dashboard_users target ON target.id = notifications.user_id
    JOIN creators c ON c.id = target.creator_id
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'business'::user_role
    AND (c.studio_id = du.studio_id OR c.studio_id IS NULL)
  )
);

