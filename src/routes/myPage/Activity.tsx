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
} from "@mui/material";
import { Link } from "react-router-dom";
import { KeyboardArrowUp } from "@mui/icons-material";
import {
  activityStyles,
  scrollButtonStyles,
} from "./myPageStyles";
import { Wrapper } from "../../styles/CommonStyles";
import { useAuth } from "../../auth/AuthContext";
import {
  fetchActivityStats,
  fetchMemberBoardList,
  fetchMyComments,
  fecthMyRecipeList,
  fetchLikedRecipes,
} from "./api"; // 활동 정보 API 함수 가져오기

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
      <Box>{children}</Box>
    </Box>
  );
};

interface ActivityProps {
  isDarkMode: boolean;
}

const Activity: React.FC<ActivityProps> = ({ isDarkMode }) => {
  const { user } = useAuth();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [likeCount, setLikeCount] = useState(0); // likeCount 상태
  const [writeCount, setWriteCount] = useState(0); // writeCount 상태
  const [replyCount, setReplyCount] = useState(0); // replyCount 상태
  const [likedRecipes, setLikedRecipes] = useState([]); //찜한레시피
  const [latestPosts, setLatestPosts] = useState([]); // 최신 게시글 상태
  const [latestReplies, setLatestReplies] = useState([]); // 최신 댓글 상태
  const [latestRecipes, setLatestRecipes] = useState([]); // 최신 레시피 상태

  const username = user?.name || "회원";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 활동 통계 정보 가져오는 함수
  const loadActivityStats = async () => {
    if (user?.memberId) {
      try {
        const stats = await fetchActivityStats(user.memberId);
        setLikeCount(stats.likeCount);
        setWriteCount(stats.writeCount);
        setReplyCount(stats.replyCount);
      } catch (error) {
        console.error("Error loading activity stats:", error);
      }
    }
  };

  // 찜한 레시피 정보 로드하는 함수
  const loadLikedRecipes = async () => {
    if (user?.memberId) {
      try {
        const likedrecipes = await fetchLikedRecipes(user.memberId);
        setLikedRecipes(likedrecipes);
        console.log("찜한 레시피 정보 ", likedrecipes);
      } catch (error) {
        console.error("찜한 레시피 로드 오류:", error);
      }
    }
  };

  // 최신 게시글 목록 불러오는 함수
  const loadLatestPosts = async () => {
    if (user?.memberId) {
      try {
        const posts = await fetchMemberBoardList(user.memberId, 5); // 최신 5개의 게시글
        setLatestPosts(posts);
      } catch (error) {
        console.error("Error loading latest posts:", error);
      }
    }
  };

  // 최신 DIY 레시피
  // 최신 DIY 레시피 가져오는 함수
  const loadLatestRecipes = async () => {
    if (user?.memberId) {
      try {
        const recipes = await fecthMyRecipeList(user.memberId, 5); // API 요청을 통해 최신 레시피 가져오가

        setLatestRecipes(recipes); // 최신 레시피 상태 업데이트
      } catch (error) {
        console.error("Error loading latest recipes:", error);
      }
    }
  };

  // 최신 댓글 5개
  const loadLatestReplies = async () => {
    if (user?.memberId) {
      try {
        const replies = await fetchMyComments(user.memberId, 1, 5); // 최신 5개의 댓글
        setLatestReplies(replies);
        console.log("최신 댓글", replies);
      } catch (error) {
        console.error("Error loading latest replies:", error);
      }
    }
  };

  // 컴포넌트가 마운트될 때 댓글 정보도 불러오기
  useEffect(() => {
    loadActivityStats();
    loadLikedRecipes();
    loadLatestPosts(); // 최신 게시글 정보 로드
    loadLatestRecipes(); // 최신 레시피 정보 로드
    loadLatestReplies(); // 최신 댓글 정보 로드
  }, [user]);

  return (
    <Wrapper>
      <Box
        sx={{
          ...activityStyles.content,
          minHeight: "calc(100vh - 200px)",
        }}
      >
        <Box sx={activityStyles.welcomeBox}>
          <Typography variant="h5">{username}님 안녕하세요!</Typography>
        </Box>

        <Box sx={activityStyles.statsBox}>
          <Box sx={activityStyles.statItem}>
            <Avatar
              src="/public/image/cucucook_like.png"
              alt="찜 아이콘"
              sx={activityStyles.statIcon}
            />
            <Typography>{likeCount}개</Typography>
          </Box>
          <Box sx={activityStyles.statItem}>
            <Avatar
              src="/public/image/cucucook_write.png"
              alt="게시글 아이콘"
              sx={activityStyles.statIcon}
            />
            <Typography>{writeCount}개</Typography>
          </Box>
          <Box sx={activityStyles.statItem}>
            <Avatar
              src="/public/image/cucucook_reply.png"
              alt="댓글 아이콘"
              sx={activityStyles.statIcon}
            />
            <Typography>{replyCount}개</Typography>
          </Box>
        </Box>

        <Section title="레시피 찜목록" linkTo="/myPage/LikeLists">
          <List>
            {likedRecipes?.length > 0 ? (
              likedRecipes.map((likedrecipes: any, index: number) => (
                <ListItem
                  key={likedrecipes.id}
                  sx={{ borderBottom: "1px solid #ddd" }}
                >
                  <ListItemText primary={likedrecipes.title} />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" sx={{ padding: 2 }}>
                찜한 레시피가 없습니다.
              </Typography>
            )}
          </List>
        </Section>

        <Section title="내가 쓴 게시글" linkTo="/myPage/MyWrites">
          <List>
            {latestPosts?.length > 0 ? (
              latestPosts.map((post: any, index: number) => (
                <ListItem key={post.id} sx={{ borderBottom: "1px solid #ddd" }}>
                  <ListItemText primary={post.title} />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" sx={{ padding: 2 }}>
                게시물이 없습니다.
              </Typography>
            )}
          </List>
        </Section>

        <Section title="나의 DIY 레시피" linkTo="/myPage/MyRecipes">
          <List>
            {latestRecipes?.length > 0 ? (
              latestRecipes.map((recipe: any, index: number) => (
                <ListItem
                  key={recipe.recipeId}
                  sx={{ borderBottom: "1px solid #ddd" }}
                >
                  <ListItemText primary={recipe.title} />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" sx={{ padding: 2 }}>
                레시피가 없습니다.
              </Typography>
            )}
          </List>
        </Section>

        <Section title="내가 쓴 댓글" linkTo="/myPage/MyReplys">
          <List>
            {latestReplies?.length > 0 ? (
              latestReplies.map((reply: any, index: number) => (
                <ListItem
                  key={reply.commentId}
                  sx={{ borderBottom: "1px solid #ddd" }}
                >
                  <ListItemText primary={reply.comment} />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" sx={{ padding: 2 }}>
                댓글이 없습니다.
              </Typography>
            )}
          </List>
        </Section>
      </Box>

      {showScrollButton && (
        <Fab
          color="primary"
          size="small"
          sx={scrollButtonStyles}
          onClick={scrollToTop}
        >
          <KeyboardArrowUp />
        </Fab>
      )}
    </Wrapper>
  );
};

export default Activity;
