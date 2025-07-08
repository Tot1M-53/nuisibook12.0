/*
  # Mise à jour de la colonne date_rdv pour permettre les valeurs null

  1. Modifications
    - Modifier la colonne date_rdv pour accepter les valeurs null
    - Changer le type de date vers timestamptz pour plus de flexibilité
    - Permettre aux clients de ne pas définir de date (mode flexible)

  2. Sécurité
    - Maintenir les politiques RLS existantes
    - Aucun impact sur les données existantes
*/

-- Modifier la colonne date_rdv pour accepter les valeurs null
ALTER TABLE rdv_bookings 
ALTER COLUMN date_rdv DROP NOT NULL;

-- Optionnel : Changer le type vers timestamptz pour plus de flexibilité
-- (compatible avec les timestamps ISO que nous envoyons)
ALTER TABLE rdv_bookings 
ALTER COLUMN date_rdv TYPE timestamptz USING date_rdv::timestamptz;

-- Ajouter un commentaire pour clarifier l'usage
COMMENT ON COLUMN rdv_bookings.date_rdv IS 'Date et heure du rendez-vous. Null si le client souhaite être rappelé pour fixer la date.';