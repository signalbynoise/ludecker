'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowUpRight, Copy, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { TEXT_BODY_SM_CLASS } from './constants';

export interface ArticlePageCopyActionsProps {
  markdown: string;
  pageUrl: string;
  markdownViewHref: string;
}

interface CopyActionItem {
  id: string;
  title: string;
  description: string;
  external?: boolean;
  icon: ReactNode;
  onSelect: () => void;
}

function openExternal(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}

async function copyText(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
}

export function ArticlePageCopyActions({
  markdown,
  pageUrl,
  markdownViewHref,
}: ArticlePageCopyActionsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!copiedId) {
      return;
    }

    const timeout = window.setTimeout(() => setCopiedId(null), 2000);
    return () => window.clearTimeout(timeout);
  }, [copiedId]);

  const runCopy = async (id: string, value: string, message: string) => {
    try {
      await copyText(value);
      setCopiedId(id);
      toast.success(message);
    } catch {
      toast.error('Could not copy to clipboard');
    }
  };

  const items: CopyActionItem[] = [
    {
      id: 'copy-markdown',
      title: 'Copy article',
      description: 'Copy article as Markdown for LLMs',
      icon: <Copy />,
      onSelect: () => {
        void runCopy('copy-markdown', markdown, 'Article copied to clipboard');
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
      id: 'copy-link',
      title: 'Copy link',
      description: 'Copy page URL to clipboard',
      icon: <Copy />,
      onSelect: () => {
        void runCopy('copy-link', pageUrl, 'Link copied to clipboard');
      },
    },
  ];

  return (
    <nav className="article-page-copy-actions" aria-label="Page actions">
      <p className="article-page-copy-actions__title">Copy</p>
      <ul className="article-page-copy-actions__list">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={`${TEXT_BODY_SM_CLASS} article-page-copy-actions__item`}
              onClick={item.onSelect}
            >
              <span className="article-page-copy-actions__item-icon">{item.icon}</span>
              <span className="article-page-copy-actions__item-body">
                <span className="article-page-copy-actions__item-title">
                  {item.title}
                  {item.external ? (
                    <ArrowUpRight className="article-page-copy-actions__item-external" />
                  ) : null}
                  {copiedId === item.id ? (
                    <span className="article-page-copy-actions__item-copied">Copied</span>
                  ) : null}
                </span>
                <span className="article-page-copy-actions__item-description">
                  {item.description}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
