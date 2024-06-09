import { useEffect, useState } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateShortUrl } from "./api";
import Loader from "./components/shared/Loader";
import toast, { Toaster } from "react-hot-toast";
import { URLSchema } from "./lib/utils";

type UrlFormType = {
  urlInput: string;
};

const App = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrls, setShortUrls] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UrlFormType>({
    resolver: zodResolver(URLSchema),
  });

  const {
    data: shortedUrl,
    isPending: isCreatingUrl,
    mutate,
  } = useMutation({
    mutationKey: ["GENERATE_URL"],
    mutationFn: generateShortUrl,

    onError: (error) => {
      if (!error) return;

      toast.error(error.message, {
        position: "top-right",
        style: {
          borderRadius: "5px",
          background: "#000",
          color: "#fff",
        },
      });
    },

    onSuccess: (success) => {
      toast.success(success?.data?.message, {
        position: "top-right",
        style: {
          borderRadius: "5px",
          background: "#000",
          color: "#fff",
        },
      });
    },
  });

  useEffect(() => {
    if (!shortedUrl?.data?.data) return;
    setShortUrls((prevUrls) => [...prevUrls, shortedUrl?.data?.data]);
    setOriginalUrl("");
  }, [shortedUrl]);

  useEffect(() => {
    if (!errors.urlInput?.message) return;

    toast.error(errors?.urlInput?.message, {
      position: "top-right",
      style: {
        borderRadius: "5px",
        background: "#000",
        color: "#fff",
      },
    });
  }, [errors.urlInput?.message]);

  async function submitHandler({ urlInput }: { urlInput: string }) {
    try {
      mutate(urlInput);
      reset();
    } catch (error) {
      console.log("error in the submit handler", error);
    }
  }

  function visitUrl(Url: string) {
    window.open(Url);
  }

  function handleCopyUrl(url: string) {
    const textArea = document.createElement("textarea");
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    toast.success("URL copied to clipboard");
  }

  return (
    <>
      <Toaster />

      <div className="bg-slate-900 h-screen flex flex-col items-center pt-[100px] ">
        <form
          className="text-center w-fit flex flex-col items-center"
          onSubmit={handleSubmit(submitHandler)}
        >
          <div className="flex gap-3 max-xs:gap-2 max-xs:flex-col max-xs:items-end h-[35px] max-xs:h-20">
            <Input
              {...register("urlInput")}
              type="text"
              placeholder="Enter url..."
              className="border-slate-950 rounded-md px-2 outline-none h-full w-[300px] bg-white"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />

            <Button
              variant={"destructive"}
              type="submit"
              className={`w-20 flex justify-center h-full max-xs:h-[30px]  ${
                isCreatingUrl ? "opacity-35" : "opacity-100"
              }`}
            >
              {isCreatingUrl ? <Loader /> : "Generate"}
            </Button>
          </div>
        </form>

        {shortUrls.map((url, index) => (
          <div
            key={index}
            className="mt-5 max-xs:mt-10 w-full max-w-md max-xs:max-w-[300px] bg-white px-2 h-10 rounded-sm flex items-center justify-between"
          >
            <ul className="flex justify-center">
              <li>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm"
                >
                  {url}
                </a>
              </li>
            </ul>

            <div className="space-x-3 flex text-center">
              <Button className="max-xs:hidden" onClick={() => visitUrl(url)}>
                Visit
              </Button>
              <Button
                className="max-xs:hidden"
                onClick={() => handleCopyUrl(url)}
              >
                Copy
              </Button>

              <a
                href="#"
                className="max-xs:block hidden text-sm font-bold text-slate-500"
                onClick={() => handleCopyUrl(url)}
              >
                Copy
              </a>
              <a
                href="#"
                className="max-xs:block hidden text-sm font-bold text-slate-500"
                onClick={() => visitUrl(url)}
              >
                Visit
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default App;
