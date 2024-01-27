import sharp from "sharp";
import dotenv from "dotenv";

import {
  handleError,
  handleQuoteResponse,
  getRandomImage,
  generateSvgImage,
  arrayToChunks,
  getTspanElements,
} from "./lib";
import { IQuote, IQuoteFormatted } from "./types";

dotenv.config();

const getQuote = async <D = any>(
  endpoint: string,
): Promise<[D, null] | [null, string]> => {
  try {
    const res = await fetch(`${process.env.ZEN_QUOTES_API}/${endpoint}`);
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = (await res.json()) as D;
    return [data, null];
  } catch (error) {
    return [null, handleError(error)];
  }
};

const getRandomQuote = () => getQuote<IQuote[]>("random");

const constructImage = async ({
  quoteText,
  quoteAuthor,
}: IQuoteFormatted): Promise<[sharp.OutputInfo, null] | [null, string]> => {
  const wordsPerLine = 4;
  const wordsFormatted = arrayToChunks(quoteText.split(" "), wordsPerLine);
  const lines = wordsFormatted.map((current) => current.join(" "));
  const tspanElements = getTspanElements(lines);
  const svgImage = generateSvgImage(tspanElements, quoteAuthor);
  const bgImage = getRandomImage();
  const timestamp = Date.now().toString();
  const svgBuffer = Buffer.from(svgImage);

  try {
    const result = await sharp(bgImage)
      .composite([{ input: svgBuffer, top: 0, left: 0 }])
      .toFile(`finals/quote-card_${timestamp}.png`);
    return [result, null];
  } catch (error) {
    return [null, handleError(error)];
  }
};

const fetchQuoteAndMakeImage = async () => {
  const [quotes, errorQuotes] = await getRandomQuote();
  const quote = handleQuoteResponse(quotes);

  if (errorQuotes || !quote) {
    throw new Error(errorQuotes || "Failed to fetch a quote");
  }

  const [result, errorCreateImage] = await constructImage(quote);

  if (errorCreateImage || !result) {
    throw new Error(errorQuotes || "Failed to create an image");
  }

  console.log("done!");
};

// fetchQuoteAndMakeImage();
