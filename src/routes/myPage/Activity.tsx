import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";
import { Wrapper } from "../../styles/CommonStyles";
import {
  ActivityHeaderListItem,
  ActivityRowListItem,
  MypageHeaderListItem,
  MypageRowListItem,
  MyPageTitle,
  SummaryCountArea,
  SummaryDataArea,
} from "../../styles/MypageStyle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import { useEffect, useState } from "react";
import {
  fetchActivityStats,
  fetchLikedRecipes,
  fetchMemberBoardList,
  fetchMyComments,
  fetchMyRecipeList,
} from "../../apis/mypageApi";
import {
  Box,
  Button,
  List,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";

function Activity() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(0);
  const [writeCount, setWriteCount] = useState(0);
  const [recipeCount, setRecipeount] = useState(0);
  const [replyCount, setReplyCount] = useState(0);
  const [likedRecipes, setLikedRecipes] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [latestReplies, setLatestReplies] = useState<any[]>([]);
  const [latestRecipes, setLatestRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.memberId) {
      fetchAllData(user.memberId);
    }
  }, [user?.memberId]);

  const fetchAllData = async (memberId: number) => {
    setIsLoading(true);
    try {
      const [stats, likedRecipes, posts, recipes, replies] = await Promise.all([
        fetchActivityStats(memberId),
        fetchLikedRecipes(memberId),
        fetchMemberBoardList(memberId, 3),
        fetchMyRecipeList(memberId, 3),
        fetchMyComments(memberId, 1, 3),
      ]);
      console.log(stats);

      console.log("Liked Recipes:", likedRecipes); // 데이터 로그 출력
      console.log("Posts:", posts);
      console.log("Recipes:", recipes);
      console.log("Replies:", replies);
      setLikeCount(stats.likeCount);
      setWriteCount(stats.writeCount);
      setReplyCount(stats.replyCount);
      setRecipeount(stats.recipeCount);
      setLikedRecipes(likedRecipes);
      setLatestPosts(posts);
      setLatestRecipes(recipes);
      setLatestReplies(replies);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDetail = (kind: string, id: string) => {
    if (kind === "like" || kind === "recipe" || kind === "comment") {
      navigate(`/recipe/member_recipe/${id}`);
    } 
    else if (kind === "NOTICE") {
      navigate(`/notice/${id}`);
    }
    else if (kind === "FAQ") {
      navigate(`/faq/${id}`);
    }
    else if (kind === "QNA") {
      navigate(`/qna/${id}`);
    }
  };

  const onMoreData = (kind: string) => {
    switch (kind) {
      case "like":
        navigate(`/mypage/activity/LikeLists`);
        break;
      case "writing":
        navigate(`/mypage/activity/MyWrites`);
        break;
      case "recipe":
        navigate(`/mypage/activity/MyRecipes`);
        break;
      case "comment":
        navigate(`/mypage/activity/MyReplys`);
        break;
      default:
        break;
    }
  };

  //로딩
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <MyPageTitle>
        <span>{t("mypage.greetings", { name: user?.name })}</span>
      </MyPageTitle>
      <SummaryCountArea>
        <div className="like-cnt grid">
          <FavoriteIcon className="icon" />
          <p className="kind">{t("text.like")}</p>
          <p className="count">{likeCount}</p>
        </div>
        <div className="like-cnt grid">
          <ListAltIcon className="icon" />
          <p className="kind">{t("text.recipe")}</p>
          <p className="count">{recipeCount}</p>
        </div>
        <div className="like-cnt grid">
          <SubdirectoryArrowRightIcon className="icon" />
          <p className="kind">{t("text.comment")}</p>
          <p className="count">{replyCount}</p>
        </div>
      </SummaryCountArea>
      <SummaryDataArea>
        <div className="like grid">
          <div className="title">
            <span>
              <FavoriteIcon className="icon" />
              {t("mypage.myLikes")}
            </span>
            <Button
              variant="text"
              color="primary"
              onClick={() => onMoreData("like")}
            >
              + {t("text.more_view")}
            </Button>
          </div>
          <div className="content">
            <List>
              <ActivityHeaderListItem  className="list-item header">
                <Box className="activity-no">
                  <span>No.</span>
                </Box>
                <Box className="activity-title">
                  <span>{t("text.title")}</span>
                </Box>
                <Box className="date">
                  <span>{t("text.register_date")}</span>
                </Box>
              </ActivityHeaderListItem>
              {likedRecipes && likedRecipes.length > 0 ? (
                likedRecipes?.slice(0, 3).map((item, index) => (
                  <ActivityRowListItem
                    className="list-item"
                    key={item.recipeId}
                    onClick={() => onDetail("recipe", item.recipeId)}
                  >
                    <Box className="activity-no">
                      <span>{index + 1}</span>
                    </Box>
                    <Box className="contents">
                      <Box className="activity-title">
                        <span>{item.title}</span>
                      </Box>
                    </Box>
                    <Box className="date">
                      <span>{dayjs(item.regDt).format("YYYY-MM-DD HH:mm")}</span>
                    </Box>
                  </ActivityRowListItem>
                ))
              ) : (
                <Typography>{t("sentence.no_data")}</Typography>
              )}
            </List>
            {likedRecipes && likedRecipes.length > 0 ? (
              <MoreVertIcon className="more-icon" />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="recipe grid">
          <div className="title">
            <span>
              <ListAltIcon className="icon" />
              {t("mypage.myRecipe")}
            </span>
            <Button
              variant="text"
              color="primary"
              onClick={() => onMoreData("recipe")}
            >
              + {t("text.more_view")}
            </Button>
          </div>
          <div className="content">
            <List>
              <ActivityHeaderListItem  className="list-item header">
                <Box className="activity-no">
                  <span>No.</span>
                </Box>
                <Box className="activity-title">
                  <span>{t("text.title")}</span>
                </Box>
                <Box className="date">
                  <span>{t("text.register_date")}</span>
                </Box>
              </ActivityHeaderListItem>
              {latestRecipes && latestRecipes.length > 0 ? (
                latestRecipes?.slice(0, 3).map((item, index) => (
                  <ActivityRowListItem
                    className="list-item"
                    key={item.recipeId}
                    onClick={() => onDetail("recipe", item.recipeId)}
                  >
                    <Box className="activity-no">
                      <span>{index + 1}</span>
                    </Box>
                    <Box className="contents">
                      <Box className="activity-title">
                        <span>{item.title}</span>
                      </Box>
                    </Box>
                    <Box className="date">
                      <span>{dayjs(item.regDt).format("YYYY-MM-DD HH:mm")}</span>
                    </Box>
                  </ActivityRowListItem>
                ))
              ) : (
                <Typography>{t("sentence.no_data")}</Typography>
              )}
            </List>
            {latestRecipes && latestRecipes.length > 0 ? (
              <MoreVertIcon className="more-icon" />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="writing grid">
          <div className="title">
            <span>
              <ListAltIcon className="icon" />
              {t("mypage.myWriting")}
            </span>
            <Button
              variant="text"
              color="primary"
              onClick={() => onMoreData("writing")}
            >
              + {t("text.more_view")}
            </Button>
          </div>
          <div className="content">
            <List>
              <ActivityHeaderListItem  className="list-item header">
                <Box className="activity-no">
                  <span>No.</span>
                </Box>
                <Box className="activity-title">
                  <span>{t("text.title")}</span>
                </Box>
                <Box className="date">
                  <span>{t("text.register_date")}</span>
                </Box>
              </ActivityHeaderListItem>
              {latestPosts && latestPosts.length > 0 ? (
                latestPosts?.slice(0, 3).map((item, index) => (
                  <ActivityRowListItem
                    className="list-item"
                    key={item.boardId}
                    onClick={() => onDetail(item.boardDivision, item.boardId)}
                  >
                    <Box className="activity-no">
                      <span>{index + 1}</span>
                    </Box>
                    <Box className="contents">
                      <Box className="comment-title">
                        <span>
                        {item.boardDivision === "NOTICE" ? (
                          t("menu.board.notice")
                        ) : item.boardDivision === "FAQ" ? (
                          t("menu.board.FAQ")
                        ) : item.boardDivision === "QNA" ? (
                          t("menu.board.QNA")
                        ) : (
                          <></>
                        )}
                        </span>
                      </Box>
                      <Box className="activity-comment">
                        <span>{item.title}</span>
                      </Box>
                    </Box>
                    <Box className="date">
                      <span>{dayjs(item.regDt).format("YYYY-MM-DD HH:mm")}</span>
                    </Box>
                  </ActivityRowListItem>
                ))
              ) : (
                <Typography>{t("sentence.no_data")}</Typography>
              )}
            </List>
            {latestPosts && latestPosts.length > 0 ? (
              <MoreVertIcon className="more-icon" />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="comment grid">
          <div className="title">
            <span>
              <SubdirectoryArrowRightIcon className="icon" />
              {t("mypage.myCommnet")}
            </span>
            <Button
              variant="text"
              color="primary"
              onClick={() => onMoreData("comment")}
            >
              + {t("text.more_view")}
            </Button>
          </div>
          <div className="content">
            <List>
              <ActivityHeaderListItem  className="list-item header">
                <Box className="activity-no">
                  <span>No.</span>
                </Box>
                <Box className="activity-title">
                  <span>{t("text.title")}</span>
                </Box>
                <Box className="date">
                  <span>{t("text.register_date")}</span>
                </Box>
              </ActivityHeaderListItem>
              {latestReplies && latestReplies.length > 0 ? (
                latestReplies?.slice(0, 3).map((item, index) => (
                  <ActivityRowListItem
                    className="list-item"
                    key={item.commentId}
                    onClick={() => onDetail("recipe", item.recipeId)}
                  >
                    <Box className="activity-no">
                      <span>{index + 1}</span>
                    </Box>
                    <Box className = "contents">
                      <Box className="comment-title">
                        <span>{item.title}</span>
                      </Box>
                      <Box className="activity-comment">
                        <span>{item.comment}</span>
                      </Box>
                    </Box>
                    <Box className="date">
                      <span>{dayjs(item.regDt).format("YYYY-MM-DD HH:mm")}</span>
                    </Box>
                  </ActivityRowListItem>
                ))
              ) : (
                <Typography>{t("sentence.no_data")}</Typography>
              )}
            </List>
            {latestReplies && latestReplies.length > 0 ? (
              <MoreVertIcon className="more-icon" />
            ) : (
              <></>
            )}
          </div>
        </div>
      </SummaryDataArea>
    </Wrapper>
  );
}

export default Activity;
