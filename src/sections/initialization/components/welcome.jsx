import { Box, Button, Typography } from "@mui/material";
import { MotionContainer, varFade } from "src/components/animate";
import { useWalktour, Walktour } from "src/components/walktour";

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
        defaultRun: true
    });

  return (
    <MotionContainer>
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          component={varFade().inDown.component}
        >
          ברוכים הבאים לאיתחול המערכת!
        </Typography>

        <Typography
          variant="body1"
          gutterBottom
          component={varFade().inUp.component}
        >
          לחץ על הבא כדי להתחיל.
        </Typography>
        <Button id="start">
            start
        </Button>
        
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
