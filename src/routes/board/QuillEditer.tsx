import ReactQuill from "react-quill-new";
import EditerModule from "./EditerModule";
import "react-quill-new/dist/quill.snow.css";
import { forwardRef, useMemo, useState } from "react";

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
    "indent",
    "link",
    "image",
    "color",
    "background",
    "align",
    "script",
    "code-block",
  ];

  const modules: {} = useMemo(
    () => ({
      toolbar: {
        container: "#toolBar",
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
