import type { ContentFormState, ContentStatus } from "@ludecker/types";
import { Hono } from "hono";
import {
  bulkSetContentStatus,
  createContent,
  deleteContent,
  setPublishState,
  updateContent,
  uploadCoverImage,
} from "@/lib/cms/content-mutations";
import {
  fetchAllContentForAdmin,
  fetchContentByIdForAdmin,
} from "@/lib/content/admin-queries";
import { requireUser } from "../lib/supabase";

const content = new Hono();

content.patch("/bulk-status", async (c) => {
  try {
    const { supabase } = await requireUser(c);
    const body = (await c.req.json()) as { ids: string[]; status: ContentStatus };
    const result = await bulkSetContentStatus(supabase, body.ids, body.status);
    if ("error" in result) {
      return c.json(result, 400);
    }
    return c.json(result);
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
});

content.post("/upload-cover", async (c) => {
  try {
    const { supabase, user } = await requireUser(c);
    const body = await c.req.parseBody();
    const file = body.file;
    if (!(file instanceof File)) {
      return c.json({ error: "No file provided" }, 400);
    }
    const result = await uploadCoverImage(supabase, user.id, file);
    if ("error" in result) {
      return c.json(result, 400);
    }
    return c.json(result);
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
});

content.get("/", async (c) => {
  try {
    const { supabase } = await requireUser(c);
    const items = await fetchAllContentForAdmin(supabase);
    return c.json(items);
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
});

content.get("/:id", async (c) => {
  try {
    const { supabase } = await requireUser(c);
    const item = await fetchContentByIdForAdmin(supabase, c.req.param("id"));
    if (!item) {
      return c.json({ error: "Not found" }, 404);
    }
    return c.json(item);
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
});

content.post("/", async (c) => {
  try {
    const { supabase } = await requireUser(c);
    const body = (await c.req.json()) as ContentFormState;
    const result = await createContent(supabase, body);
    if ("error" in result) {
      return c.json(result, 400);
    }
    return c.json(result, 201);
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
});

content.patch("/:id", async (c) => {
  try {
    const { supabase } = await requireUser(c);
    const body = (await c.req.json()) as ContentFormState;
    const result = await updateContent(supabase, c.req.param("id"), body);
    if ("error" in result) {
      return c.json(result, 400);
    }
    return c.json(result);
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
});

content.delete("/:id", async (c) => {
  try {
    const { supabase } = await requireUser(c);
    const result = await deleteContent(supabase, c.req.param("id"));
    if ("error" in result) {
      return c.json(result, 400);
    }
    return c.json(result);
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
});

content.post("/:id/publish", async (c) => {
  try {
    const { supabase } = await requireUser(c);
    const result = await setPublishState(supabase, c.req.param("id"), "published");
    if ("error" in result) {
      return c.json(result, 400);
    }
    return c.json(result);
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
});

content.post("/:id/unpublish", async (c) => {
  try {
    const { supabase } = await requireUser(c);
    const result = await setPublishState(supabase, c.req.param("id"), "draft");
    if ("error" in result) {
      return c.json(result, 400);
    }
    return c.json(result);
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
});

export { content };
