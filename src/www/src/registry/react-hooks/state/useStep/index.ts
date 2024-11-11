import { useState, useCallback, useEffect } from "react";

type UseStepConfig = {
  totalSteps: number;
  rotate?: boolean; //  If true, the steps will rotate (wrap around) after reaching the end or start
  onChange?: (currentStep: number) => void;
  onNext?: (currentStep: number) => void;
  onPrev?: (currentStep: number) => void;
};

/**
 * A custom hook to handle steps in a process with additional options like rotate and callbacks.
 */
const useStep = ({
  totalSteps,
  rotate = false,
  onChange,
  onNext,
  onPrev,
}: UseStepConfig) => {
  const initialStep = 0;
  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  // Update the step and invoke callbacks
  const updateStep = useCallback(
    (newStep: number) => {
      // Ensure the step is within the bounds
      let updatedStep = newStep;
      if (updatedStep < initialStep)
        updatedStep = rotate ? totalSteps - 1 : initialStep;
      if (updatedStep > totalSteps - 1)
        updatedStep = rotate ? initialStep : totalSteps - 1;

      setCurrentStep(updatedStep);

      if (onChange) onChange(updatedStep); // Trigger onChange callback
    },
    [rotate, totalSteps, onChange]
  );

  // Move to the next step
  const nextStep = useCallback(() => {
    const next = currentStep + 1;
    if (onNext) onNext(currentStep); // Trigger onNext callback
    updateStep(next);
  }, [currentStep, onNext, updateStep]);

  // Move to the previous step
  const prevStep = useCallback(() => {
    const prev = currentStep - 1;
    if (onPrev) onPrev(currentStep); // Trigger onPrev callback
    updateStep(prev);
  }, [currentStep, onPrev, updateStep]);

  // Reset to the initial step
  const resetStep = useCallback(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  return {
    currentStep,
    nextStep,
    prevStep,
    resetStep,
    isFirstStep: currentStep === initialStep,
    isLastStep: currentStep === totalSteps - 1,
  };
};

export default useStep;
