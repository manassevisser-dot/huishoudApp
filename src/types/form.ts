export type FieldConfig = {
  id: string;
  label?: string;
  type?: string;
  required?: boolean;
  condition?: unknown;
  defaultValue?: unknown;
};

export type PageConfig = {
  id: string;
  title: string;
  fields: FieldConfig[];
};
