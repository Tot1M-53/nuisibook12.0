/**
 * Utilitaires pour le formatage des numéros de téléphone français
 */

/**
 * Nettoie un numéro de téléphone en supprimant tous les caractères non numériques
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Formate un numéro de téléphone français au format standard : 06 01 02 03 04
 * @param phone - Le numéro de téléphone à formater
 * @returns Le numéro formaté ou le numéro original si le format n'est pas valide
 */
export function formatFrenchPhoneNumber(phone: string): string {
  // Nettoyer le numéro (supprimer tous les caractères non numériques)
  const cleaned = cleanPhoneNumber(phone);
  
  // Si le numéro commence par +33, le convertir en 0
  let normalizedPhone = cleaned;
  if (cleaned.startsWith('33') && cleaned.length === 11) {
    normalizedPhone = '0' + cleaned.substring(2);
  } else if (cleaned.startsWith('33') && cleaned.length === 12) {
    // Cas où il y a un 0 après 33 (3306...)
    normalizedPhone = '0' + cleaned.substring(3);
  }
  
  // Vérifier que le numéro a 10 chiffres et commence par 0
  if (normalizedPhone.length !== 10 || !normalizedPhone.startsWith('0')) {
    return phone; // Retourner le numéro original si le format n'est pas valide
  }
  
  // Formater avec des espaces : 06 01 02 03 04
  return normalizedPhone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
}

/**
 * Valide qu'un numéro de téléphone français est au bon format
 */
export function isValidFrenchPhoneNumber(phone: string): boolean {
  const cleaned = cleanPhoneNumber(phone);
  
  // Vérifier les formats acceptés :
  // - 10 chiffres commençant par 0 (format national)
  // - 11 chiffres commençant par 33 (format international sans +)
  // - 12 chiffres commençant par 330 (format international avec 0)
  
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return true;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('33')) {
    return true;
  }
  
  if (cleaned.length === 12 && cleaned.startsWith('330')) {
    return true;
  }
  
  return false;
}

/**
 * Formate un numéro de téléphone en temps réel pour l'affichage dans un input
 * Cette fonction est utilisée pendant la saisie pour améliorer l'UX
 */
export function formatPhoneNumberForDisplay(phone: string): string {
  const cleaned = cleanPhoneNumber(phone);
  
  // Limiter à 10 chiffres maximum
  const limited = cleaned.substring(0, 10);
  
  // Formater progressivement pendant la saisie
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 4) {
    return limited.replace(/(\d{2})(\d+)/, '$1 $2');
  } else if (limited.length <= 6) {
    return limited.replace(/(\d{2})(\d{2})(\d+)/, '$1 $2 $3');
  } else if (limited.length <= 8) {
    return limited.replace(/(\d{2})(\d{2})(\d{2})(\d+)/, '$1 $2 $3 $4');
  } else {
    return limited.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d+)/, '$1 $2 $3 $4 $5');
  }
}