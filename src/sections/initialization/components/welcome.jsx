import { Box, Grid, Button, Typography, Fab, Tooltip } from "@mui/material";
import { MotionContainer, varFade, varBounce, AnimateText } from "src/components/animate";
import { useWalktour, Walktour } from "src/components/walktour";
import { Iconify } from "src/components/iconify";
import { TEXTS } from "../explantions";
import { textGradient } from "src/theme/styles";
import { useTheme } from "@emotion/react";
import { CONFIG } from "src/config-global";

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
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}  sx={{ display: 'flex', mt:'5', justifyContent: 'center' }}>
          <Box
            padding={4}  
            component="img"
            src={`${CONFIG.assetsDir}/assets/illustrations/illustration-dashboard.webp`}
            sx={{
              maxWidth: { xs: '300px', sm: '400px', md: '500px' },
              height: 'auto',
              animation: 'float 3s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-20px)' },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', mb: 5, flexDirection: 'column', alignItems: 'center' }}>
        <AnimateText
          className='suez-one-regular'
          text={TEXTS.welcome}
          variants={varFade().in}
          component="h3"
          sx={{opacity: .5, textAlign: 'center'}}
          variant="h3"
          gutterBottom
        />
        <AnimateText
          color='primary'
          className='suez-one-regular'
          text={'ניהול תלמידים'}
          variants={varBounce().inUp}
          sx={{
            textAlign: 'center',
            typography: 'h1',
            opacity: .95,
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
             sx={{
              textAlign: 'center',
              ...textGradient(
                `to left, ${theme.vars.palette.primary.main}, ${theme.vars.palette.primary.dark}`
              ),
            }}
            variants={varFade().inUp}
            component="h6"
            variant="h6"
            gutterBottom
          />
        </Grid>
      </Grid>
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
