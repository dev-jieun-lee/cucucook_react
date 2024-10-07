import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileInput, UploadBoxContainer } from "../../styles/BoardStyle";
import {
  convertFileSize,
  fileTypeIcon,
  validateExtension,
} from "../utils/commonUtil";

// 첨부파일 인터페이스 정의
interface UploadFiles {
  file: File | null;
  fileName: string;
  fileType: string;
  fileSize: string;
  fileId: string;
}

const BoardFilesUpload: React.FC<{
  values: UploadFiles[];
  onChangeFile: (uploadFileList: UploadFiles[]) => void;
  onDeleteFile: (
    uploadFileList: UploadFiles[],
    updateDelFileIds: string[]
  ) => void;
}> = memo(({ values, onChangeFile, onDeleteFile }) => {
  const { t } = useTranslation();
  const uploadRef = useRef<HTMLInputElement>(null);

  //업로드 허용하는 확장자
  const allowedExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "svg",
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
    "hwp",
    "hwpx",
    "hwt",
    "zip",
    "7z",
    "mp3",
    "wav",
    "mp4",
    "mov",
    "avi",
    "mkv",
  ];

  // 첨부파일 상태
  const [uploadFiles, setUploadFiles] = useState<UploadFiles[]>([]);
  const [delFileIds, setDelFileIds] = useState<string[]>([]);
  const [isDrag, setIsDrag] = useState<boolean>(false); //드래그 상태 확인

  // 파일 업로드 클릭
  const handleUploadClick = () => {
    uploadRef.current?.click();
  };

  // 파일 목록 변경 시
  const handleUploadListChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setOnChangeFile(files);
    }
  };

  // 파일이 삭제될 때
  const handleDeleteFile = (
    e: React.MouseEvent<HTMLButtonElement>,
    idx: number,
    fileId: string
  ) => {
    const updatedFiles = [...uploadFiles].filter((_, index) => index !== idx);
    const updateDelFileIds = fileId ? [...delFileIds, fileId] : delFileIds;

    setUploadFiles(updatedFiles);
    setDelFileIds(updateDelFileIds);

    onDeleteFile(updatedFiles, updateDelFileIds);
  };

  // 파일 목록이 변경될 때 실행되는 함수
  const setOnChangeFile = (files: FileList) => {
    // 사용불가 확장자 있는지 체크
    const unusableExtension = validateExtension(files, allowedExtensions);
    if (unusableExtension.length > 0) {
      alert(
        t("CODE.E_UNUSABLE_EXTENSION", { extension: t(unusableExtension) })
      );
      return;
    }
    const newFiles = Array.from(files).map((file) => ({
      file,
      fileName: file.name,
      fileType: file.type,
      fileSize: convertFileSize(file.size),
      fileId: "",
    }));

    const updatedFiles = [...uploadFiles, ...newFiles];
    setUploadFiles(updatedFiles);
    onChangeFile(updatedFiles); // 변경된 파일 목록으로 상태 업데이트
  };

  //드래그 상태에서 마우스가 영역에 처음 들어왔을때
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDrag(true);
    }
  };
  //드래그 상태에서 마우스가 영역에서 나갈때
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDrag(false);
    }
  };

  //드래그 상태에서 마우스가 영역에 있을때
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  //해당 영역에 파일을 놓을때
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDrag(false);

    if (e.dataTransfer) {
      const files = e.dataTransfer.files;
      if (files) {
        setOnChangeFile(files);
      }
    }
  };

  useEffect(() => {
    console.log(values);
    setUploadFiles(values);
  }, [values]);

  return (
    <>
      <FileInput
        type="file"
        onChange={handleUploadListChange}
        multiple
        ref={uploadRef}
      />
      <UploadBoxContainer>
        <Box
          className={`upload-box ${isDrag ? "isDrag" : ""}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {uploadFiles.length > 0 ? (
            <Box className="file-list-box">
              {uploadFiles.map((uploadFileItem, index) => (
                <List
                  key={index}
                  className="file-list"
                  sx={{ width: "100%", bgcolor: "background.paper" }}
                >
                  <ListItem
                    className="file-list-item"
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={(e) =>
                          handleDeleteFile(e, index, uploadFileItem.fileId)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      {fileTypeIcon(
                        uploadFileItem.fileName,
                        uploadFileItem.fileType
                      )}
                    </ListItemIcon>
                    <ListItemText>
                      {uploadFileItem.fileName} ({uploadFileItem.fileSize})
                    </ListItemText>
                  </ListItem>
                </List>
              ))}
            </Box>
          ) : (
            <Box className="file-upload-box-wrap" onClick={handleUploadClick}>
              <Box className="file-upload-box">
                <FileUploadIcon />
                <Typography component="div">
                  <Box className="file-upload-info">
                    {t("menu.board.alert.file_upload_info")}
                  </Box>
                  <Box className="file-upload-allowed-extensions">
                    {t("menu.board.alert.allowed_extensions")} (
                    {allowedExtensions.join(", ")})
                  </Box>
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </UploadBoxContainer>
    </>
  );
});

export default BoardFilesUpload;
