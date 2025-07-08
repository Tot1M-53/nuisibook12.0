/*
  # Ajouter la colonne type_nuisible_texte

  1. Modifications de la table
    - Ajouter la colonne `type_nuisible_texte` à la table `rdv_bookings`
    - Mettre à jour les enregistrements existants avec les valeurs textuelles
    - Créer une fonction pour automatiquement remplir cette colonne

  2. Mapping des valeurs
    - rongeurs → "Rongeurs (rats, souris, autre...)"
    - blattes-cafards → "Blattes / Cafards"
    - punaises-de-lit → "Punaises de lit"
    - guepes-frelons → "Guêpes / Frelons"

  3. Trigger automatique
    - Créer un trigger pour remplir automatiquement la colonne lors des insertions/mises à jour
*/

-- Ajouter la colonne type_nuisible_texte
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rdv_bookings' AND column_name = 'type_nuisible_texte'
  ) THEN
    ALTER TABLE rdv_bookings ADD COLUMN type_nuisible_texte text;
  END IF;
END $$;

-- Créer une fonction pour convertir le slug en texte
CREATE OR REPLACE FUNCTION get_nuisible_text(slug_value text)
RETURNS text AS $$
BEGIN
  CASE slug_value
    WHEN 'rongeurs' THEN
      RETURN 'Rongeurs (rats, souris, autre...)';
    WHEN 'blattes-cafards' THEN
      RETURN 'Blattes / Cafards';
    WHEN 'punaises-de-lit' THEN
      RETURN 'Punaises de lit';
    WHEN 'guepes-frelons' THEN
      RETURN 'Guêpes / Frelons';
    ELSE
      -- Valeur par défaut si le slug n'est pas reconnu
      RETURN 'Type de nuisible non spécifié';
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Mettre à jour tous les enregistrements existants
UPDATE rdv_bookings 
SET type_nuisible_texte = get_nuisible_text(nuisible)
WHERE nuisible IS NOT NULL;

-- Créer une fonction trigger pour automatiquement remplir la colonne
CREATE OR REPLACE FUNCTION set_nuisible_text()
RETURNS TRIGGER AS $$
BEGIN
  -- Remplir automatiquement type_nuisible_texte basé sur la colonne nuisible
  IF NEW.nuisible IS NOT NULL THEN
    NEW.type_nuisible_texte = get_nuisible_text(NEW.nuisible);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour les insertions et mises à jour
DROP TRIGGER IF EXISTS set_nuisible_text_trigger ON rdv_bookings;
CREATE TRIGGER set_nuisible_text_trigger
  BEFORE INSERT OR UPDATE ON rdv_bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_nuisible_text();

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN rdv_bookings.type_nuisible_texte IS 'Version textuelle du type de nuisible, générée automatiquement à partir de la colonne nuisible';