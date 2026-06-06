'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { useTheme } from '../../ThemeProvider';
import '../../Sonner.css';

const TEXT_ONLY_ICONS: ToasterProps['icons'] = {
  success: null,
  info: null,
  warning: null,
  error: null,
  loading: null,
  close: null,
};

function Toaster({ closeButton = false, icons, ...props }: ToasterProps) {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme}
      closeButton={closeButton}
      icons={icons ?? TEXT_ONLY_ICONS}
      {...props}
    />
  );
}

export { Toaster };
