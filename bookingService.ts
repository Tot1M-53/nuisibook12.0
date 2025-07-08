import { supabase } from '../lib/supabase';
import { BookingData, RdvBooking } from '../types/booking';
import { formatFrenchPhoneNumber } from '../utils/phoneUtils';

export class BookingError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'BookingError';
  }
}

export async function createBooking(bookingData: BookingData): Promise<RdvBooking> {
  try {
    console.log('Création de la réservation avec les données:', bookingData);

    // Vérifier que le client Supabase est initialisé
    if (!supabase) {
      throw new BookingError('Configuration Supabase manquante. Veuillez configurer vos variables d\'environnement.');
    }

    // Vérifier d'abord si une réservation existe déjà pour ce slug
    const { data: existingBooking, error: checkError } = await supabase
      .from('rdv_bookings')
      .select('id, slug, created_at')
      .eq('slug', bookingData.slug)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = aucune ligne trouvée, c'est normal
      console.error('Erreur lors de la vérification du slug:', checkError);
    }

    if (existingBooking) {
      throw new BookingError('Une réservation a déjà été effectuée pour cette demande. Chaque lien de réservation ne peut être utilisé qu\'une seule fois.');
    }

    // Préparer les données pour l'insertion
    const insertData = {
      prenom: bookingData.prenom.trim(),
      nom: bookingData.nom.trim(),
      societe: bookingData.societe?.trim() || null,
      email: bookingData.email.trim().toLowerCase(),
      telephone: formatFrenchPhoneNumber(bookingData.telephone.trim()), // Formater le téléphone
      adresse: bookingData.adresse.trim(),
      ville: bookingData.ville.trim(),
      code_postal: bookingData.code_postal.trim(),
      date_rdv: bookingData.date_rdv, // Timestamp ISO ou null pour flexible
      slug: bookingData.slug,
      nuisible: bookingData.nuisible,
      statut: 'en_attente'
    };

    console.log('Données préparées pour insertion:', insertData);

    const { data, error } = await supabase
      .from('rdv_bookings')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase détaillée:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // Messages d'erreur plus spécifiques
      if (error.code === '42501') {
        throw new BookingError('Permissions insuffisantes. Veuillez contacter le support.');
      } else if (error.code === '23505') {
        // Contrainte d'unicité violée
        if (error.message.includes('rdv_bookings_slug_unique')) {
          throw new BookingError('Une réservation a déjà été effectuée pour cette demande. Chaque lien de réservation ne peut être utilisé qu\'une seule fois.');
        }
        throw new BookingError('Cette réservation existe déjà.');
      } else if (error.code === '23502') {
        throw new BookingError('Données manquantes. Veuillez vérifier que tous les champs requis sont remplis.');
      } else if (error.message.includes('row-level security')) {
        throw new BookingError('Problème de sécurité de la base de données. Veuillez réessayer.');
      } else {
        throw new BookingError(`Erreur lors de la création du rendez-vous: ${error.message}`);
      }
    }

    if (!data) {
      throw new BookingError('Aucune donnée retournée après la création du rendez-vous');
    }

    console.log('Réservation créée avec succès:', data);
    return data as RdvBooking;
  } catch (error) {
    console.error('Erreur dans createBooking:', error);
    
    if (error instanceof BookingError) {
      throw error;
    }
    
    // Gestion des erreurs réseau
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new BookingError('Problème de connexion réseau. Veuillez vérifier votre connexion internet.');
    }
    
    throw new BookingError(
      'Une erreur inattendue s\'est produite lors de la création du rendez-vous',
      error
    );
  }
}

// Fonction pour vérifier si un slug a déjà été utilisé
export async function checkSlugAvailability(slug: string): Promise<{ available: boolean; existingBooking?: RdvBooking }> {
  try {
    if (!supabase) {
      throw new BookingError('Configuration Supabase manquante');
    }

    const { data, error } = await supabase
      .from('rdv_bookings')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Aucune ligne trouvée = slug disponible
        return { available: true };
      }
      throw error;
    }

    return { available: false, existingBooking: data as RdvBooking };
  } catch (error) {
    console.error('Erreur lors de la vérification du slug:', error);
    // En cas d'erreur, on considère le slug comme disponible pour ne pas bloquer
    return { available: true };
  }
}

export async function getBooking(id: string): Promise<RdvBooking | null> {
  try {
    if (!supabase) {
      throw new BookingError('Configuration Supabase manquante');
    }

    const { data, error } = await supabase
      .from('rdv_bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Aucune ligne trouvée
      }
      throw new BookingError(`Erreur lors de la récupération du rendez-vous: ${error.message}`, error);
    }

    return data as RdvBooking;
  } catch (error) {
    console.error('Erreur dans getBooking:', error);
    
    if (error instanceof BookingError) {
      throw error;
    }
    
    throw new BookingError(
      'Une erreur inattendue s\'est produite lors de la récupération du rendez-vous',
      error
    );
  }
}

export async function getAllBookings(): Promise<RdvBooking[]> {
  try {
    if (!supabase) {
      throw new BookingError('Configuration Supabase manquante');
    }

    const { data, error } = await supabase
      .from('rdv_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new BookingError(`Erreur lors de la récupération des rendez-vous: ${error.message}`, error);
    }

    return (data || []) as RdvBooking[];
  } catch (error) {
    console.error('Erreur dans getAllBookings:', error);
    
    if (error instanceof BookingError) {
      throw error;
    }
    
    throw new BookingError(
      'Une erreur inattendue s\'est produite lors de la récupération des rendez-vous',
      error
    );
  }
}

export async function updateBookingStatus(id: string, statut: RdvBooking['statut']): Promise<RdvBooking> {
  try {
    if (!supabase) {
      throw new BookingError('Configuration Supabase manquante');
    }

    const { data, error } = await supabase
      .from('rdv_bookings')
      .update({ statut })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new BookingError(`Erreur lors de la mise à jour du statut: ${error.message}`, error);
    }

    if (!data) {
      throw new BookingError('Aucune donnée retournée après la mise à jour du statut');
    }

    return data as RdvBooking;
  } catch (error) {
    console.error('Erreur dans updateBookingStatus:', error);
    
    if (error instanceof BookingError) {
      throw error;
    }
    
    throw new BookingError(
      'Une erreur inattendue s\'est produite lors de la mise à jour du statut',
      error
    );
  }
}