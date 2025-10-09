import React from "react";

export enum FontFamily {
  AKTIFO_A_BOOK = "Aktifo-A",
}

export interface TextProps {
  children?: React.ReactNode | React.ReactNode[];
  fontFamily?: FontFamily;
  fontSize?: number | string;
  color?: string;
  lineHeight?: number;
  sx?: LooseObject;
  mt?: number | string;
  mb?: number | string;
  ml?: number | string;
  mr?: number | string;
  UIFont?: UIFonts;
  fontWeight?: number;
  textAlign?: "left" | "center" | "right";
  noOfLines?: number;
  className?: string;
  id?: string;
  ref?: AnyType;
  dangerouslySetInnerHTML?: { __html: string };
  dataSl?: string;
  testId?: AnyType;
}

export enum UIFonts {
  label_bold = "label_bold",
  label = "label",
  title = "title",
}

export const convertPxToRem = (px: number | undefined): string | number => {
  if (!px) {
    return 0;
  }
  return `${(px / 16).toFixed(2)}rem`;
};

export enum FontSizes {
  font_7 = "0.438rem",
  font_9 = "0.563rem",
  font_10 = "0.625rem",
  font_11 = "0.688rem",
  font_12 = "0.75rem",
  font_13 = "0.813rem",
  font_14 = "0.875rem",
  font_16 = "1rem",
  font_17 = "1.063rem",
  font_18 = "1.125rem",
  font_20 = "1.25rem",
  font_21 = "1.313rem",
  font_22 = "1.375rem",
  font_23 = "1.438rem",
  font_24 = "1.5rem",
  font_27 = "1.688rem",
  font_32 = "2rem",
  font_35 = "2.188rem",
  font_46 = "2.875rem",
  font_48 = "3rem",
  font_59 = "3.688rem",
  font_77 = "4.813rem",
}

export enum ButtonTypes {
  primaryBtn = "primaryBtn",
  primaryOutlinedBtn = "primaryOutlinedBtn",
  primaryGhostBtn = "primaryGhostBtn",
  primaryStaticGhostBtn = "primaryStaticGhostBtn",

  primaryMediumBtn = "primaryMediumBtn",
  primaryOutlinedMediumBtn = "primaryOutlinedMediumBtn",
  primaryGhostMediumBtn = "primaryGhostMediumBtn",
  primaryStaticMediumGhostBtn = "primaryStaticMediumGhostBtn",

  secondaryBtn = "secondaryBtn",
  secondaryOutlinedBtn = "secondaryOutlinedBtn",
  secondaryGhostBtn = "secondaryGhostBtn",

  secondaryMediumBtn = "secondaryMediumBtn",
  secondaryOutlinedMediumBtn = "secondaryOutlinedMediumBtn",
  secondaryGhostMediumBtn = "secondaryGhostMediumBtn",

  invertedBtn = "invertedBtn",
  invertedOutlinedBtn = "invertedOutlinedBtn",
  invertedGhostBtn = "invertedGhostBtn",

  invertedMediumBtn = "invertedMediumBtn",
  invertedOutlinedMediumBtn = "invertedOutlinedMediumBtn",
  invertedGhostMediumBtn = "invertedGhostMediumBtn",
}

export interface ButtonProps {
  text: string;
  type?: ButtonTypes;
  sx?: LooseObject;
  fontFamily?: FontFamily;
  fontSize?: FontSizes;
  fontWeight?: number;
  color?: string;
  className?: string;
  disabled?: boolean;
  onClick?: (e: AnyType) => void;
  leftIcon?: React.ReactElement;
  width?: number | string;
  loading?: boolean;
  htmlType?: "button" | "submit" | "reset";
  rightIcon?: React.ReactElement;
  loadingSize?: number;
  testId?: AnyType;
}

export interface AccordionProps {
  title?: string;
  content?: string;
  isOpen?: boolean;
  customHeader?: React.ReactElement;
  customBody?: React.ReactElement;
  onClick?: () => void;
  mb?: number;
  hideDropdownIcon?: boolean;
  testId?: AnyType;
}

export enum CornerRadius {
  xs = 4,
  sm = 8,
  md = 16,
  lg = 24,
  xl = 32,
  full = 9999,
}

export enum Spacing {
  xxxs = 4,
  xxs = 8,
  xs = 12,
  sm = 16,
  md = 24,
  lg = 28,
  xl = 32,
  xxl = 36,
  xxxl = 40,
}

export enum shadow {
  xs = "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
  sm = "0px 2px 4px -1px rgba(0, 0, 0, 0.06), 0px 4px 6px -1px rgba(0, 0, 0, 0.10)",
  md = "0px 10px 10px -5px rgba(0, 0, 0, 0.04), 0px 20px 25px -5px rgba(0, 0, 0, 0.10)",
  lg = "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
}

export interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: string) => void;
  sx?: LooseObject;
  fontFamily?: FontFamily;
  fontSize?: FontSizes;
  fontWeight?: number;
  color?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  backgroundColor?: string;
  label?: string;
  labelColor?: string;
  name?: string;
  placeholderColor?: string;
  inputMode?: "text" | "numeric" | "decimal" | "email" | "tel";
  rightIcon?: React.ReactElement;
  leftIcon?: React.ReactElement;
  zIndex?: number;
  paddingLeft?: number;
  mt?: number | string;
  mb?: number | string;
  onClick?: () => void;
  height?: number | string;
  type?: "text" | "number" | "email" | "password";
  formatAmount?: boolean;
  onBlur?: () => void;
  ref?: AnyType;
  id?: string;
  autoFocus?: boolean;
  width?: number | string;
  paddingRight?: number;
  testId?: string;
  editable?: boolean;
  textArea?: boolean;
  currenyType?: "currency" | "currencyWithoutDollar";
}
