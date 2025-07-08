/*
  # Ajout d'une contrainte d'unicité sur le slug

  1. Contrainte d'unicité
    - Ajouter une contrainte UNIQUE sur la colonne `slug` de la table `rdv_bookings`
    - Empêcher les soumissions multiples pour le même slug

  2. Politique de sécurité
    - Ajouter une politique pour permettre la lecture des réservations par slug (pour vérification)

  3. Index
    - L'index sur slug existe déjà, la contrainte UNIQUE l'utilisera
*/

-- Ajouter une contrainte d'unicité sur le slug
-- Cela empêchera les doublons de réservations pour le même slug
DO $$
BEGIN
  -- Vérifier si la contrainte n'existe pas déjà
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'rdv_bookings_slug_unique' 
    AND table_name = 'rdv_bookings'
  ) THEN
    ALTER TABLE rdv_bookings 
    ADD CONSTRAINT rdv_bookings_slug_unique UNIQUE (slug);
  END IF;
END $$;

-- Ajouter une politique pour permettre la lecture par slug (pour vérification)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'rdv_bookings' 
    AND policyname = 'Enable read access for all users'
  ) THEN
    CREATE POLICY "Enable read access for all users"
      ON rdv_bookings
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;