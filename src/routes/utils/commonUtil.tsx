import AttachFileIcon from "@mui/icons-material/AttachFile";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import MovieIcon from "@mui/icons-material/Movie";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import React from "react";

//바이트값 파일 사이즈 단위 변경
export const convertFileSize = (fileSize: number): string => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = 0;
  let sizeInBytes =
    typeof fileSize === "string" ? parseFloat(fileSize) : fileSize;

  if (
    typeof sizeInBytes !== "number" ||
    isNaN(sizeInBytes) ||
    sizeInBytes < 0
  ) {
    return "0 Bytes";
  }
  while (sizeInBytes > 1024) {
    sizeInBytes /= 1024;
    i++;
  }

  return `${sizeInBytes.toFixed(2) + sizes[i]}`;
};

//첨부파일 확장자 제한
export const validateExtension = (
  files: FileList,
  extension: string[]
): string => {
  // 소스에서 설정한 확장자 아니면 업로드 불가
  let isUnusableType = false;
  let unusable: string[] = [];
  for (const fileItem of files) {
    const fileExtension = fileItem.name.split(".").pop()?.toLowerCase();
    if (fileExtension) {
      if (!unusable.includes(fileExtension)) {
        isUnusableType = !extension.includes(fileExtension);
        if (isUnusableType) {
          unusable.push(fileExtension);
        }
      }
    }
  }

  return unusable.join(", ");
};

//파일 타입별로 아이콘 다르게
const mimeTypeIconMap: { [key: string]: React.ReactNode } = {
  "image/jpeg": <ImageIcon />,
  "image/png": <ImageIcon />,
  "image/gif": <ImageIcon />,
  "image/bmp": <ImageIcon />,
  "image/svg+xml": <ImageIcon />,
  "application/pdf": <PictureAsPdfIcon />,
  "application/msword": <DescriptionIcon />,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (
    <DescriptionIcon />
  ),
  "application/vnd.ms-excel": <DescriptionIcon />,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": (
    <DescriptionIcon />
  ),
  "application/vnd.ms-powerpoint": <DescriptionIcon />,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": (
    <DescriptionIcon />
  ),
  "text/plain": <DescriptionIcon />,
  "application/vnd.hancom.hwp": <DescriptionIcon />,
  "application/vnd.hancom.hwpx": <DescriptionIcon />,
  "application/vnd.hancom.hwt": <DescriptionIcon />,
  "application/zip": <DescriptionIcon />,
  "application/x-7z-compressed": <DescriptionIcon />,
  "audio/mpeg": <AudiotrackIcon />,
  "audio/wav": <AudiotrackIcon />,
  "video/mp4": <MovieIcon />,
  "video/quicktime": <MovieIcon />,
  "video/x-msvideo": <MovieIcon />,
  "video/x-matroska": <MovieIcon />,
};

//파일 확장자별로 아이콘 다르게
const IconExtensionMap: { [extension: string]: React.ReactNode } = {
  jpg: <ImageIcon />,
  jpeg: <ImageIcon />,
  bmp: <ImageIcon />,
  gif: <ImageIcon />,
  png: <ImageIcon />,
  svg: <ImageIcon />,
  pdf: <PictureAsPdfIcon />,
  doc: <DescriptionIcon />,
  docx: <DescriptionIcon />,
  xls: <DescriptionIcon />,
  xlsx: <DescriptionIcon />,
  ppt: <DescriptionIcon />,
  pptx: <DescriptionIcon />,
  txt: <DescriptionIcon />,
  hwp: <DescriptionIcon />,
  hwpx: <DescriptionIcon />,
  hwt: <DescriptionIcon />,
  zip: <DescriptionIcon />,
  "7z": <DescriptionIcon />,
  mp3: <AudiotrackIcon />,
  wav: <AudiotrackIcon />,
  mp4: <MovieIcon />,
  mov: <MovieIcon />,
  avi: <MovieIcon />,
  mkv: <MovieIcon />,
};

export const fileTypeIcon = (
  fileId: string,
  fileType: string
): React.ReactNode => {
  if (fileId) {
    const fileExtension = fileId.split(".").pop()?.toLowerCase();
    return IconExtensionMap[fileExtension || ""] || <AttachFileIcon />;
  } else return mimeTypeIconMap[fileType] || <AttachFileIcon />;
};
