import { FontFamily, TextProps, UIFonts, convertPxToRem } from "@/constants";
import { JSX } from "react";

const returnFontSizeBasedOnUIFont = (
  UIFont?: UIFonts
):
  | undefined
  | {
      fontSize: number;
      fontFamily: string;
      fontWeight: number;
    } => {
  if (UIFont === UIFonts.label) {
    return {
      fontSize: 14,
      fontFamily: FontFamily.AKTIFO_A_BOOK,
      fontWeight: 400,
    };
  }
  if (UIFont === UIFonts.label_bold) {
    return {
      fontSize: 14,
      fontFamily: FontFamily.AKTIFO_A_BOOK,
      fontWeight: 500,
    };
  }
  if (UIFont === UIFonts.title) {
    return {
      fontSize: 18,
      fontFamily: FontFamily.AKTIFO_A_BOOK,
      fontWeight: 500,
    };
  }
  return undefined;
};

const Text = ({
  children,
  fontFamily = FontFamily.AKTIFO_A_BOOK,
  fontSize,
  sx,
  color,
  lineHeight,
  mb,
  mt,
  ml,
  mr,
  UIFont,
  fontWeight,
  textAlign = "left",
  noOfLines,
  className = "",
  id = "",
  ref = null,
  dangerouslySetInnerHTML,
  dataSl,
  testId,
}: TextProps): JSX.Element => {
  return dangerouslySetInnerHTML ? (
    <div
      data-testid={testId}
      data-sl={dataSl}
      ref={ref}
      id={id}
      style={{
        fontFamily:
          returnFontSizeBasedOnUIFont(UIFont)?.fontFamily || fontFamily,
        fontSize:
          convertPxToRem(returnFontSizeBasedOnUIFont(UIFont)?.fontSize) ||
          fontSize,
        fontWeight:
          returnFontSizeBasedOnUIFont(UIFont)?.fontWeight || fontWeight,
        color: color,
        lineHeight: lineHeight,
        marginBottom: mb,
        marginTop: mt,
        marginLeft: ml,
        marginRight: mr,
        textAlign,
        ...(noOfLines
          ? {
              WebkitLineClamp: noOfLines,
              textOverflow: "ellipsis",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
            }
          : {}),
        ...sx,
      }}
      className={className}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    />
  ) : (
    <div
      data-testid={testId}
      ref={ref}
      id={id}
      style={{
        fontFamily:
          returnFontSizeBasedOnUIFont(UIFont)?.fontFamily || fontFamily,
        fontSize:
          convertPxToRem(returnFontSizeBasedOnUIFont(UIFont)?.fontSize) ||
          fontSize,
        fontWeight:
          returnFontSizeBasedOnUIFont(UIFont)?.fontWeight || fontWeight,
        color: color,
        lineHeight: lineHeight,
        marginBottom: mb,
        marginTop: mt,
        marginLeft: ml,
        marginRight: mr,
        textAlign,
        ...(noOfLines
          ? {
              WebkitLineClamp: noOfLines,
              textOverflow: "ellipsis",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
            }
          : {}),
        ...sx,
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export default Text;
