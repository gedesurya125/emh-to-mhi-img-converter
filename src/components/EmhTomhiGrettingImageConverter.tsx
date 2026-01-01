"use client";
import React, { useRef, useState } from "react";

const staticText = {
  copyToClipBoard: "Copy to Clipboard",
  copied: "Copied",
};

const emhBaseUrl = "https://en.minghui.org";
const hostUrl = process.env.NEXT_PUBLIC_HOST_URL || `http://localhost:3000`;

export const EmhToMhiGreetingImageConverter = () => {
  const [input, setInput] = useState("");
  const [buttonText, setButtonText] = useState(staticText.copyToClipBoard);

  const timeoutRef = useRef<any>(null);

  const previewRef = React.useRef<HTMLDivElement | null>(null);

  const [output, setOutput] = useState("");
  React.useEffect(() => {
    const imageAndVideo: (
      | { type: "IMG"; url: string }
      | { type: "VIDEO"; url: string; videoType?: string }
    )[] = [];
    const imageOrVideoElements =
      previewRef.current?.querySelectorAll("img, video");

    imageOrVideoElements?.forEach((element: any) => {
      const tagName = element.tagName;

      if (tagName === "IMG") {
        const imageElement = element as HTMLImageElement;
        imageAndVideo.push({
          type: "IMG",
          url: imageElement.src,
        });
      }
      if (tagName === "VIDEO") {
        const videoElement = element as HTMLVideoElement;
        const videoSourceElement = videoElement.querySelector("source");
        const videoUrl = videoElement?.src || videoSourceElement?.src;
        const videoType = videoSourceElement?.type;
        if (videoUrl) {
          imageAndVideo.push({
            type: "VIDEO",
            url: videoUrl,
            videoType: videoType,
          });
        } else {
          alert("The url of the video is not found");
        }
      }
    });

    const output = imageAndVideo
      .map((item) => {
        const url = item.url.replace(hostUrl, emhBaseUrl);

        if (item.type === "IMG") {
          return `<p style="text-align: center"><img src="${url}" style="width: 500px" /></p>`;
        }
        if (item.type === "VIDEO") {
          return `<p style="text-align: center"><video controls="" style="width:500px"><source src="${url}" type="${
            item.videoType || "video/mp4"
          }"></video></p>`;
        }
      })
      .join("\n");

    setOutput(output);
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

  const handlePasteFromClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const clipText = await navigator.clipboard.readText();

      setInput(clipText);
    } catch (err) {
      alert("Clipboard is empty");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="border p-20">
        <fieldset className="flex flex-col">
          <div className="flex justify-between">
            <label htmlFor="code-input" className="mb-2 font-bold">
              Input:
            </label>
            <button
              className="bg-white text-black px-4 py-1 rounded-t-md cursor-pointer relative flex items-center justify-center"
              onClick={handlePasteFromClipboard}
            >
              Paste from Clipboard
            </button>
          </div>
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
