"use client";
import React, { useRef, useState } from "react";

const staticText = {
  copyToClipBoard: "Copy to Clipboard",
  copied: "Copied",
};

export const EmhToMhiGreetingImageConverter = () => {
  const [input, setInput] = useState("");
  const [buttonText, setButtonText] = useState(staticText.copyToClipBoard);

  const timeoutRef = useRef<any>(null);

  const previewRef = React.useRef<HTMLDivElement | null>(null);

  const [output, setOutput] = useState("");
  React.useEffect(() => {
    if (input) {
      const imageUrls: string[] = [];
      previewRef.current?.querySelectorAll("img").forEach((img) => {
        imageUrls.push(img.src);
      });

      const hostUrl = process.env.NEXT_PUBLIC_HOST_URL
        ? `https://${process.env.NEXT_PUBLIC_HOST_URL}`
        : `http://localhost:3000`;

      const emhBaseUrl = "https://en.minghui.org";
      const convertedImageUrlToMHI = imageUrls.map((imageUrl) =>
        imageUrl.replace(hostUrl, emhBaseUrl)
      );

      setOutput(
        convertedImageUrlToMHI
          .map(
            (emhImageUrl) =>
              `<p style="text-align: center"><img src="${emhImageUrl}" style="width: 500px" /></p>`
          )
          .join("\n")
      );
    }
  }, [input]);

  const handleCopyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(output);
      setButtonText(staticText.copied);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setButtonText(staticText.copyToClipBoard);
      }, 1000);
    } catch (err) {
      alert("Failed to copy text."); // Optional: provide user feedback
    }
  };

  return (
    <div className="container mx-auto">
      <div className="border p-20">
        <fieldset className="flex flex-col">
          <label htmlFor="code-input" className="mb-2 font-bold">
            Input:
          </label>
          <textarea
            id="code-input"
            className="border"
            value={input}
            rows={10}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
        </fieldset>

        <div
          ref={previewRef}
          className="preview absolute opacity-0 -z-40"
          dangerouslySetInnerHTML={{ __html: input }}
        />
        <fieldset className="flex flex-col mt-10">
          <div className="flex justify-between">
            <label htmlFor="code-input" className="mb-2 font-bold">
              Output:
            </label>
            <button
              className="bg-white text-black px-4 py-1 rounded-t-md cursor-pointer relative flex items-center justify-center"
              onClick={handleCopyToClipboard}
            >
              <span className="opacity-0">{staticText.copyToClipBoard}</span>
              <span className="absolute">{buttonText}</span>
            </button>
          </div>
          <textarea
            id="code-input"
            className="border"
            readOnly
            value={output}
            rows={10}
          ></textarea>
        </fieldset>
      </div>
    </div>
  );
};
