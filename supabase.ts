import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fonction pour valider une URL
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Vérification plus robuste des variables d'environnement
const hasValidConfig = supabaseUrl && 
                      supabaseAnonKey && 
                      !supabaseUrl.includes('placeholder') && 
                      !supabaseAnonKey.includes('placeholder') &&
                      isValidUrl(supabaseUrl);

if (!hasValidConfig) {
  console.warn('Configuration Supabase manquante ou invalide. Certaines fonctionnalités ne seront pas disponibles.');
  if (!supabaseUrl) {
    console.error('VITE_SUPABASE_URL manquante');
  } else if (!isValidUrl(supabaseUrl)) {
    console.error('VITE_SUPABASE_URL invalide:', supabaseUrl);
  }
  if (!supabaseAnonKey) {
    console.error('VITE_SUPABASE_ANON_KEY manquante');
  }
}

// Créer le client seulement si les variables d'environnement sont valides
export const supabase: SupabaseClient | null = hasValidConfig 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false
      }
    })
  : null;

// Fonction de test de connexion
export async function testConnection() {
  try {
    // Vérifier d'abord si le client Supabase est initialisé
    if (!supabase) {
      return { 
        success: false, 
        message: 'Client Supabase non initialisé. Vérifiez vos variables d\'environnement.' 
      };
    }

    const { data, error } = await supabase.from('rdv_bookings').select('count').limit(1);
    if (error) throw error;
    return { success: true, message: 'Connexion réussie' };
  } catch (error) {
    console.error('Test de connexion Supabase échoué:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
}