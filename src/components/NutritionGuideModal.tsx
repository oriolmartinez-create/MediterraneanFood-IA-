import React from 'react';
import { X, Heart, ShieldCheck, Sun, Sparkles, Utensils, Check } from 'lucide-react';
import saladIconImg from '../assets/images/salad_app_icon_1791287608900.jpg';

interface NutritionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NutritionGuideModal: React.FC<NutritionGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#EADBCC] shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EADBCC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-[#EADBCC]">
              <img
                src={saladIconImg}
                alt="Ensalada Fresca"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#2C2825]">
                Filosofía MediterraneanFood IA
              </h3>
              <p className="text-xs text-[#7A6F62]">
                Salud, tranquilidad y alegría en cada comida
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#7A6F62] hover:text-[#2C2825] hover:bg-[#FAF7F2] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 text-sm text-[#5C5245] leading-relaxed">
          <p>
            La <strong>Dieta Mediterránea</strong> no es una restricción estricta, sino un estilo de vida
            reconocido por la UNESCO como Patrimonio Inmaterial de la Humanidad y por la ciencia médica
            como uno de los patrones dietéticos con mayor respaldo en longevidad y bienestar cardiovascular.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EADBCC]">
              <div className="flex items-center gap-2 text-[#E76F51] font-semibold mb-1">
                <Sun className="w-4 h-4" />
                <span>Grasas Saludables</span>
              </div>
              <p className="text-xs text-[#6E6356]">
                El aceite de oliva virgen extra aporta ácido oleico y polifenoles que protegen las arterias y reducen el estrés oxidativo.
              </p>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EADBCC]">
              <div className="flex items-center gap-2 text-[#2A9D8F] font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Riqueza en Fibra</span>
              </div>
              <p className="text-xs text-[#6E6356]">
                Legumbres, hortalizas de temporada y cereales integrales nutren tu microbiota intestinal y estabilizan los niveles de glucosa.
              </p>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EADBCC]">
              <div className="flex items-center gap-2 text-[#D4A373] font-semibold mb-1">
                <Utensils className="w-4 h-4" />
                <span>Cocina de Aprovechamiento</span>
              </div>
              <p className="text-xs text-[#6E6356]">
                Respetar cada ingrediente disponible en tu casa evita el desperdicio y te permite crear platos sabrosos con sencillez.
              </p>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EADBCC]">
              <div className="flex items-center gap-2 text-[#E76F51] font-semibold mb-1">
                <Heart className="w-4 h-4" />
                <span>Tranquilidad y Calma</span>
              </div>
              <p className="text-xs text-[#6E6356]">
                Comer conscientemente, sin prisas y en un ambiente sosegado mejora notablemente la digestión y la saciedad.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#FFEFE9] border border-[#FADCD1] rounded-2xl flex items-start gap-3 text-xs text-[#8D4B38]">
            <Sparkles className="w-4 h-4 shrink-0 text-[#E76F51] mt-0.5" />
            <div>
              <strong>Compromiso con Gemini 3.8 Flash: </strong>
              Las recetas sugeridas se elaboran en tiempo real usando exclusivamente tus alimentos registrados, adaptándose con precisión a tus alérgenos y requerimientos nutricionales.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#E76F51] hover:bg-[#D45D40] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Entendido, ¡a cocinar sano!
          </button>
        </div>
      </div>
    </div>
  );
};
