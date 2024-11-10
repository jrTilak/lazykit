import React from "react";
import useStep from ".";
import { Button } from "@/components/ui/button";

const StepWizard = () => {
  const steps = [
    "Personal Info",
    "Address Details",
    "Payment Info",
    "Review",
    "Confirmation"
  ]

  const { currentStep, nextStep, prevStep, resetStep, isFirstStep, isLastStep } = useStep({
    totalSteps: steps.length,
    rotate: true,
  });



  return (
    <div className="w-full h-fit flex flex-col items-center justify-center text-center p-6 gap-4">
      <h3 className="text-lg">
        Step {currentStep + 1} - {steps[currentStep]}
      </h3>

      <div className="flex gap-4 items-center flex-wrap justify-center">
        <Button variant={"outline"} size={"sm"} onClick={prevStep} disabled={isFirstStep}>Previous</Button>
        <Button variant={"outline"} size={"sm"} onClick={nextStep} disabled={isLastStep}>Next</Button>
        <Button variant={"outline"} size={"sm"} onClick={resetStep}>Reset</Button>
      </div>
    </div>
  );
};

export default StepWizard;
