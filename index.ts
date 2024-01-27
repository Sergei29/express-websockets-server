import sharp from "sharp";
import dotenv from "dotenv";
dotenv.config();

const handleError = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : ((error as any).toString() as string);
};

const getQuote = async (endpoint: string) => {
  try {
    const res = await fetch(`${process.env.ZEN_QUOTES_API}/${endpoint}`);
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();
    return [data, null];
  } catch (error) {
    return [null, handleError(error)];
  }
};

const getRandomQuote = () => getQuote("random");

// getRandomQuote().then(([res, error]) => {
//   console.log({ res, error });
// });
