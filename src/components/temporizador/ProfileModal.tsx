'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { AvatarConfig, ChildProfile } from '@/utils/storage';
import { CharacterAvatar } from './CharacterAvatar';
import { BigActionButton } from '@/components/shared/BigActionButton';

interface ProfileModalProps {
  initialProfile?: ChildProfile;
  onSave: (profile: ChildProfile) => void;
  onClose: () => void;
}

const SKIN_TONES = ['#FDE2C8', '#E0AC69', '#8D5524', '#4A2912'];
const HAIR_COLORS = ['#1E1B18', '#5C3A21', '#D97706', '#991B1B'];
const HAIR_STYLES: Array<{ id: AvatarConfig['hairStyle']; label: string }> = [
  { id: 'short', label: 'Curto' },
  { id: 'curly', label: 'Cacheado' },
  { id: 'long', label: 'Longo' },
  { id: 'bun', label: 'Coque' },
];
const BODY_BUILDS: Array<{ id: AvatarConfig['bodyBuild']; label: string }> = [
  { id: 'slim', label: 'Leve' },
  { id: 'medium', label: 'Médio' },
  { id: 'sturdy', label: 'Forte' },
];

export function ProfileModal({
  initialProfile,
  onSave,
  onClose,
}: ProfileModalProps) {
  const [name, setName] = useState(initialProfile?.name ?? '');
  const [photoData, setPhotoData] = useState<string | undefined>(
    initialProfile?.photoData,
  );
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(
    initialProfile?.avatarConfig ?? {
      skinTone: '#E0AC69',
      hairStyle: 'short',
      hairColor: '#1E1B18',
      bodyBuild: 'medium',
    },
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        setPhotoData(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim() || 'Criança';
    onSave({
      id: initialProfile?.id ?? `child-${Date.now()}`,
      name: cleanName,
      photoData,
      avatarConfig,
      createdAt: initialProfile?.createdAt ?? Date.now(),
    });
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-[#BAE6FD] rounded-3xl max-w-md w-full p-6 flex flex-col gap-5 max-h-[90dvh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h2 id="profile-modal-title" className="text-xl font-bold text-[#0F172A] text-balance">
            Personalizar Perfil
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="size-10 rounded-xl bg-[#F0F9FF] flex items-center justify-center text-[#0F172A]"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD]">
          <CharacterAvatar
            phase="anticipation"
            config={avatarConfig}
            photoData={photoData}
            size={76}
          />
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#0284C7] cursor-pointer underline">
              Usar foto da criança (opcional)
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            {photoData ? (
              <button
                type="button"
                onClick={() => setPhotoData(undefined)}
                className="text-xs text-[#64748B] text-left underline"
              >
                Remover foto e usar boneco
              </button>
            ) : null}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#0F172A] mb-1">
            Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Murilo"
            className="w-full h-12 px-4 rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] text-[#0F172A] font-medium"
          />
        </div>

        <div>
          <span className="block text-sm font-bold text-[#0F172A] mb-2">
            Tom de pele
          </span>
          <div className="flex gap-3">
            {SKIN_TONES.map((tone) => (
              <button
                key={tone}
                type="button"
                aria-label={`Pele ${tone}`}
                onClick={() => setAvatarConfig((c) => ({ ...c, skinTone: tone }))}
                style={{ backgroundColor: tone }}
                className={`w-10 h-10 rounded-full border-2 ${
                  avatarConfig.skinTone === tone
                    ? 'border-[#0284C7] ring-2 ring-[#0284C7]/40'
                    : 'border-[#0F172A]/20'
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <span className="block text-sm font-bold text-[#0F172A] mb-2">
            Cabelo
          </span>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {HAIR_STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() =>
                  setAvatarConfig((c) => ({ ...c, hairStyle: style.id }))
                }
                className={`py-2 px-2 rounded-xl text-xs font-bold border ${
                  avatarConfig.hairStyle === style.id
                    ? 'bg-[#0284C7] text-white border-[#0284C7]'
                    : 'bg-[#F0F9FF] text-[#0F172A] border-[#BAE6FD]'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            {HAIR_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Cor de cabelo ${color}`}
                onClick={() =>
                  setAvatarConfig((c) => ({ ...c, hairColor: color }))
                }
                style={{ backgroundColor: color }}
                className={`w-8 h-8 rounded-full border-2 ${
                  avatarConfig.hairColor === color
                    ? 'border-[#0284C7] ring-2 ring-[#0284C7]/40'
                    : 'border-[#0F172A]/20'
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <span className="block text-sm font-bold text-[#0F172A] mb-2">
            Porte do boneco
          </span>
          <div className="grid grid-cols-3 gap-2">
            {BODY_BUILDS.map((build) => (
              <button
                key={build.id}
                type="button"
                onClick={() =>
                  setAvatarConfig((c) => ({ ...c, bodyBuild: build.id }))
                }
                className={`py-2 rounded-xl text-xs font-bold border ${
                  avatarConfig.bodyBuild === build.id
                    ? 'bg-[#0284C7] text-white border-[#0284C7]'
                    : 'bg-[#F0F9FF] text-[#0F172A] border-[#BAE6FD]'
                }`}
              >
                {build.label}
              </button>
            ))}
          </div>
        </div>

        <BigActionButton type="submit" variant="primary" className="w-full">
          Salvar perfil
        </BigActionButton>
      </form>
    </div>
  );
}
