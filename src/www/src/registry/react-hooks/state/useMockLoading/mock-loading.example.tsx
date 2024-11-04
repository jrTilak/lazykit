"use client"
import { Button } from "@/components/ui/button";
import useMockLoading from "@/registry/react-hooks/state/useMockLoading";

const MockLoading = () => {
  const { loading, startLoading, stopLoading } = useMockLoading({
    defaultValue: true,
    loadingTime: 5000,
    autoStart: false,
  });

  return (
    <div className="space-y-4">
      {loading ? <p>Loading for 5000ms...</p> : <p>Content Loaded</p>}
      <Button variant={"secondary"} size={"sm"} onClick={startLoading}>Start Loading</Button>
      <Button variant={"secondary"} size={"sm"} onClick={stopLoading} className="ml-4">Stop Loading</Button>
    </div>
  );
}

export default MockLoading;