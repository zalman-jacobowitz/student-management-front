import { Container, Typography } from '@mui/material';
import { useEffect } from 'react';

import { useSettingsContext } from 'src/components/settings';
import { varBgKenburns } from 'src/components/animate/variants/background';

import { InitializationWizard } from '../initialization-wizard';

// ----------------------------------------------------------------------

export function InitializationView() {
  const settings = useSettingsContext();

  // Add background image to the entire page during initialization
  useEffect(() => {
    // Create a pseudo-element effect using a before pseudo-element
    const style = document.createElement('style');
    style.id = 'initialization-bg-style';
    style.textContent = `
      @keyframes bgKenburnsAnimation {
        0% {
          transform: scale(1) translateY(0);
        }
        50% {
          transform: scale(1.25) translateY(-15px);
        }
        100% {
          transform: scale(1) translateY(0);
        }
      }

      body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url(https://ateret-shlomo.org/wp-content/uploads/2024/12/fallback-image.webp);
        background-size: cover;
        background-attachment: fixed;
        background-position: center;
        background-repeat: no-repeat;
        opacity: 0.05;
        z-index: -1;
        pointer-events: none;
        animation: bgKenburnsAnimation 20s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        transform-origin: 50% 2%;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const styleEl = document.getElementById('initialization-bg-style');
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <InitializationWizard />
    </Container>
  );
}