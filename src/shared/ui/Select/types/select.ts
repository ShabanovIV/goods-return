export type SelectOption = { label: string; value: string };

export type SelectProps = {
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  className?: string;
  disabled?: boolean;
  id: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder: string;
  value: string;
};
