import { Loader } from "@mantine/core";
import {
  ButtonProps,
  ButtonTypes,
  CornerRadius,
  FontFamily,
  FontSizes,
  Spacing,
} from "@/constants";

const buttonStyle = {
  primaryBtn: {
    borderRadius: CornerRadius.sm,
  },
  primaryOutlinedBtn: {
    borderRadius: CornerRadius.sm,
  },
  primaryGhostBtn: {
    borderRadius: CornerRadius.sm,
  },
  primaryStaticGhostBtn: {
    borderRadius: CornerRadius.sm,
  },
  primaryStaticMediumGhostBtn: {
    borderRadius: CornerRadius.sm,
  },
  primaryMediumBtn: {
    borderRadius: CornerRadius.sm,
  },
  primaryOutlinedMediumBtn: {
    borderRadius: CornerRadius.sm,
  },
  primaryGhostMediumBtn: {
    borderRadius: CornerRadius.sm,
  },

  secondaryBtn: {
    borderRadius: CornerRadius.sm,
  },
  secondaryOutlinedBtn: {
    borderRadius: CornerRadius.sm,
  },
  secondaryGhostBtn: {
    borderRadius: CornerRadius.sm,
  },

  secondaryMediumBtn: {
    borderRadius: CornerRadius.sm,
  },
  secondaryOutlinedMediumBtn: {
    borderRadius: CornerRadius.sm,
  },
  secondaryGhostMediumBtn: {
    borderRadius: CornerRadius.sm,
  },

  invertedBtn: {
    borderRadius: CornerRadius.sm,
  },
  invertedOutlinedBtn: {
    borderRadius: CornerRadius.sm,
  },
  invertedGhostBtn: {
    borderRadius: CornerRadius.sm,
  },

  invertedMediumBtn: {
    borderRadius: CornerRadius.sm,
  },
  invertedOutlinedMediumBtn: {
    borderRadius: CornerRadius.sm,
  },
  invertedGhostMediumBtn: {
    borderRadius: CornerRadius.sm,
  },
};

const Button = ({
  text,
  type = ButtonTypes.primaryBtn,
  sx,
  fontFamily = FontFamily.AKTIFO_A_MEDIUM,
  fontSize = FontSizes.font_16,
  fontWeight = 500,
  color,
  className,
  disabled,
  onClick,
  leftIcon,
  width,
  loading,
  htmlType,
  rightIcon,
  loadingSize,
  testId,
}: ButtonProps) => {
  return (
    <button
      data-testid={testId}
      aria-label="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={className || type}
      style={{
        fontFamily,
        fontSize,
        fontWeight,
        width,
        ...(color && { color }),
        ...buttonStyle[type],
        ...sx,
      }}
      type={htmlType}
    >
      {leftIcon && !loading && (
        <span className="btn-left-icon">{leftIcon}</span>
      )}
      {loading && <Loader size={loadingSize || "sm"} mr={Spacing.sm} />}
      {text}
      {rightIcon && <span className="btn-right-icon">{rightIcon}</span>}
    </button>
  );
};

export default Button;
