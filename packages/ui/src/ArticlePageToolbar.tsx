'use client';

import { useEffect, useState, type ReactNode } from 'react';
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  Copy,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { Button } from './components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';

export interface ArticlePageToolbarProps {
  backHref: string;
  backLabel: string;
  pageTitle: string;
  markdown: string;
  pageUrl: string;
  markdownViewHref: string;
}

interface CopyMenuItem {
  id: string;
  title: string;
  description: string;
  external?: boolean;
  icon: ReactNode;
  onSelect: () => void;
}

function buildLlmPrompt(pageTitle: string, pageUrl: string): string {
  return `Read "${pageTitle}" at ${pageUrl} and answer questions about it.`;
}

function openExternal(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}

async function copyText(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
}

export function ArticlePageToolbar({
  backHref,
  backLabel,
  pageTitle,
  markdown,
  pageUrl,
  markdownViewHref,
}: ArticlePageToolbarProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!copiedId) {
      return;
    }

    const timeout = window.setTimeout(() => setCopiedId(null), 2000);
    return () => window.clearTimeout(timeout);
  }, [copiedId]);

  const llmPrompt = buildLlmPrompt(pageTitle, pageUrl);
  const encodedPrompt = encodeURIComponent(llmPrompt);

  const runCopy = async (id: string, value: string) => {
    await copyText(value);
    setCopiedId(id);
  };

  const items: CopyMenuItem[] = [
    {
      id: 'copy-markdown',
      title: 'Copy article',
      description: 'Copy article as Markdown for LLMs',
      icon: <Copy />,
      onSelect: () => {
        void runCopy('copy-markdown', markdown);
      },
    },
    {
      id: 'view-markdown',
      title: 'View as Markdown',
      description: 'View this page as plain text',
      external: true,
      icon: <FileText />,
      onSelect: () => openExternal(markdownViewHref),
    },
    {
      id: 'chatgpt',
      title: 'Open in ChatGPT',
      description: 'Ask questions about this page',
      external: true,
      icon: <ExternalLink />,
      onSelect: () => openExternal(`https://chatgpt.com/?q=${encodedPrompt}`),
    },
    {
      id: 'claude',
      title: 'Open in Claude',
      description: 'Ask questions about this page',
      external: true,
      icon: <ExternalLink />,
      onSelect: () => openExternal(`https://claude.ai/new?q=${encodedPrompt}`),
    },
    {
      id: 'perplexity',
      title: 'Open in Perplexity',
      description: 'Ask questions about this page',
      external: true,
      icon: <ExternalLink />,
      onSelect: () => openExternal(`https://www.perplexity.ai/search?q=${encodedPrompt}`),
    },
    {
      id: 'copy-link',
      title: 'Copy link',
      description: 'Copy page URL to clipboard',
      icon: <Copy />,
      onSelect: () => {
        void runCopy('copy-link', pageUrl);
      },
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <a href={backHref}>
          <ChevronLeft />
          Back to {backLabel}
        </a>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Copy />
            Copy article
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          {items.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className="items-start gap-3 py-2"
              onSelect={(event) => {
                event.preventDefault();
                item.onSelect();
              }}
            >
              <span className="mt-0.5 text-muted-foreground">{item.icon}</span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="inline-flex items-center gap-1 font-medium text-foreground">
                  {item.title}
                  {item.external ? <ArrowUpRight className="size-3.5 text-muted-foreground" /> : null}
                  {copiedId === item.id ? (
                    <span className="text-xs font-medium text-primary">Copied</span>
                  ) : null}
                </span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
