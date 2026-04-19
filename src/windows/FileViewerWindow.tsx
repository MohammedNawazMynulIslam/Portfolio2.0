"use client";

import { File as FileIcon, FileText, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

import { withWindow } from "@/hoc/withWindow";
import { useFileViewerStore } from "@/store/fileViewerStore";
import type { FileViewerPayload } from "@/types";

type FileViewerWindowProps = Partial<FileViewerPayload>;

function FileViewerWindow(props: FileViewerWindowProps) {
  const storeFile = useFileViewerStore((state) => ({
    fileType: state.fileType,
    content: state.content,
    filename: state.filename,
    dimensions: state.dimensions,
    size: state.size,
  }));

  const file = {
    fileType: props.fileType ?? storeFile.fileType,
    content: props.content ?? storeFile.content,
    filename: props.filename ?? storeFile.filename,
    dimensions: props.dimensions ?? storeFile.dimensions,
    size: props.size ?? storeFile.size,
  };

  const lines = file.content.split("\n");

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(245,247,255,0.9))] text-slate-900">
      <header className="flex items-center gap-3 border-b border-slate-200/80 bg-white/70 px-4 py-3 backdrop-blur-xl">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
          {file.fileType === "image" ? (
            <ImageIcon className="h-4 w-4" />
          ) : file.fileType === "markdown" ? (
            <FileText className="h-4 w-4" />
          ) : (
            <FileIcon className="h-4 w-4" />
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{file.filename}</p>
          <p className="truncate text-xs text-slate-500">
            {file.fileType === "image" ? "Image Preview" : "Document Preview"}
          </p>
        </div>
      </header>

      {file.fileType === "image" ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-6">
          <div className="flex max-h-[70%] w-full items-center justify-center rounded-[28px] border border-slate-200/70 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <Image
              src={file.content}
              alt={file.filename}
              width={1200}
              height={900}
              className="max-h-[280px] max-w-full rounded-2xl object-contain"
            />
          </div>
          <div className="mt-5 grid w-full max-w-lg grid-cols-3 gap-3">
            <MetadataCard label="Filename" value={file.filename} />
            <MetadataCard label="Dimensions" value={file.dimensions ?? "Unknown"} />
            <MetadataCard label="Size" value={file.size ?? "Unknown"} />
          </div>
        </div>
      ) : file.fileType === "markdown" ? (
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <article className="prose prose-slate max-w-none rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
            {lines.map((line, index) => {
              if (line.startsWith("### ")) {
                return (
                  <h3 key={index} className="mt-4 text-lg font-semibold">
                    {line.replace("### ", "")}
                  </h3>
                );
              }

              if (line.startsWith("## ")) {
                return (
                  <h2 key={index} className="mt-6 text-2xl font-semibold">
                    {line.replace("## ", "")}
                  </h2>
                );
              }

              if (line.startsWith("# ")) {
                return (
                  <h1 key={index} className="text-3xl font-semibold">
                    {line.replace("# ", "")}
                  </h1>
                );
              }

              if (line.startsWith("- ")) {
                return (
                  <li key={index} className="ml-5 list-disc">
                    {line.replace("- ", "")}
                  </li>
                );
              }

              if (!line.trim()) {
                return <div key={index} className="h-3" />;
              }

              return (
                <p key={index} className="leading-7 text-slate-700">
                  {line}
                </p>
              );
            })}
          </article>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-hidden p-4">
          <div className="grid h-full grid-cols-[56px_1fr] overflow-hidden rounded-[28px] border border-slate-200/70 bg-slate-950 text-slate-100 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="overflow-hidden border-r border-white/10 bg-slate-900/80 py-4">
              {lines.map((_, index) => (
                <div
                  key={index}
                  className="px-3 text-right font-roboto-mono text-xs leading-7 text-slate-500"
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="overflow-y-auto px-4 py-4">
              {lines.map((line, index) => (
                <div
                  key={`${index}-${line}`}
                  className="font-roboto-mono text-sm leading-7 text-slate-200"
                >
                  {line || " "}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetadataCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}

export default withWindow(FileViewerWindow, {
  id: "fileviewer",
  title: "Preview",
  icon: FileIcon,
  defaultSize: { w: 560, h: 480 },
});
