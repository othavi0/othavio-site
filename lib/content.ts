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
    workCurrently: "Full Stack Developer at Profills and Noctua Core.",
    workPreviouslyLabel: "Previously",
    workPreviously: "Himarte Net  ·  InfinityBase",
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
    workCurrently: "Desenvolvedor full stack na Profills e Noctua Core.",
    workPreviouslyLabel: "Anteriormente",
    workPreviously: "Himarte Net  ·  InfinityBase",
    notFound: "/* não encontrado */",
    notFoundLink: "voltar para /",
  },
}
