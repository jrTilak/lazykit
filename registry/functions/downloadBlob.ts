/** Starts a browser download for a Blob and releases its temporary object URL. */
export const downloadBlob = (blob: Blob, filename: string): void => {
  if (filename.trim().length === 0) throw new TypeError("filename cannot be empty");
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.append(anchor);
  try {
    anchor.click();
  } finally {
    anchor.remove();
    URL.revokeObjectURL(url);
  }
};
