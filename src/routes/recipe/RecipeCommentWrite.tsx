import {
  Box,
  Button,
  Grid,
  Rating,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import {
  getRecipeComment,
  insertRecipeComment,
  updateRecipeComment,
} from "../../apis/recipeApi";

import { useAuth } from "../../auth/AuthContext";
import { handleApiError } from "../../hooks/errorHandler";
import {
  RecipeCommentWrite,
  recipeCommonStyles,
} from "../../styles/RecipeStyle";

const customStyles = recipeCommonStyles();

interface RecipeCommentWriteBoxProps {
  onCommentSubmit: () => void;
  activeBoxStatus?: string | null; // 현재 박스상태
  activeCommentId?: string | null | undefined; // 활성화된 답글/수정 comment_id가져오기
  onCancel?: () => void;
}

const RecipeCommentWriteBox: React.FC<RecipeCommentWriteBoxProps> = ({
  onCommentSubmit,
  activeBoxStatus,
  activeCommentId,
  onCancel,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { recipeId } = useParams();
  const [commentId, setCommentId] = useState<string | null>(null);
  const [pCommentId, setPCommentId] = useState<string | null>(null);
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  useEffect(() => {
    if (activeBoxStatus === "edit" && activeCommentId)
      setCommentId(activeCommentId);
    else if (activeBoxStatus === "reply" && activeCommentId)
      setPCommentId(activeCommentId);
    else {
      setCommentId(null);
      setPCommentId(null);
    }
  }, [activeBoxStatus, activeCommentId]);

  const params = {
    commentId: commentId,
    recipeId: recipeId,
  };

  //수정일 경우 코멘트 데이터 가져오기
  const fetchRecipeComment = async () => {
    try {
      const recipeComment = await getRecipeComment(params);
      return recipeComment.data;
    } catch (error) {
      handleApiError(error, navigate, t);
      //return { message: "E_ADMIN", success: false, data: [], addData: {} };
    }
  };

  const { data: recipeComment } = useQuery(
    ["recipeComment", commentId],
    fetchRecipeComment,
    { enabled: !!commentId }
  );

  // commentId 있을 경우 수정, 없을 경우 생성
  const mutation = useMutation(
    (values) =>
      commentId ? updateRecipeComment(values) : insertRecipeComment(values),
    {
      onSuccess: (data) => {
        console.log(data);
        if (data && data.success) {
          Swal.fire({
            icon: "success",
            title: t("text.save"),
            text: t(`CODE.${data.message}`),
            confirmButtonText: t("text.check"),
            timer: 1000,
            showConfirmButton: false,
            timerProgressBar: true,
          });

          formik.resetForm();
          onCommentSubmit();
        } else {
          Swal.fire({
            icon: "error",
            title: t("text.save"),
            text: t(`CODE.${data.message}`),
            showConfirmButton: true,
            confirmButtonText: t("text.check"),
          });
        }
      },
      onError: (error) => {
        handleApiError(error, navigate, t);
      },
    }
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      memberId: user?.memberId,
      recipeId: recipeId,
      commentId: commentId,
      comment: commentId ? recipeComment?.data.comment || "" : "",
      rate: commentId ? recipeComment?.data.rate || 0 : 0,
      status: commentId ? recipeComment?.data.status || 0 : pCommentId ? 1 : 0,
      pCommentId: pCommentId ? pCommentId || 0 : null,
      name:
        activeBoxStatus === "edit" ? recipeComment?.data.member.name || 0 : "",
    },
    validationSchema: Yup.object({
      comment: Yup.string().required(t("recipe.alert.empty_comment")),
      rate: Yup.number().min(1, t("recipe.alert.empty_rate")),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      if (!values.comment.trim()) {
        Swal.fire({ icon: "warning", text: t("recipe.alert.empty_comment") });
        return;
      }
      mutation.mutate(values as any);
    },
  });

  // 버튼 렌더링 함수
  const renderButtons = () => (
    <Box marginTop="10px" textAlign="right">
      <Button variant="contained" type="submit">
        {activeBoxStatus === "reply"
          ? t("text.comment_reply")
          : activeBoxStatus === "edit"
          ? t("text.comment_edit")
          : t("text.comment_write")}
      </Button>
      {activeBoxStatus && (
        <Button
          variant="outlined"
          sx={{ marginLeft: "10px" }}
          onClick={onCancel}
        >
          {t("text.comment_cancel")}
        </Button>
      )}
    </Box>
  );

  return (
    <RecipeCommentWrite>
      <form className="form" onSubmit={formik.handleSubmit}>
        {activeBoxStatus !== "edit" ? (
          <>
            <Box className="comment-wirte-container">
              <Grid
                container
                spacing={2}
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: "40px 1fr",
                  "& > .MuiGrid-item": {
                    padding: 0,
                    margin: 0,
                    width: 100,
                  },
                  ...customStyles.resetMuiGrid,
                  paddingBottom: "10px",
                }}
              >
                <Grid sx={{ textAlign: "center" }}>{t("text.rate")}</Grid>
                <Grid>
                  <Tooltip
                    title={formik.errors.rate ? String(formik.errors.rate) : ""}
                    open={Boolean(formik.touched.rate && formik.errors.rate)}
                    arrow
                    placement="top-start"
                  >
                    <span>
                      <Rating
                        name={
                          !user?.memberId ? "simple-controlled" : "read-only"
                        }
                        value={formik.values.rate || 0}
                        onChange={(event, newValue) => {
                          formik.setFieldValue("rate", newValue);
                        }}
                        readOnly={!user?.memberId}
                      />
                    </span>
                  </Tooltip>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: "40px 1fr",
                  "& > .MuiGrid-item": {
                    padding: 0,
                    margin: 0,
                    width: 100,
                  },
                  ...customStyles.resetMuiGrid,
                }}
              >
                <Grid sx={{ textAlign: "center" }}>{t("text.comment")}</Grid>
                <Grid>
                  <TextField
                    disabled={!user?.memberId}
                    label={
                      !user?.memberId
                        ? t("recipe.error.comment_no_member")
                        : t("text.comment")
                    }
                    multiline
                    rows={3}
                    variant="outlined"
                    fullWidth
                    value={formik.values.comment}
                    error={
                      formik.touched.comment && Boolean(formik.errors.comment)
                    }
                    onChange={(event) =>
                      formik.setFieldValue("comment", event.target.value)
                    }
                    helperText={
                      formik.touched.comment && formik.errors.comment
                        ? t("recipe.alert.empty_comment") // 에러 메시지 텍스트
                        : "" // 빈 값이면 helperText를 빈 문자열로 설정
                    }
                  />
                </Grid>
              </Grid>
              {user?.memberId ? (
                renderButtons()
              ) : (
                <Box marginTop="10px" textAlign="right"></Box>
              )}
            </Box>
          </>
        ) : (
          <>
            <Box>
              <Grid item className="comment-content">
                <Box className="comment-info" marginBottom={"10px"}>
                  <Typography
                    className="comment-info-name"
                    component="span"
                    variant="subtitle1"
                  >
                    {recipeComment?.data.member.name}
                  </Typography>
                  <Typography
                    className="comment-info-name"
                    component="span"
                    variant="subtitle1"
                    sx={{ verticalAlign: "text-top", lineHeight: 0 }}
                  >
                    <Tooltip
                      title={
                        formik.errors.rate ? String(formik.errors.rate) : ""
                      }
                      open={Boolean(formik.touched.rate && formik.errors.rate)}
                      arrow
                      placement="top-start"
                    >
                      <span>
                        <Rating
                          name={
                            !user?.memberId ? "simple-controlled" : "read-only"
                          }
                          value={formik.values.rate || 0}
                          onChange={(event, newValue) => {
                            formik.setFieldValue("rate", newValue);
                          }}
                          readOnly={!user?.memberId}
                        />
                      </span>
                    </Tooltip>
                  </Typography>

                  <Typography
                    className="comment-info-dt"
                    component="span"
                    variant="subtitle2"
                  ></Typography>
                </Box>
                <Box>
                  <Grid>
                    <TextField
                      label={t("text.comment")}
                      multiline
                      rows={3} // 텍스트 영역의 초기 높이 설정
                      variant="outlined" // 외곽선이 있는 스타일
                      fullWidth // 가로로 전체 너비를 차지
                      value={formik.values.comment}
                      error={
                        formik.touched.comment && Boolean(formik.errors.comment)
                      }
                      onChange={(event) =>
                        formik.setFieldValue("comment", event.target.value)
                      }
                      helperText={
                        formik.touched.comment && formik.errors.comment
                          ? t("recipe.alert.empty_comment") // 에러 메시지 텍스트
                          : "" // 빈 값이면 helperText를 빈 문자열로 설정
                      }
                    />
                  </Grid>
                </Box>
              </Grid>
              {user?.memberId ? (
                renderButtons()
              ) : (
                <Box marginTop="10px" textAlign="right"></Box>
              )}
            </Box>
          </>
        )}
      </form>
    </RecipeCommentWrite>
  );
};

export default RecipeCommentWriteBox;
