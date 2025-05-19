/*
  # Add admin role and permissions

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key, references auth.users)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `admin_users` table
    - Add policy for admin access
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can access admin_users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  ));

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;