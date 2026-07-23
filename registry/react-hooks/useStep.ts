import { useCallback, useEffect, useState } from "react";

import type { Dispatch, SetStateAction } from "react";

export interface UseStepOptions {
  readonly initialStep?: number;
  readonly loop?: boolean;
}

export interface UseStepResult {
  readonly currentStep: number;
  readonly setStep: Dispatch<SetStateAction<number>>;
  readonly next: () => void;
  readonly previous: () => void;
  readonly reset: () => void;
  readonly isFirst: boolean;
  readonly isLast: boolean;
}

function assertStepCount(stepCount: number): void {
  if (!Number.isSafeInteger(stepCount) || stepCount < 1) {
    throw new RangeError("stepCount must be a positive safe integer");
  }
}

function normalizeStep(step: number, stepCount: number, loop: boolean): number {
  if (!Number.isSafeInteger(step)) {
    throw new RangeError("step must be a safe integer");
  }

  if (loop) return ((step % stepCount) + stepCount) % stepCount;
  return Math.min(stepCount - 1, Math.max(0, step));
}

export function useStep(
  stepCount: number,
  options: UseStepOptions = {},
): UseStepResult {
  const { initialStep = 0, loop = false } = options;
  assertStepCount(stepCount);

  const normalizedInitial = normalizeStep(initialStep, stepCount, loop);
  const [storedStep, setStoredStep] = useState(normalizedInitial);
  const currentStep = normalizeStep(storedStep, stepCount, loop);

  useEffect(() => {
    if (storedStep !== currentStep) setStoredStep(currentStep);
  }, [currentStep, storedStep]);

  const setStep = useCallback<Dispatch<SetStateAction<number>>>(
    (action) => {
      setStoredStep((current) => {
        const normalizedCurrent = normalizeStep(current, stepCount, loop);
        const next =
          typeof action === "function" ? action(normalizedCurrent) : action;
        return normalizeStep(next, stepCount, loop);
      });
    },
    [loop, stepCount],
  );

  const next = useCallback(() => {
    setStep((step) => step + 1);
  }, [setStep]);
  const previous = useCallback(() => {
    setStep((step) => step - 1);
  }, [setStep]);
  const reset = useCallback(() => {
    setStoredStep(normalizeStep(initialStep, stepCount, loop));
  }, [initialStep, loop, stepCount]);

  return {
    currentStep,
    setStep,
    next,
    previous,
    reset,
    isFirst: currentStep === 0,
    isLast: currentStep === stepCount - 1,
  };
}
