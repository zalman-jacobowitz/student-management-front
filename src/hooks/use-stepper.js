import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';


export function useSteps(steps, defaultValues, WizardSchema){
    const [activeStep, setActiveStep] = useState(0);
  
  
    const methods = useForm({
      resolver: zodResolver(WizardSchema),
      defaultValues,
    });
    const { reset, trigger, handleSubmit, getValues, formState: { isSubmitting } } = methods;
    
  
    const handleNext = useCallback(async (type='') => {
      const step = steps[activeStep].name;


      if (step && await trigger(step)) {
        setActiveStep(prev => prev + 1);
      }
    }, [trigger, activeStep, steps]);
  
    const handleBack = useCallback(() => {
      setActiveStep(prev => prev - 1);
    }, []);
    
  
    return {
      activeStep,
      handleNext,
      handleBack,
      isSubmitting,
      methods,
      handleSubmit,
      reset
    }
  }
  