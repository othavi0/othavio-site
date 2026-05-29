export type Lang = "en" | "pt"

type Copy = {
  identity: string
  sectionOpenSource: string
  sectionWork: string
  sectionElsewhere: string
  roleAuthor: string
  roleContributor: string
  workCurrentlyLabel: string
  workCurrently: string
  workPreviouslyLabel: string
  workPreviously: string
  marginCity: string
  marginEst: string
  themeHint: string
  footer: string
  notFound: string
  notFoundLink: string
}

export const content: Record<Lang, Copy> = {
  en: {
    identity:
      "Fullstack engineer crafting open source tools for developers and the agents they work alongside.",
    sectionOpenSource: "/* OPEN SOURCE */",
    sectionWork: "/* WORK */",
    sectionElsewhere: "/* ELSEWHERE */",
    roleAuthor: "author",
    roleContributor: "contributor",
    workCurrentlyLabel: "Currently",
    workCurrently: "Noctua Core, building developer tooling.",
    workPreviouslyLabel: "Previously",
    workPreviously: "Himarte Net  ·  InfinityBase",
    marginCity: "/* curitiba, br */",
    marginEst: "/* est. 2023 */",
    themeHint: "press d to toggle theme",
    footer: "© 2026 · built in neovim · deployed on vercel",
    notFound: "/* not found */",
    notFoundLink: "back to /",
  },
  pt: {
    identity:
      "Engenheiro fullstack criando ferramentas open source para desenvolvedores e os agentes ao lado deles.",
    sectionOpenSource: "/* OPEN SOURCE */",
    sectionWork: "/* TRABALHO */",
    sectionElsewhere: "/* EM OUTROS LUGARES */",
    roleAuthor: "autor",
    roleContributor: "contribuidor",
    workCurrentlyLabel: "Atualmente",
    workCurrently: "Noctua Core, construindo ferramentas para desenvolvedores.",
    workPreviouslyLabel: "Anteriormente",
    workPreviously: "Himarte Net  ·  InfinityBase",
    marginCity: "/* curitiba, br */",
    marginEst: "/* est. 2023 */",
    themeHint: "aperte d para trocar tema",
    footer: "© 2026 · feito no neovim · em produção na vercel",
    notFound: "/* não encontrado */",
    notFoundLink: "voltar para /",
  },
}
