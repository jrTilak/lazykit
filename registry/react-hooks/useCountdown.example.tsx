import { useCountdown } from "./useCountdown";

export const ResendCountdown = () => {
  const countdown = useCountdown({ from: 30, to: 0, autoStart: true });

  return (
    <button
      type="button"
      disabled={countdown.isRunning}
      onClick={countdown.start}
    >
      {countdown.isRunning ? `Resend in ${countdown.value}s` : "Resend code"}
    </button>
  );
};
