import React from 'react';
import { useTranslation } from '@src/hooks/use-translation';

const PreLoader = () => {
  const { translate } = useTranslation();
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#B20025]">
      <div className="flex items-center gap-4">
        <div className="h-5 w-5 animate-spin rounded-full border-4 border-white border-t-transparent" />
        <p className="text-sm text-white">{translate('loading')}</p>
      </div>
    </div>
  );
};

export default PreLoader;
