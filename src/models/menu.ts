export type Menu =  {
  path: string,
  title: string,
  icon: string,
  expanded: boolean,
  children: MenuChild[]
}

export type MenuChild =  {
  path: string,
  title: string
}
