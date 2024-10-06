import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import { Box, Divider, Grid, Rating, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { useTheme } from "styled-components";
import Swal from "sweetalert2";
import {
  deleteRecipeComment,
  deleteRecipeCommentHasChild,
} from "../../apis/recipeApi";
import {
  CommentIconButton,
  RecipeCommentList,
  recipeCommonStyles,
} from "../../styles/RecipeStyle";
import RecipeCommentWriteBox from "./RecipeCommentWrite";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../../hooks/errorHandler";

const customStyles = recipeCommonStyles();

const RecipeCommentListBox: React.FC<{
  onCommentListChange: () => void;
  commentList: any[];
  recipeId: string;
}> = ({ onCommentListChange, commentList, recipeId }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null); // 활성화된 댓글 ID 상태 추가
  const [commentBoxStatus, setCommentBoxStatus] = useState<string | null>(null); // 활성화된 댓글 ID 상태 추가

  const handleDeleteCommentClick = async (
    commentId: any,
    hasChildComment: any
  ) => {
    try {
      const result = await Swal.fire({
        icon: "warning",
        title: t("text.delete"),
        text: t("recipe.alert.delete_comment_confirm"),
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: t("text.yes"),
        cancelButtonText: t("text.no"),
      });

      // 결과 확인 후 API 호출
      if (result.isConfirmed) {
        const params = {
          recipeId: recipeId as string,
          commentId: commentId,
          hasChildComment: hasChildComment,
        };
        if (hasChildComment) {
          // 대댓글이 있을 때 호출하는 API
          deleteRecipeCommentHasChildMutation(params);
        } else {
          // 대댓글이 없을 때 호출하는 API
          deleteRecipeCommentMutation(params);
        }
      }
    } catch (error) {
      handleApiError(error, navigate, t);
      //return { message: "E_ADMIN", success: false, data: [], addData: {} };
    }
  };

  //댓글삭제
  const { mutate: deleteRecipeCommentHasChildMutation } = useMutation(
    (params: {
      recipeId: string;
      commentId: string;
      hasChildComment: boolean;
    }) => deleteRecipeCommentHasChild(params),
    {
      onSuccess: (data) => {
        if (data.success) {
          Swal.fire({
            icon: "success",
            title: t("text.delete"),
            text: t("recipe.alert.delete_comment_sucecss"),
            showConfirmButton: true,
            confirmButtonText: t("text.check"),
          });
          onCommentListChange();
        } else {
          Swal.fire({
            icon: "error",
            title: t("text.delete"),
            text: t("CODE." + data.message),
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
  //대댓글있는값삭제
  const { mutate: deleteRecipeCommentMutation } = useMutation(
    (params: {
      recipeId: string;
      commentId: string;
      hasChildComment: boolean;
    }) => deleteRecipeComment(params),
    {
      onSuccess: (data) => {
        if (data.success) {
          Swal.fire({
            icon: "success",
            title: t("text.delete"),
            text: t("recipe.alert.delete_comment_sucecss"),
            showConfirmButton: true,
            confirmButtonText: t("text.check"),
          });
          onCommentListChange();
        } else {
          Swal.fire({
            icon: "error",
            title: t("text.delete"),
            text: t("CODE." + data.message),
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

  const handleReplyButtonClick = (commentId: string, status: string) => {
    if (commentId === activeCommentId && status === commentBoxStatus) {
      handleReplyCancelEdit();
    } else {
      setActiveCommentId(commentId);
      setCommentBoxStatus(status);
    }
  };

  const handleReplyCancelEdit = () => {
    setActiveCommentId(null);
    setCommentBoxStatus(null);
  };

  return (
    <RecipeCommentList>
      <Box className="comment-list-container">
        <Box className="comment-container">
          {commentList.map((comment) => (
            <React.Fragment key={comment.commentId}>
              <Box
                padding={"20px 0"}
                className={
                  comment.status === "0"
                    ? "comment-content-container-parents"
                    : "comment-content-container-child"
                }
              >
                {((commentBoxStatus === "edit" &&
                  activeCommentId !== comment.commentId) ||
                  commentBoxStatus !== "edit") && (
                  <>
                    <Grid
                      container
                      sx={{
                        display: "grid",
                        gap: 2,

                        gridTemplateColumns:
                          comment.status === "0"
                            ? "1fr 100px"
                            : "30px 1fr 100px",
                        "& > .MuiGrid-item": {
                          padding: 0,
                          margin: 0,
                        },
                        ...customStyles.resetMuiGrid,
                        paddingBottom: "10px",
                      }}
                    >
                      {comment.status !== "0" && (
                        <Grid>
                          <SubdirectoryArrowRightIcon
                            fontSize="medium"
                            sx={{ color: theme.mainColor }}
                          />
                        </Grid>
                      )}
                      <Grid item className="comment-content">
                        <Box className="comment-info">
                          <Typography
                            className="comment-info-name"
                            component="span"
                            variant="subtitle1"
                          >
                            {comment.member.name}
                          </Typography>
                          <Typography
                            className="comment-info-name"
                            component="span"
                            variant="subtitle1"
                            sx={{
                              verticalAlign: "text-top",
                              lineHeight: 0,
                            }}
                          >
                            <Rating
                              name="read-only"
                              value={comment.rate || 0}
                              readOnly
                              size="small"
                            />
                          </Typography>

                          <Typography
                            className="comment-info-dt"
                            component="span"
                            variant="subtitle2"
                          >
                            {comment.regDt}
                          </Typography>
                        </Box>
                        <Box>
                          {comment.delYn === "N"
                            ? comment.comment
                            : t("recipe.sentence.delete_comment")}
                        </Box>
                      </Grid>
                      {comment.delYn === "N" && (
                        <>
                          <Grid
                            item
                            className="comment-icons"
                            textAlign={"right"}
                          >
                            {comment.status === "0" && user?.memberId && (
                              <>
                                <CommentIconButton
                                  aria-label="reply"
                                  onClick={() =>
                                    handleReplyButtonClick(
                                      comment.commentId,
                                      "reply"
                                    )
                                  }
                                >
                                  <ReplyIcon
                                    sx={{ transform: "rotate(180deg)" }}
                                  />
                                </CommentIconButton>
                              </>
                            )}

                            {(user?.memberId === comment.member.memberId ||
                              user?.role === "0" ||
                              user?.role === "2") && (
                              <>
                                {user?.memberId === comment.member.memberId && (
                                  <CommentIconButton
                                    aria-label="edit"
                                    onClick={() =>
                                      handleReplyButtonClick(
                                        comment.commentId,
                                        "edit"
                                      )
                                    }
                                  >
                                    <EditIcon />
                                  </CommentIconButton>
                                )}
                                <CommentIconButton
                                  aria-label="delete"
                                  onClick={() =>
                                    handleDeleteCommentClick(
                                      comment.commentId,
                                      comment.hasChildComment
                                    )
                                  }
                                >
                                  <ClearIcon />
                                </CommentIconButton>
                              </>
                            )}
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </>
                )}

                {/* 활성화된 댓글 ID와 현재 댓글 ID가 같을 때만 RecipeCommentWriteBox를 표시 */}
                {activeCommentId === comment.commentId && (
                  <RecipeCommentWriteBox
                    onCommentSubmit={() => {
                      onCommentListChange();
                      handleReplyCancelEdit(); // 댓글 작성 후 취소
                    }}
                    activeCommentId={activeCommentId}
                    activeBoxStatus={commentBoxStatus}
                    onCancel={handleReplyCancelEdit} // 취소 함수 전달
                  />
                )}
              </Box>
              <Divider />
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </RecipeCommentList>
  );
};
export default RecipeCommentListBox;
