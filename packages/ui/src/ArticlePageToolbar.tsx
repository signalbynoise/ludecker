'use client';

import { ChevronLeft } from 'lucide-react';
import { Button } from './components/ui/button';
import { TEXT_BODY_SM_CLASS } from './constants';

export interface ArticlePageToolbarProps {
  backHref: string;
  backLabel: string;
}

const TOOLBAR_BUTTON_CLASS = `${TEXT_BODY_SM_CLASS} article-page-toolbar__button`;

export function ArticlePageToolbar({ backHref, backLabel }: ArticlePageToolbarProps) {
  return (
    <div className="article-page-toolbar">
      <div className="article-page-toolbar__start">
        <Button variant="ghost" size="sm" className={TOOLBAR_BUTTON_CLASS} asChild>
          <a href={backHref}>
            <ChevronLeft />
            Back to {backLabel}
          </a>
        </Button>
      </div>
    </div>
  );
}
