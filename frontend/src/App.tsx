import axios from "axios";
import { useState } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

const App = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrls, setShortUrls] = useState<string[]>([]);

  async function generateShortUrl(Url: string) {
    console.log("original url", Url);

    try {
      const response = await axios.post(`https://sht90.vercel.app/`, {
        originalUrl: Url,
      });

      console.log("response", response?.data?.data);

      // Add the new short URL to the existing array
      setShortUrls((prevUrls) => [...prevUrls, response?.data?.data]);

      // Clear the input field
      setOriginalUrl("");
    } catch (error) {
      console.log("error while generating the short url", error);
    }
  }

  function visitUrl(Url: string) {
    window.open(Url);
  }

  function handleCopyUrl(url: string) {
    navigator.clipboard.writeText(url);
  }

  return (
    <div className="bg-slate-900 h-screen flex flex-col items-center pt-[100px]">
      <div className="text-center space-x-3 w-fit h-[40px] flex items-center">
        <Input
          type="text"
          placeholder="Enter url..."
          className="border-slate-950 rounded-md px-2 outline-none h-full w-[300px] bg-white"
          onChange={(e) => setOriginalUrl(e.target.value)}
          value={originalUrl}
        />

        <Button
          variant={"destructive"}
          onClick={() => generateShortUrl(originalUrl)}
        >
          Generate
        </Button>
      </div>

      {shortUrls.map((url, index) => (
        <div
          key={index}
          className="mt-5 w-full max-w-md bg-white px-2 h-10 rounded-sm flex items-center justify-between"
        >
          <ul className="flex justify-center">
            <li>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {url}
              </a>
            </li>
          </ul>

          <div className="space-x-3">
            <Button onClick={() => visitUrl(url)}>Visit</Button>
            <Button onClick={() => handleCopyUrl(url)}>Copy</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
