import ReactQuill, { Quill } from "react-quill";
import EditerModule from "./EditerModule";
import { forwardRef, useMemo, useState } from "react";
import { ImageResize } from "quill-image-resize-module-ts";
Quill.register("modules/ImageResize", ImageResize);

const QuillEditer = forwardRef(({ onChange, value }: any, ref: any) => {
  const formats: string[] = [
    "header",
    "size",
    "font",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "background",
    "align",
    "script",
    "code-block",
    "clean",
  ];

  const modules: {} = useMemo(
    () => ({
      toolbar: {
        container: "#toolBar",
      },
      ImageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize"],
      },
    }),
    []
  );

  return (
    <>
      <div id="toolBar">
        <EditerModule />
      </div>
      <ReactQuill
        ref={ref} // forwardRef를 사용하여 ref 전달
        className=""
        theme="snow"
        modules={modules}
        formats={formats}
        style={{ height: "500px" }}
        onChange={onChange}
        value={value}
      />
    </>
  );
});


export default QuillEditer;