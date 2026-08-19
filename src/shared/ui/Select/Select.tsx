import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import styles from './Select.module.scss';
import type { SelectProps } from './types/select';
import { useSelectMenuPlacement } from './useSelectMenuPlacement';

export const Select = ({
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  className,
  disabled,
  id,
  onChange,
  options,
  placeholder,
  value,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const menuOptions = [{ label: placeholder, value: '' }, ...options];
  const selectedIndex = Math.max(
    0,
    menuOptions.findIndex((option) => option.value === value),
  );
  const selectedOption = menuOptions[selectedIndex];
  const menuPlacement = useSelectMenuPlacement({
    isOpen,
    menuRef,
    optionCount: menuOptions.length,
    triggerRef,
  });

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    optionRefs.current[selectedIndex]?.focus({ preventScroll: true });
  }, [isOpen, selectedIndex]);

  const closeAndFocus = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const lastIndex = menuOptions.length - 1;
    const nextIndex = event.key === 'ArrowDown' ? Math.min(index + 1, lastIndex) : undefined;
    const previousIndex = event.key === 'ArrowUp' ? Math.max(index - 1, 0) : undefined;
    const edgeIndex = event.key === 'Home' ? 0 : event.key === 'End' ? lastIndex : undefined;
    const focusIndex = nextIndex ?? previousIndex ?? edgeIndex;
    if (focusIndex !== undefined) {
      event.preventDefault();
      optionRefs.current[focusIndex]?.focus();
    }
    if (event.key === 'Escape') closeAndFocus();
    if (event.key === 'Tab') setIsOpen(false);
  };

  return (
    <div ref={rootRef} className={[styles.root, className].filter(Boolean).join(' ')}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={styles.select}
        disabled={disabled}
        role="combobox"
        aria-controls={`${id}-listbox`}
        aria-describedby={ariaDescribedBy}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-invalid={ariaInvalid}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <span className={!value ? styles.placeholder : undefined}>{selectedOption.label}</span>
        <span className={styles.chevron} aria-hidden="true" />
      </button>
      {isOpen && (
        <div
          ref={menuRef}
          id={`${id}-listbox`}
          className={`${styles.menu} ${menuPlacement === 'top' ? styles.menuTop : ''}`}
          role="listbox"
        >
          {menuOptions.map((option, index) => (
            <button
              key={option.value}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              className={styles.option}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                closeAndFocus();
              }}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
