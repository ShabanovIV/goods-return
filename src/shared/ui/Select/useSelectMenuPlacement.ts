import { useLayoutEffect, useState, type RefObject } from 'react';

type UseSelectMenuPlacementArguments = {
  isOpen: boolean;
  menuRef: RefObject<HTMLDivElement | null>;
  optionCount: number;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

export const useSelectMenuPlacement = ({
  isOpen,
  menuRef,
  optionCount,
  triggerRef,
}: UseSelectMenuPlacementArguments) => {
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');

  useLayoutEffect(() => {
    if (!isOpen) return undefined;
    const updatePlacement = () => {
      const trigger = triggerRef.current;
      const menu = menuRef.current;
      if (!trigger || !menu) return;
      const viewport = window.visualViewport;
      const viewportTop = viewport?.offsetTop ?? 0;
      const viewportBottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
      const boundaryTop = document
        .querySelector<HTMLElement>('[data-overlay-boundary="bottom"]')
        ?.getBoundingClientRect().top;
      const visibleBottom = Math.min(viewportBottom, boundaryTop ?? viewportBottom);
      const triggerRect = trigger.getBoundingClientRect();
      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
      const gap = (Number.isFinite(rootFontSize) ? rootFontSize : 16) * 0.375;
      const spaceBelow = visibleBottom - triggerRect.bottom - gap;
      const spaceAbove = triggerRect.top - viewportTop - gap;
      const desiredHeight = Math.min(menu.scrollHeight, (viewportBottom - viewportTop) * 0.4);
      setPlacement(spaceBelow < desiredHeight && spaceAbove > spaceBelow ? 'top' : 'bottom');
    };

    updatePlacement();
    window.addEventListener('resize', updatePlacement);
    window.visualViewport?.addEventListener('resize', updatePlacement);
    return () => {
      window.removeEventListener('resize', updatePlacement);
      window.visualViewport?.removeEventListener('resize', updatePlacement);
    };
  }, [isOpen, menuRef, optionCount, triggerRef]);

  return placement;
};
