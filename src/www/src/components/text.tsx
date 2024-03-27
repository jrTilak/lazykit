interface TextProps {
  children: string;
}
const Text = ({ children }: TextProps) => {
  return <p>{children}</p>;
};
export default Text;
