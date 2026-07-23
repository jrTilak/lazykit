import { useFocusWithin } from "./useFocusWithin";

export const FocusWithinExample = () => {
  const { ref, isFocusWithin } = useFocusWithin<HTMLFieldSetElement>();

  return (
    <fieldset ref={ref}>
      <legend>{isFocusWithin ? "Editing" : "Contact"}</legend>
      <input aria-label="Email" type="email" />
      <button type="button">Save</button>
    </fieldset>
  );
};
