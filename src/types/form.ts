export type FieldOption = { label: string; value: string };

export type ConditionalConfig = {
  field: string;
  operator: '>' | '<' | '>=' | '<=' | '===' | '!==';
  value: any;
};

export type FieldConfig = {
  id: string;
  label: string;
  type:
    | 'text'
    | 'numeric'
    | 'radio-chips'
    | 'toggle'
    | 'counter'
    | 'repeater-array'
    | 'income-repeater'
    | 'expense-repeater';
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  labelDynamic?: boolean;
  validation?: {
    min?: number;
    max?: number;
    postcode?: boolean;
    lengthEqualsTo?: string;
  };
  options?: FieldOption[];
  conditional?: ConditionalConfig;
};

export type PageConfig = {
  id: string;
  title: string;
  fields: FieldConfig[];
};
