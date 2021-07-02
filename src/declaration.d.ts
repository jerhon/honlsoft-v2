declare module "*.css" {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export = classNames
}

declare module "*.scss" {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export = classNames
}


declare module "*.jpg" {
  const url: string
  export = classNames
}

