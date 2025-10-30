import { Box, Button, Typography, Fab, Tooltip } from "@mui/material";
import { MotionContainer, varFade, varBounce, AnimateText } from "src/components/animate";
import { useWalktour, Walktour } from "src/components/walktour";
import { Iconify } from "src/components/iconify";
import { TEXTS } from "../explantions";
import { textGradient } from "src/theme/styles";
import { useTheme } from "@emotion/react";

export function Welcome() {
    const walktourSteps = [
    {
      target: '#start',
      title: 'עקוב אחרי השלבים להתחלת עבודה',
      content: 'בחר כאן את העמודה המכילה את השמות הפרטיים של התלמידים. זה יעזור למערכת לזהות נכון כל תלמיד.',
      placement: 'bottom',
      disableBeacon: true
    },
    {
        target: '#next-button',
      title: 'לחץ כאן כדי להתחיל לארגן את המוסד שלך',
      content: 'בחר כאן את העמודה המכילה את השמות הפרטיים של התלמידים. זה יעזור למערכת לזהות נכון כל תלמיד.',
      placement: 'bottom',
            disableBeacon: true
    },
    
  ];

    const walktour = useWalktour({
        steps: walktourSteps,
        defaultRun: false
    });
  
    const theme = useTheme();
  
    return (
    <MotionContainer>
      <Box sx={{ p: 3, mb: 3 }}>
 <AnimateText
          color='dray'
          className='suez-one-regular'
          text={TEXTS.welcome}
          variants={varBounce().in}
          component="h3"
          sx={{opacity: .5, textAlign: 'center'}}
          variant="h3"
          gutterBottom
        />
        <AnimateText
          color='primary'
          className='suez-one-regular'
          text={'ניהול תלמידים'}
          variants={varBounce().in}
          sx={{
            textAlign: 'center',
            typography: 'h1',
            ...textGradient(
              `to right, ${theme.vars.palette.warning.light}, ${theme.vars.palette.primary.main}`
            ),
          }}
          component="h3"
          variant="h3"
          gutterBottom
        />

        <AnimateText
          className='suez-one-regular'
          text={TEXTS.subwelcome}
          sx={{textAlign: 'center', mt: 2}}
          variants={varBounce().in}
          component="h6"
          variant="h6"
          gutterBottom
        />
        
      </Box>
      <Walktour
              {...walktour}
              locale={{
                back: 'הקודם',
                close: 'סגור',
                last: 'סיום',
                next: 'הבא',
                skip: 'דלג'
              }}
            />
      
     
    </MotionContainer>
  );
}
