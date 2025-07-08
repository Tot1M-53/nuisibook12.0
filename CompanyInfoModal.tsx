import React from 'react';
import { X, Star, Clock, Shield, Euro } from 'lucide-react';

interface CompanyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompanyInfoModal({ isOpen, onClose }: CompanyInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-fit max-h-[98vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg lg:text-xl font-semibold text-gray-900">Sélection de votre professionnel</h2>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Comment nous choisissons le meilleur partenaire</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="text-center">
              <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed">
                Le professionnel partenaire qui réunit 
                <span className="font-semibold text-blue-600"> tous les critères suivants</span> :
              </p>
            </div>

            {/* Critères - Grid ultra responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              {/* Meilleur prix */}
              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Euro className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-green-800 mb-1 text-xs sm:text-sm lg:text-base">Meilleur prix</h3>
                  <p className="text-xs sm:text-sm text-green-700 leading-relaxed">
                    Tarif le plus compétitif pour votre intervention, sans compromis sur la qualité.
                  </p>
                </div>
              </div>

              {/* Rapidité */}
              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-orange-800 mb-1 text-xs sm:text-sm lg:text-base">Disponibilité rapide</h3>
                  <p className="text-xs sm:text-sm text-orange-700 leading-relaxed">
                    Capable d'intervenir à votre adresse dans les plus brefs délais.
                  </p>
                </div>
              </div>

              {/* Certification */}
              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-blue-800 mb-1 text-xs sm:text-sm lg:text-base">Certifié Nuisibook</h3>
                  <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                    Respecte notre charte de qualité et nos standards d'excellence.
                  </p>
                </div>
              </div>

              {/* Note */}
              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-yellow-800 mb-1 text-xs sm:text-sm lg:text-base">Note minimum 4/5</h3>
                  <p className="text-xs sm:text-sm text-yellow-700 leading-relaxed">
                    Évaluation client excellente basée sur les avis vérifiés.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center p-3 sm:p-4 lg:p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl text-xs sm:text-sm lg:text-base"
          >
            Parfait, j'ai compris !
          </button>
        </div>
      </div>
    </div>
  );
}