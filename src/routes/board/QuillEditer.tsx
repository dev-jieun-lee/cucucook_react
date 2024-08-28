import ReactQuill, { Quill } from "react-quill";
import EditerModule from "./EditerModule";
import { useMemo, useState } from "react";
import { ImageResize } from "quill-image-resize-module-ts";
import axios from "axios";
Quill.register("modules/ImageResize", ImageResize);

function QuillEditer({ onChange, value }: any){
  
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
      // handlers: {
      //   image: ImageHandler,
      // },
      ImageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize"],
      },
    }),
    []
  );

// //image를 서버로 전달하는 과정
// const ImageHandler = () => {
//   //input type= file DOM을 만든다.
//   const input = document.createElement("input");
//   input.setAttribute("type", "file");
//   input.setAttribute("accept", "image/*");
//   input.click(); //toolbar 이미지를 누르게 되면 이 부분이 실행된다.
//   /*이미지를 선택하게 될 시*/
//   input.onchange = async () => {
//     /*이미지 선택에 따른 조건을 다시 한번 하게 된다.*/
//     const file: any = input.files ? input.files[0] : null;
//     /*선택을 안하면 취소버튼처럼 수행하게 된다.*/
//     if (!file) return;
//     /*서버에서 FormData형식으로 받기 때문에 이에 맞는 데이터형식으로 만들어준다.*/
//     const formData = new FormData();
//     formData.append("profile", file);
//     /*에디터 정보를 가져온다.*/
//     let quillObj = quillRef.current?.getEditor();
//     /*에디터 커서 위치를 가져온다.*/
//     const range = quillObj?.getSelection()!;
//     try {
//       /*서버에다가 정보를 보내준 다음 서버에서 보낸 url을 imgUrl로 받는다.*/
//       const res = await axios.post(
//         "api주소",
//         formData
//       );
//       const imgUrl = res.data;
//       /*에디터의 커서 위치에 이미지 요소를 넣어준다.*/
//       quillObj?.insertEmbed(range.index, "image", `${imgUrl}`);
//     } catch (error) {
//       console.log(error);
//     }
//   };
// };


  return(
    <>
      <div id="toolBar" >
        <EditerModule />
      </div>
      <ReactQuill
        className=""
        theme="snow"
        modules={modules}
        formats={formats}
        style={{ height: "500px"}}
        onChange={onChange}
        value={value}
      />
    </>
  )
}

export default QuillEditer;