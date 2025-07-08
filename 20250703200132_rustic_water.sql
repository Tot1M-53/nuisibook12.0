/*
  # Ajout de contrainte d'unicité sur le slug avec nettoyage des doublons

  1. Nettoyage des données
    - Identifier et supprimer les doublons existants
    - Garder seulement la réservation la plus récente pour chaque slug

  2. Contrainte d'unicité
    - Ajouter une contrainte UNIQUE sur la colonne slug
    - Empêcher les futures soumissions multiples

  3. Politique de lecture
    - Permettre la lecture pour vérifier l'existence d'un slug
*/

-- Étape 1: Nettoyer les doublons existants
-- Supprimer les réservations en doublon, en gardant la plus récente pour chaque slug
DO $$
BEGIN
  -- Supprimer les doublons en gardant l'ID le plus récent pour chaque slug
  DELETE FROM rdv_bookings 
  WHERE id NOT IN (
    SELECT DISTINCT ON (slug) id
    FROM rdv_bookings
    ORDER BY slug, created_at DESC
  );
  
  RAISE NOTICE 'Doublons supprimés avec succès';
END $$;

-- Étape 2: Ajouter la contrainte d'unicité sur le slug
DO $$
BEGIN
  -- Vérifier si la contrainte n'existe pas déjà
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'rdv_bookings_slug_unique' 
    AND table_name = 'rdv_bookings'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE rdv_bookings 
    ADD CONSTRAINT rdv_bookings_slug_unique UNIQUE (slug);
    
    RAISE NOTICE 'Contrainte d''unicité ajoutée sur le slug';
  ELSE
    RAISE NOTICE 'Contrainte d''unicité déjà existante';
  END IF;
END $$;

-- Étape 3: Ajouter une politique pour permettre la lecture par slug (pour vérification)
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
      
    RAISE NOTICE 'Politique de lecture ajoutée';
  ELSE
    RAISE NOTICE 'Politique de lecture déjà existante';
  END IF;
END $$;