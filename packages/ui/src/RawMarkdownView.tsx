'use client';

import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './components/ui/tooltip';
import './RawMarkdownView.css';

export interface RawMarkdownViewProps {
  title: string;
  markdown: string;
}

export function RawMarkdownView({ title, markdown }: RawMarkdownViewProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Could not copy to clipboard');
    }
  };

  return (
    <div className="raw-markdown-view">
      <main className="raw-markdown-view__inner">
        <p className="raw-markdown-view__label">Markdown source</p>
        <h1 className="raw-markdown-view__title">{title}</h1>
        <div className="raw-markdown-view__panel">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="raw-markdown-view__copy"
                onClick={() => {
                  void handleCopy();
                }}
              >
                <Copy />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy markdown</TooltipContent>
          </Tooltip>
          <pre className="raw-markdown-view__source">{markdown}</pre>
        </div>
      </main>
    </div>
  );
}
