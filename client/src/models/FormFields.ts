type materialUiValidWidth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export interface FormField {
  autoFocus?: boolean;
  gridWidth: {
    xs: materialUiValidWidth;
    sm: materialUiValidWidth;
    md?: materialUiValidWidth;
    lg?: materialUiValidWidth;
  };
  disabled?: boolean;
  helperText?: string;
  name: string;
  label?: string;
  placeholder?: string;
  IconComponent?: any;
  InputComponent: any;
  inputType?: string;
  variant?: string;
  code?: string;
  minDate?: Date;
  validator?: {
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
  };
  transformation?: {
    capitalize?: boolean;
  };
  default?: any;
  mask?: string;
  regexMessage?: string;
  options?: any[];
  includeUnknown?: boolean;
  handleChange?: any;
  other?: any;
}
