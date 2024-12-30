import React from 'react';
import { ASSETS } from '@src/assets';
import { useTranslation } from '@src/hooks/use-translation';

const SwitchLangBtn = () => {
  const { language, setLanguage } = useTranslation();

  const onToggleLang = () => {
    setLanguage(language === 'cn' ? 'en' : 'cn');
  };

  return (
    <div className="cursor-pointer" onClick={onToggleLang}>
      <img
        className="h-auto w-[28px] object-cover"
        src={`${language === 'cn' ? ASSETS.cnLang : ASSETS.enLang}`}
        alt="cn"
      />
    </div>
  );
};

export default SwitchLangBtn;
