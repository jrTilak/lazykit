//heading will only accept children of type string
interface HeadingProps {
  children: string;
}
const Heading = ({ children }: HeadingProps) => {
  return <h1 className="text-xl">{children}</h1>;
};
export default Heading;
