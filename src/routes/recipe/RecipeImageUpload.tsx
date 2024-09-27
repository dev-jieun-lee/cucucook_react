import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Add, Close } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface FocusableButton {
  focus: () => void;
}

const RecipeImageUpload = forwardRef<
  FocusableButton,
  {
    image: File | null;
    serverImage: any;
    onImageChange: (file: File | null) => void;
    onRemoveImage: () => void;
    id: string | "thumbnail";
    name?: string;
    style?: React.CSSProperties; // 스타일 props 추가
    isServerImgVisible: boolean;
  }
>(
  (
    {
      image,
      serverImage,
      onImageChange,
      onRemoveImage,
      id,
      style,
      name,
      isServerImgVisible: initialServerImageVisible,
    },
    ref
  ) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const buttonContainerRef = useRef<HTMLDivElement | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [serverImgId, setServerImgId] = useState<string>("");
    const [isServerImgVisible, setIsServerImgVisible] = useState<boolean>(
      initialServerImageVisible
    ); // 서버 이미지가 보여지는지 여부

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];

        if (!file.type.startsWith("image/")) {
          alert(t("recipe.error.is_not_img")); // 경고 메시지
          return;
        }

        onImageChange(file);
        const imageUrl = URL.createObjectURL(file); // 파일에서 이미지 URL 생성
        setImagePreview(imageUrl); // 이미지 미리보기 URL 업데이트
        setIsServerImgVisible(false); // 서버 이미지 숨김
      }
    };
    // 부모 컴포넌트가 ref를 사용하여 buttonRef에 접근할 수 있도록 함
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (buttonContainerRef.current) {
          buttonContainerRef.current.focus();
        }
      },
    }));

    // 이미지 프리뷰 설정 및 업데이트
    useEffect(() => {
      if (serverImage && isServerImgVisible) {
        const serverImageUrl = `${process.env.REACT_APP_API_URL}${serverImage.webImgPath}/${serverImage.serverImgName}.${serverImage.extension}`;
        setImagePreview(serverImageUrl); // 서버 이미지 URL 설정
        setServerImgId(serverImage.imgId); // 서버 이미지 ID 설정
      } else if (image && image instanceof File) {
        const imageUrl = URL.createObjectURL(image);
        setImagePreview(imageUrl); // 업로드한 파일 미리보기 설정
      } else {
        setImagePreview(""); // 이미지 없을 때 빈 값 설정
      }
    }, [serverImage, image, isServerImgVisible]);

    useEffect(() => {
      if (initialServerImageVisible !== null) {
        setIsServerImgVisible(initialServerImageVisible);
      }
    }, [initialServerImageVisible]);

    return (
      <Box>
        {!isServerImgVisible && !image ? (
          <Box
            ref={buttonContainerRef}
            tabIndex={-1} // div가 포커스를 받을 수 있도록 설정
          >
            <Button
              component="label"
              variant="outlined"
              sx={{
                width: "100%",
                position: "relative",
                aspectRatio: "4/3",
                padding: "25% 0",
                overflow: "hidden",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                ...style,
              }}
            >
              <Add fontSize="large" />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  handleImageChange(e);
                  setIsServerImgVisible(false);
                }}
                id={id}
              />
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "4/3",
              overflow: "hidden",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
            }}
          >
            <img
              src={imagePreview}
              alt="preview"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "translate(-50%, -50%)",
              }}
            />
            <IconButton
              onClick={() => {
                setIsServerImgVisible(false); // 서버 이미지 숨김
                onRemoveImage(); // 이미지 제거
              }}
              sx={{
                position: "absolute",
                top: 2,
                right: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.7),
                color: "primary.contrastText",
                "&:hover": {
                  backgroundColor: "primary.main",
                },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        )}
        <input
          id={`${id}_server_img_id`}
          name={`${name}_server_img_id`}
          type="hidden"
          value={serverImgId}
        />
      </Box>
    );
  }
);

export default RecipeImageUpload;
