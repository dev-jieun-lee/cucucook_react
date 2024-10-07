import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import React, { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getBoardFilesList } from "../../apis/boardApi";
import { useAuth } from "../../auth/AuthContext";
import { BoardFilesListContainer } from "../../styles/BoardStyle";
import { convertFileSize, fileTypeIcon } from "../utils/commonUtil";

const BoardFilesList: React.FC<{
  boardId: string;
}> = memo(({ boardId }) => {
  const { user } = useAuth(); //로그인 상태관리
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  //업로드 파일 목록 가져오기
  const getUploadFilesList = async () => {
    setLoading(true);
    // 인위적인 지연 시간 추가
    await new Promise((resolve) => setTimeout(resolve, 100));

    const uploadFileList = await getBoardFilesList(boardId);
    console.log("Fetched Files:", uploadFileList); // API 결과 로그
    setLoading(false);
    return uploadFileList.data;
  };

  const { data: uploadFileList, isLoading: boardFileLoading } = useQuery(
    ["uploadFilesList", boardId],
    getUploadFilesList
  );

  const fileDownload = useCallback((uploadFileItem: any) => {
    const url = `${process.env.REACT_APP_FILE_URL}${uploadFileItem.webFilePath}/${uploadFileItem.serverFileName}.${uploadFileItem.extension}`;

    fetch(url, { method: "GET" })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${uploadFileItem.orgFileName}.${uploadFileItem.extension}`;
        document.body.appendChild(a);
        a.click();
        setTimeout((_) => {
          window.URL.revokeObjectURL(url);
        }, 1000);
        a.remove();
      })
      .catch((err) => {
        console.error("err", err);
      });
  }, []);

  if (loading || boardFileLoading) {
    return <></>;
  }

  return (
    <>
      {uploadFileList && uploadFileList.length > 0 && (
        <BoardFilesListContainer>
          <Box className="file-list-box">
            {uploadFileList.map((uploadFileItem: any) => (
              <List
                key={uploadFileItem.fileId}
                className="file-list"
                sx={{ width: "100%", bgcolor: "background.paper" }}
              >
                <ListItem
                  className="file-list-item"
                  onClick={() => fileDownload(uploadFileItem)}
                >
                  <ListItemIcon>
                    {fileTypeIcon(
                      `${uploadFileItem.orgFileName}.${uploadFileItem.extension}`,
                      uploadFileItem.fileType
                    )}
                  </ListItemIcon>
                  <ListItemText>
                    {uploadFileItem.orgFileName}.{uploadFileItem.extension} (
                    {convertFileSize(uploadFileItem.fileSize)})
                  </ListItemText>
                </ListItem>
              </List>
            ))}
          </Box>
        </BoardFilesListContainer>
      )}
    </>
  );
});

export default BoardFilesList;
