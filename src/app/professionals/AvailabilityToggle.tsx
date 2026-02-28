'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function AvailabilityToggle({ available }: { available: boolean }) {
  const router = useRouter();
  const params = useSearchParams();

  const toggle = () => {
    const next = new URLSearchParams(params.toString());
    if (!available) {
      next.set('available', 'true');
    } else {
      next.delete('available');
    }
    router.push(`/professionals?${next.toString()}`);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition
        ${available
          ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'
          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
    >
      <span className={`w-2 h-2 rounded-full ${available ? 'bg-green-500' : 'bg-gray-400'}`} />
      {available ? 'Available now' : 'All professionals'}
    </button>
  );
}
