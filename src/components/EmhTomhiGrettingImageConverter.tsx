"use client";
import React, { useState } from "react";

export const EmhToMhiGreetingImageConverter = () => {
  const [input, setInput] = useState("hello");

  const previewRef = React.useRef<HTMLDivElement | null>(null);

  const [output, setOutput] = useState("");
  React.useEffect(() => {
    if (input) {
      const imageUrls: string[] = [];
      previewRef.current?.querySelectorAll("img").forEach((img) => {
        imageUrls.push(img.src);
      });

      const hostUrl = process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
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
          <label htmlFor="code-input" className="mb-2 font-bold">
            Output:
          </label>
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
