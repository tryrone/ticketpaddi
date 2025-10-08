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
