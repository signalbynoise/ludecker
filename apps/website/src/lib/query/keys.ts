export const queryKeys = {
  public: {
    all: ["public"] as const,
    home: ["public", "home"] as const,
    section: (typeSegment: string) =>
      ["public", "section", typeSegment] as const,
    article: (typeSegment: string, slug: string) =>
      ["public", "article", typeSegment, slug] as const,
    pageContext: (pathname: string) =>
      ["public", "page-context", pathname] as const,
    gettingStarted: ["public", "getting-started"] as const,
  },
  admin: {
    all: ["admin"] as const,
    contentList: ["admin", "content-list"] as const,
    content: (id: string) => ["admin", "content", id] as const,
    session: ["admin", "session"] as const,
  },
} as const;
