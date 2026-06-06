"use client";

import { Button } from "@ludecker/ui";
import { useState } from "react";

export interface TagInputProps {
  initialTags: string[];
  onChange?: (tags: string[]) => void;
}

export function TagInput({ initialTags, onChange }: TagInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [draft, setDraft] = useState("");

  function addTag(value: string) {
    const trimmed = value.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    const next = [...tags, trimmed];
    setTags(next);
    onChange?.(next);
    setDraft("");
  }

  function removeTag(tag: string) {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    onChange?.(next);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(draft);
    }
  }

  return (
    <div className="admin-tag-input">
      {tags.map((tag) => (
        <span key={tag} className="admin-tag">
          {tag}
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => removeTag(tag)}
            aria-label={`Remove ${tag}`}
          >
            ×
          </Button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        placeholder="add tag, press enter"
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(draft)}
      />
    </div>
  );
}
