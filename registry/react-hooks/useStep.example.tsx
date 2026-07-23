import { useStep } from "./useStep";

const steps = ["Account", "Profile", "Review"] as const;

export function StepExample() {
  const { currentStep, next, previous, reset, isFirst, isLast } = useStep(
    steps.length,
  );

  return (
    <div>
      <p>
        Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
      </p>
      <button type="button" onClick={previous} disabled={isFirst}>
        Previous
      </button>
      <button type="button" onClick={next} disabled={isLast}>
        Next
      </button>
      <button type="button" onClick={reset}>Start over</button>
    </div>
  );
}
