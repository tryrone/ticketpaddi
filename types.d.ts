declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

interface LooseObject {
  [key: string]: any;
}

declare type AnyType = any;
