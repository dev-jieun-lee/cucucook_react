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
} from "./mypageApi";
import { activityStyles, scrollButtonStyles } from "./myPageStyles";

type StatButtonProps = {
  onClickPath: string;
  iconSrc: string;
  altText: string;
  count: number;
};

const StatButton: React.FC<StatButtonProps> = ({
  onClickPath,
  iconSrc,
  altText,
  count,
}) => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate(onClickPath)}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar src={iconSrc} alt={altText} sx={activityStyles.statIcon} />
      <Typography sx={{ color: "black" }}>{count}개</Typography>
    </Button>
  );
};

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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    setShowScrollButton(window.scrollY > 300);
  };

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
        fetchMemberBoardList(memberId, 5),
        fetchMyRecipeList(memberId, 5),
        fetchMyComments(memberId, 1, 5),
      ]);
      console.log("Liked Recipes:", likedRecipes); // 데이터 로그 출력
      console.log("Posts:", posts);
      console.log("Recipes:", recipes);
      console.log("Replies:", replies);
      setLikeCount(stats.likeCount);
      setWriteCount(stats.writeCount);
      setReplyCount(stats.replyCount);
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
          <StatButton
            onClickPath="/myPage/LikeLists"
            iconSrc="/public/image/cucucook_like.png"
            altText="찜 아이콘"
            count={likeCount}
          />
          <StatButton
            onClickPath="/myPage/MyWrites"
            iconSrc="/public/image/cucucook_write.png"
            altText="게시글 아이콘"
            count={writeCount}
          />
          <StatButton
            onClickPath="/myPage/MyReplys"
            iconSrc="/public/image/cucucook_reply.png"
            altText="댓글 아이콘"
            count={replyCount}
          />
        </Box>

        <Section title="레시피 찜목록" linkTo="/myPage/LikeLists">
          <List>
            {likedRecipes.map((recipe) => {
              console.log(
                `Rendering liked recipe with key: ${recipe.recipeId}`
              );
              return (
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
              );
            })}
          </List>
        </Section>

        <Section title="내가 쓴 게시글" linkTo="/myPage/MyWrites">
          <List>
            {latestPosts.map((post) => (
              <ListItem
                key={`post-${post.boardId}`} // 'post-' 접두어와 id 결합
                sx={{ borderBottom: "1px solid #ddd" }}
                button
                onClick={() => navigate(`/notice/${post.boardId}`)}
              >
                <ListItemText primary={post.title} />
              </ListItem>
            ))}
          </List>
        </Section>

        <Section title="나의 DIY 레시피" linkTo="/myPage/MyRecipes">
          <List>
            {latestRecipes.map((recipe) => (
              <ListItem
                key={`diy-recipe-${recipe.method}`} // 'diy-recipe-' 접두어와 id 결합
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

        <Section title="내가 쓴 댓글" linkTo="/myPage/MyReplys">
          <List>
            {latestReplies.map((reply) => (
              <ListItem
                key={`reply-${reply.commentId}`} // 'reply-' 접두어와 id 결합
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
