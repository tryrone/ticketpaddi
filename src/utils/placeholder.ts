/**
 * Generate a data URL for a placeholder image with the given text and colors
 */
export const generatePlaceholderImage = (
  text: string,
  backgroundColor: string = "#4F46E5",
  textColor: string = "#FFFFFF",
  size: number = 40
): string => {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" font-weight="bold" 
            text-anchor="middle" dominant-baseline="middle" fill="${textColor}">
        ${text}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Predefined placeholder images for companies
 */
export const companyPlaceholders = {
  TC: generatePlaceholderImage("TC", "#4F46E5", "#FFFFFF"),
  GE: generatePlaceholderImage("GE", "#10B981", "#FFFFFF"),
  SH: generatePlaceholderImage("SH", "#F59E0B", "#FFFFFF"),
  CE: generatePlaceholderImage("CE", "#EF4444", "#FFFFFF"),
  IL: generatePlaceholderImage("IL", "#8B5CF6", "#FFFFFF"),
  EM: generatePlaceholderImage("EM", "#06B6D4", "#FFFFFF"),
  DS: generatePlaceholderImage("DS", "#84CC16", "#FFFFFF"),
  CO: generatePlaceholderImage("CO", "#F97316", "#FFFFFF"),
};
