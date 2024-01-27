import { IQuote, IQuoteFormatted } from "../types";

export const handleError = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : ((error as any).toString() as string);
};

export const handleQuoteResponse = (
  res: IQuote[] | null,
): IQuoteFormatted | null => {
  if (!res) return null;
  const { q: quoteText, a: quoteAuthor } = res[0];

  return { quoteText, quoteAuthor };
};

export const IMAGES_LIST = [
  "backgrounds/behongo.png",
  "backgrounds/chitty-chitty-bang-bang.png",
  "backgrounds/hydrogen.png",
  "backgrounds/instagram.png",
  "backgrounds/burning-orange.png",
  "backgrounds/earthly.png",
  "backgrounds/influenza.png",
  "backgrounds/love-and-liberty.png",
  "backgrounds/rainbow-blue.png",
  "backgrounds/scooter.png",
  "backgrounds/solid-vault.png",
  "backgrounds/visions-of-grandeur.png",
  "backgrounds/blue-raspberry.png",
] as const;

export const IMAGE = {
  WIDTH: 750,
  HEIGHT: 483,
} as const;

export const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * IMAGES_LIST.length);
  return IMAGES_LIST[randomIndex];
};

export const arrayToChunks = (
  array: string[],
  chunkSize: number,
): string[][] => {
  const chunked: string[][] = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunked.push(chunk);
  }

  return chunked;
};

/**
 * @description create <tspan> elements out of quote lines
 * ( for svg content )
 */
export const getTspanElements = (linesOfText: string[]) =>
  linesOfText
    .map((currentLine) => {
      return `<tspan x="${
        IMAGE.WIDTH / 2
      }" dy="1.2em"> ${currentLine} </tspan>`;
    })
    .join("");

/**
 * @description create an svg image out of quote lines
 */
export const generateSvgImage = (
  tspanElements: string,
  quoteAuthor: string,
) => `
  <svg width="${IMAGE.WIDTH}" height="${IMAGE.HEIGHT}">
    <style>
      .title {
        fill: #fff;
        font-size: 20px;
        font-weight: bold;
      } 
      .quoteAuthorStyles {
        font-size: 35px;
        font-weight: bold;
        padding: 50px;
      }
      .footerStyles {
        font-size: 14px;
        font-weight: bold;
        fill: lightgrey;
        text-anchor: middle;
        font-family: Verdana;
      }
    </style>
    <circle cx="382" cy="76" r="44" fill="rgba(255, 255, 255, 0.155)" />
    <text x="382" y="76" dy="50" text-anchor="middle" font-size="90" font-family="Verdana" fill="white">"</text>
    <g>
      <rect x="0" y="0" width="${IMAGE.WIDTH}" height="auto"></rect>
      <text id="lastLineOfQuote" x="375" y="120" font-family="Verdana" font-size="35" fill="white" text-anchor="middle">
        ${tspanElements}
        <tspan class="quoteAuthorStyles" x="375" dy="1.8em"> - ${quoteAuthor} </tspan>
      </text>
    </g>
    <text x="${IMAGE.WIDTH / 2}" y="${IMAGE.HEIGHT - 10}" class="footerStyles">
        Developed by SergeB | Quotes from ZenQuotes.io
     </text>
  </svg>
  `;
