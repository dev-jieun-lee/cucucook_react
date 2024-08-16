import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Avatar, List, ListItem, ListItemText, Fab } from '@mui/material';
import { Link } from 'react-router-dom';
import { KeyboardArrowUp } from '@mui/icons-material';
import { activityStyles, myPageGridStyles, scrollButtonStyles } from './myPageStyles';
import { Wrapper } from '../../styles/CommonStyles';

type SectionProps = {
  title: string;
  linkTo: string;
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, linkTo, children }) => {
  return (
    <Box sx={activityStyles.section}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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
  const [showScrollButton, setShowScrollButton] = useState(false);
  const username = "회원";
  const likeCount = 5;
  const writeCount = 10;
  const replyCount = 3;

  const likedRecipes = ["레시피 A", "레시피 B", "레시피 C", "레시피 D", "레시피 E"];
  const writtenPosts = ["게시글 A", "게시글 B", "게시글 C", "게시글 D", "게시글 E"];
  const writtenReplies = ["댓글 A", "댓글 B", "댓글 C", "댓글 D", "댓글 E"];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Wrapper>
      <Box
        sx={{
          ...activityStyles.content,
          minHeight: 'calc(100vh - 200px)',
        }}
      >
        <Box sx={activityStyles.welcomeBox}>
          <Typography variant="h5">{username}님 안녕하세요!</Typography>
        </Box>

        <Box sx={activityStyles.statsBox}>
          <Box sx={activityStyles.statItem}>
            <Avatar src="/public/image/cucucook_like.png" alt="찜 아이콘" sx={activityStyles.statIcon} />
            <Typography>{likeCount}개</Typography>
          </Box>
          <Box sx={activityStyles.statItem}>
            <Avatar src="/public/image/cucucook_write.png" alt="게시글 아이콘" sx={activityStyles.statIcon} />
            <Typography>{writeCount}개</Typography>
          </Box>
          <Box sx={activityStyles.statItem}>
            <Avatar src="/public/image/cucucook_reply.png" alt="댓글 아이콘" sx={activityStyles.statIcon} />
            <Typography>{replyCount}개</Typography>
          </Box>
        </Box>

        <Section title="레시피 찜목록" linkTo="/myPage/LikeLists">
          <Box sx={myPageGridStyles.gridContainer}>
            {likedRecipes.map((recipe, index) => (
              <Box key={index} sx={myPageGridStyles.itemBox}>
                <Typography>{recipe}</Typography>
              </Box>
            ))}
          </Box>
        </Section>

        <Section title="내가 쓴 게시글" linkTo="/myPage/MyWrites">
          <List>
            {writtenPosts.map((post, index) => (
              <ListItem key={index} sx={{ borderBottom: '1px solid #ddd' }}>
                <ListItemText primary={post} />
              </ListItem>
            ))}
          </List>
        </Section>

        <Section title="내가 쓴 댓글" linkTo="/myPage/MyReplys">
          <List>
            {writtenReplies.map((reply, index) => (
              <ListItem key={index} sx={{ borderBottom: '1px solid #ddd' }}>
                <ListItemText primary={reply} />
              </ListItem>
            ))}
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
