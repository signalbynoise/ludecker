import { ARTICLE_TYPES, type ArticleType } from "@ludecker/types";
import { createLogger } from "@ludecker/utils";
import { NextResponse } from "next/server";
import { revalidatePublicContent } from "@/lib/content/revalidate-public";

const log = createLogger("api:revalidate");

const VALID_ARTICLE_TYPES = new Set(
  ARTICLE_TYPES.map((option) => option.value),
);

interface RevalidateBody {
  article_type?: string;
  slug?: string;
}

function isValidArticleType(value: string): value is ArticleType {
  return VALID_ARTICLE_TYPES.has(value as ArticleType);
}

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    log.error("POST", "REVALIDATE_SECRET not configured");
    return NextResponse.json(
      { error: "Revalidation not configured" },
      { status: 503 },
    );
  }

  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const headerSecret = request.headers.get("x-revalidate-secret");
  const provided = bearer ?? headerSecret;

  if (!provided || provided !== secret) {
    log.warn("POST", "invalid secret");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: RevalidateBody;
  try {
    body = (await request.json()) as RevalidateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const articleType = body.article_type?.trim();
  const slug = body.slug?.trim();

  if (!articleType || !isValidArticleType(articleType)) {
    return NextResponse.json(
      { error: "Invalid or missing article_type" },
      { status: 400 },
    );
  }

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  log.info("POST", "start", { articleType, slug });
  revalidatePublicContent(articleType, slug);
  log.info("POST", "success", { articleType, slug });

  return NextResponse.json({
    revalidated: true,
    article_type: articleType,
    slug,
  });
}
