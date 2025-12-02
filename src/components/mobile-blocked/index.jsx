import { useEffect, useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify/iconify';
import { EmptyContent } from '../empty-content';

/**
 * מסך חסימה לטלפון ניידים
 * הוא יוצג כאשר רוחב המסך קטן מ-600px
 */
export function MobileBlockedScreen() {
  return (

        <EmptyContent
            title={<Typography variant='h6' >שימוש במערכת בטלפון נייד אינו נתמך</Typography>}
        />
    
  );
}

/**
 * Hook לזיהוי גודל המסך
 */
export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const checkMobileSize = () => {
      // בדיקה אם רוחב המסך קטן מ-600px (breakpoint של xs ל-sm)
      const isMobileSize = window.innerWidth < 600;
      setIsMobile(isMobileSize);
    };

    // בדיקה ראשונית
    checkMobileSize();

    // הוספת event listener לשינוי גודל המסך
    window.addEventListener('resize', checkMobileSize);

    return () => {
      window.removeEventListener('resize', checkMobileSize);
    };
  }, []);

  return isMobile;
}
