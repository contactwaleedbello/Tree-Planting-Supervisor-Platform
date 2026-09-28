import designTokens from '../../context/design-tokens.json';

/**
 * Design tokens accessor mapped directly to /context/design-tokens.json.
 * Trace every color and style to this object, never a hardcoded hex.
 */
export const tokens = {
  color: {
    neutral: {
      0: designTokens.global.color.neutral['0'].value,
      50: designTokens.global.color.neutral['50'].value,
      100: designTokens.global.color.neutral['100'].value,
      200: designTokens.global.color.neutral['200'].value,
      300: designTokens.global.color.neutral['300'].value,
      400: designTokens.global.color.neutral['400'].value,
      500: designTokens.global.color.neutral['500'].value,
      600: designTokens.global.color.neutral['600'].value,
      700: designTokens.global.color.neutral['700'].value,
      800: designTokens.global.color.neutral['800'].value,
      900: designTokens.global.color.neutral['900'].value,
      950: designTokens.global.color.neutral['950'].value,
    },
    brand: {
      0: designTokens.global.color.brand['0'].value,
      50: designTokens.global.color.brand['50'].value,
      100: designTokens.global.color.brand['100'].value,
      200: designTokens.global.color.brand['200'].value,
      300: designTokens.global.color.brand['300'].value,
      400: designTokens.global.color.brand['400'].value,
      500: designTokens.global.color.brand['500'].value,
      600: designTokens.global.color.brand['600'].value,
      700: designTokens.global.color.brand['700'].value,
      800: designTokens.global.color.brand['800'].value,
      900: designTokens.global.color.brand['900'].value,
      950: designTokens.global.color.brand['950'].value,
    },
    success: {
      50: designTokens.global.color.success['50'].value,
      100: designTokens.global.color.success['100'].value,
      200: designTokens.global.color.success['200'].value,
      600: designTokens.global.color.success['600'].value,
      700: designTokens.global.color.success['700'].value,
    },
    error: {
      50: designTokens.global.color.error['50'].value,
      100: designTokens.global.color.error['100'].value,
      200: designTokens.global.color.error['200'].value,
      500: designTokens.global.color.error['500'].value,
      600: designTokens.global.color.error['600'].value,
      700: designTokens.global.color.error['700'].value,
    },
    warning: {
      50: designTokens.global.color.warning['50'].value,
      100: designTokens.global.color.warning['100'].value,
      200: designTokens.global.color.warning['200'].value,
      500: designTokens.global.color.warning['500'].value,
      600: designTokens.global.color.warning['600'].value,
      700: designTokens.global.color.warning['700'].value,
    },
    info: {
      50: designTokens.global.color.info['50'].value,
      100: designTokens.global.color.info['100'].value,
      200: designTokens.global.color.info['200'].value,
      500: designTokens.global.color.info['500'].value,
      600: designTokens.global.color.info['600'].value,
      700: designTokens.global.color.info['700'].value,
    },
    accent: {
      border: designTokens.component.button.secondary.border.default.light.value,
      text: designTokens.component.button.secondary.text.default.light.value,
      hover: designTokens.component.button.secondary.border.hover.light.value,
    },
    peach: {
      0: designTokens.global.color.peach['0'].value,
      50: designTokens.global.color.peach['50'].value,
      100: designTokens.global.color.peach['100'].value,
      200: designTokens.global.color.peach['200'].value,
      300: designTokens.global.color.peach['300'].value,
      400: designTokens.global.color.peach['400'].value,
      500: designTokens.global.color.peach['500'].value,
      600: designTokens.global.color.peach['600'].value,
      700: designTokens.global.color.peach['700'].value,
      800: designTokens.global.color.peach['800'].value,
      900: designTokens.global.color.peach['900'].value,
      950: designTokens.global.color.peach['950'].value,
    },
  },
} as const;

export default tokens;
