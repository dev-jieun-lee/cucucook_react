import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";
import { Wrapper } from "../../styles/CommonStyles";
import {
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
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
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
    } else if (kind === "writing") {
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
            <TableContainer className="table-container" component={Paper}>
              <Table className="table">
                <TableHead className="head">
                  <TableRow>
                    <TableCell className="no-cell">No.</TableCell>
                    <TableCell className="title-cell">
                      {t("text.title")}
                    </TableCell>
                    <TableCell>{t("text.register_date")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {likedRecipes && likedRecipes.length > 0 ? (
                    likedRecipes
                      ?.slice(0, 3)
                      .map((item: any, index: number) => (
                        <TableRow
                          className="row"
                          key={index}
                          onClick={() => onDetail("like", item.recipeId)}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            className="cell"
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell className="cell">{item.title}</TableCell>
                          <TableCell className="cell">
                            {dayjs(item.regDt).format("YYYY-MM-DD HH:mm")}
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        {t("sentence.no_data")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {likedRecipes && likedRecipes.length > 0 ? (
                <MoreVertIcon className="more-icon" />
              ) : (
                <></>
              )}
            </TableContainer>
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
            <TableContainer className="table-container" component={Paper}>
              <Table className="table">
                <TableHead className="head">
                  <TableRow>
                    <TableCell className="no-cell">No.</TableCell>
                    <TableCell className="title-cell">
                      {t("text.title")}
                    </TableCell>
                    <TableCell>{t("text.register_date")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {latestRecipes && latestRecipes.length > 0 ? (
                    latestRecipes.map((item: any, index: number) => (
                      <TableRow
                        className="row"
                        key={index}
                        onClick={() => onDetail("recipe", item.recipeId)}
                      >
                        <TableCell component="th" scope="row" className="cell">
                          {index + 1}
                        </TableCell>
                        <TableCell className="cell">{item.title}</TableCell>
                        <TableCell className="cell">
                          {dayjs(item.regDt).format("YYYY-MM-DD HH:mm")}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        {t("sentence.no_data")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {latestRecipes && latestRecipes.length > 0 ? (
                <MoreVertIcon className="more-icon" />
              ) : (
                <></>
              )}
            </TableContainer>
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
            <TableContainer className="table-container" component={Paper}>
              <Table className="table">
                <TableHead className="head">
                  <TableRow>
                    <TableCell className="no-cell">No.</TableCell>
                    <TableCell className="title-cell">
                      {t("text.title")}
                    </TableCell>
                    <TableCell>{t("text.register_date")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {latestPosts && latestPosts.length > 0 ? (
                    latestPosts.map((item: any, index: number) => (
                      <TableRow
                        className="row"
                        key={index}
                        onClick={() => onDetail("writing", item.boardId)}
                      >
                        <TableCell component="th" scope="row" className="cell">
                          {index + 1}
                        </TableCell>
                        <TableCell className="cell">{item.title}</TableCell>
                        <TableCell className="cell">
                          {dayjs(item.regDt).format("YYYY-MM-DD HH:mm")}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        {t("sentence.no_data")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {latestPosts && latestPosts.length > 0 ? (
                <MoreVertIcon className="more-icon" />
              ) : (
                <></>
              )}
            </TableContainer>
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
            <TableContainer className="table-container" component={Paper}>
              <Table className="table">
                <TableHead className="head">
                  <TableRow>
                    <TableCell className="no-cell">No.</TableCell>
                    <TableCell className="title-cell">
                      {t("text.title")}
                    </TableCell>
                    <TableCell className="title-cell">
                      {t("text.comment")}
                    </TableCell>
                    <TableCell>{t("text.register_date")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {latestReplies && latestReplies.length > 0 ? (
                    latestReplies
                      .slice(0, 3)
                      .map((item: any, index: number) => (
                        <TableRow
                          className="row"
                          key={index}
                          onClick={() => onDetail("comment", item.recipeId)}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            className="cell"
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell className="cell">{item.title}</TableCell>
                          <TableCell className="cell">{item.comment}</TableCell>
                          <TableCell className="cell">
                            {dayjs(item.regDt).format("YYYY-MM-DD HH:mm")}
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        {t("sentence.no_data")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {latestReplies && latestReplies.length > 0 ? (
                <MoreVertIcon className="more-icon" />
              ) : (
                <></>
              )}
            </TableContainer>
          </div>
        </div>
      </SummaryDataArea>
    </Wrapper>
  );
}

export default Activity;
