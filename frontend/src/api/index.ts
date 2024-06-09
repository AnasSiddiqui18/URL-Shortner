import axios from "axios";

async function generateShortUrl(Url: string) {
  try {
    const response = await axios.post(`https://22a.vercel.app/`, {
      originalUrl: Url,
    });

    return response;
  } catch (error) {
    console.log("error while generating the short url", error);

    throw error;
  }
}

export { generateShortUrl };
