import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Fab,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { KeyboardArrowUp } from "@mui/icons-material";
import { Wrapper } from "../../styles/CommonStyles";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  fetchActivityStats,
  fetchMemberBoardList,
  fetchMyComments,
  fetchMyRecipeList,
  fetchLikedRecipes,
} from "./api";
import { activityStyles, scrollButtonStyles } from "./myPageStyles";

// Section 컴포넌트 정의 추가
type SectionProps = {
  title: string;
  linkTo: string;
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, linkTo, children }) => {
  return (
    <Box sx={activityStyles.section}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <Button component={Link} to={linkTo} variant="contained">
          더보기
        </Button>
      </Box>
      {children}
    </Box>
  );
};

const Activity: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [writeCount, setWriteCount] = useState(0);
  const [replyCount, setReplyCount] = useState(0);
  const [likedRecipes, setLikedRecipes] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [latestReplies, setLatestReplies] = useState<any[]>([]);
  const [latestRecipes, setLatestRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchAllData = async () => {
    if (isFetching) return;
    setIsFetching(true);

    const memberId = user?.memberId;
    if (!memberId) {
      console.error("memberId is undefined");
      setIsFetching(false);
      return;
    }

    try {
      setIsLoading(true);
      const stats = await fetchActivityStats(memberId);
      setLikeCount(stats.likeCount);
      setWriteCount(stats.writeCount);
      setReplyCount(stats.replyCount);

      const likedrecipes = await fetchLikedRecipes(memberId);
      setLikedRecipes(likedrecipes);

      const posts = await fetchMemberBoardList(memberId, 5);
      setLatestPosts(posts);

      const recipes = await fetchMyRecipeList(memberId, 5);
      setLatestRecipes(recipes);

      const replies = await fetchMyComments(memberId, 1, 5);
      setLatestReplies(replies);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user]);

  if (isLoading) {
    return (
      <Wrapper>
        <CircularProgress />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Box sx={{ ...activityStyles.content, minHeight: "calc(100vh - 200px)" }}>
        <Box sx={activityStyles.welcomeBox}>
          <Typography variant="h5">
            {user?.name || "회원"}님 안녕하세요!
          </Typography>
        </Box>

        <Box sx={activityStyles.statsBox}>
          <Box sx={activityStyles.statItem}>
            <Button
              onClick={() => navigate("/myPage/LikeLists")}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                src="/public/image/cucucook_like.png"
                alt="찜 아이콘"
                sx={activityStyles.statIcon}
              />
              <Typography sx={{ color: "black" }}>{likeCount}개</Typography>
            </Button>
          </Box>

          <Box sx={activityStyles.statItem}>
            <Button
              onClick={() => navigate("/myPage/MyWrites")}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                src="/public/image/cucucook_write.png"
                alt="게시글 아이콘"
                sx={activityStyles.statIcon}
              />
              <Typography sx={{ color: "black" }}>{writeCount}개</Typography>
            </Button>
          </Box>

          <Box sx={activityStyles.statItem}>
            <Button
              onClick={() => navigate("/myPage/MyReplys")}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                src="/public/image/cucucook_reply.png"
                alt="댓글 아이콘"
                sx={activityStyles.statIcon}
              />
              <Typography sx={{ color: "black" }}>{replyCount}개</Typography>
            </Button>
          </Box>
        </Box>

        {/* 레시피 찜목록 섹션 */}
        <Section title="레시피 찜목록" linkTo="/myPage/LikeLists">
          <List>
            {likedRecipes.map((likedRecipe) => (
              <ListItem
                key={likedRecipe.recipeId} // 고유한 key prop 추가
                sx={{ borderBottom: "1px solid #ddd" }}
                button
                onClick={() =>
                  navigate(`/recipe/member_recipe/${likedRecipe.recipeId}`)
                }
              >
                <ListItemText primary={likedRecipe.title} />
              </ListItem>
            ))}
          </List>
        </Section>

        {/* 내가 쓴 게시글 섹션 */}
        <Section title="내가 쓴 게시글" linkTo="/myPage/MyWrites">
          <List>
            {latestPosts.map((post) => (
              <ListItem
                key={post.id}
                sx={{ borderBottom: "1px solid #ddd" }}
                button
                onClick={() => navigate(`/notice/${post.boardId}`)}
              >
                <ListItemText primary={post.title} />
              </ListItem>
            ))}
          </List>
        </Section>

        {/* 나의 DIY 레시피 섹션 */}
        <Section title="나의 DIY 레시피" linkTo="/myPage/MyRecipes">
          <List>
            {latestRecipes.map((recipe) => (
              <ListItem
                key={recipe.recipeId}
                sx={{ borderBottom: "1px solid #ddd" }}
                button
                onClick={() =>
                  navigate(`/recipe/member_recipe/${recipe.recipeId}`)
                }
              >
                <ListItemText primary={recipe.title} />
              </ListItem>
            ))}
          </List>
        </Section>

        {/* 내가 쓴 댓글 섹션 */}
        <Section title="내가 쓴 댓글" linkTo="/myPage/MyReplys">
          <List>
            {latestReplies.map((reply) => (
              <ListItem
                key={reply.commentId}
                sx={{ borderBottom: "1px solid #ddd" }}
                button
                onClick={() =>
                  navigate(`/recipe/member_recipe/${reply.recipeId}`)
                }
              >
                <ListItemText primary={reply.comment} />
              </ListItem>
            ))}
          </List>
        </Section>

        {showScrollButton && (
          <Fab
            color="primary"
            size="small"
            sx={scrollButtonStyles}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <KeyboardArrowUp />
          </Fab>
        )}
      </Box>
    </Wrapper>
  );
};

export default Activity;
