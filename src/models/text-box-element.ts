export interface TextBoxElement{
  fontWeight?: number;
  fontStyle?: 'normal' | 'italic';
  textDecorationLine?: 'none' | 'underline' | 'overline' | 'line-through';
  textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy';
  textDecorationThickness?: number;
  textAlign?: 'left' | 'center' | 'right';
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  fontFamily?: string;
  value?: string;
}
