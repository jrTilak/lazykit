import { useState } from "react";

import { useTimeout } from "./useTimeout";

export const TemporaryNotice = () => {
  const [visible, setVisible] = useState(true);
  const timeout = useTimeout(() => setVisible(false), visible ? 3_000 : null);

  return (
    <section>
      {visible && <p>This notice closes after three seconds.</p>}
      <button
        type="button"
        onClick={() => {
          setVisible(true);
          timeout.reset();
        }}
      >
        Show again
      </button>
    </section>
  );
};
