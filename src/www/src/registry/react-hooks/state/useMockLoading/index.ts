import { useCallback, useEffect, useState } from "react";

/**
 * custom hook that simulates a loading state with optional auto-start and manual start/stop controls.
 */
const useMockLoading = ({
  defaultValue = true,
  loadingTime = 3000,
  autoStart = true,
}) => {
  const [loading, setLoading] = useState(defaultValue);
  const [isAutoStart, setIsAutoStart] = useState(autoStart);

  const startLoading = useCallback(() => {
    setIsAutoStart(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsAutoStart(false);
  }, []);

  useEffect(() => {
    let timeout: any;

    if (isAutoStart) {
      setLoading(true);
      timeout = setTimeout(() => {
        setLoading(false);
      }, loadingTime);
    } else {
      setLoading(false);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isAutoStart, loadingTime]);

  return {
    loading,
    startLoading,
    stopLoading,
  };
};

export default useMockLoading;
