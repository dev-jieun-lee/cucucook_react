import React from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { activityStyles, myPageGridStyles } from './myPageStyles';
import { Wrapper } from '../../styles/CommonStyles';

type SectionProps = {
  title: string;
  linkTo: string;
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, linkTo, children }) => {
  return (
    <Box sx={activityStyles.section}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
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
  const username = "회원"; // 실제 사용자 이름을 받아오는 로직으로 대체
  const likeCount = 5; // 실제 찜한 갯수를 받아오는 로직으로 대체
  const writeCount = 10; // 실제 게시글 갯수를 받아오는 로직으로 대체
  const replyCount = 3; // 실제 댓글 갯수를 받아오는 로직으로 대체

  return (
<Wrapper>
      <Box sx={activityStyles.content}>
        {/* 회원 인사 박스 */}
        <Box sx={activityStyles.welcomeBox}>
          <Typography variant="h5">{username}님 안녕하세요!</Typography>
        </Box>

        {/* 아이콘과 갯수 표시 박스 */}
        <Box sx={activityStyles.statsBox}>
          <Box sx={activityStyles.statItem}>
            <Avatar src="/public/images/cucucook_like.png" alt="찜 아이콘" sx={activityStyles.statIcon} />
            <Typography>{likeCount}개</Typography>
          </Box>
          <Box sx={activityStyles.statItem}>
            <Avatar src="/public/images/cucucook_write.png" alt="게시글 아이콘" sx={activityStyles.statIcon} />
            <Typography>{writeCount}개</Typography>
          </Box>
          <Box sx={activityStyles.statItem}>
            <Avatar src="/public/images/cucucook_reply.png" alt="댓글 아이콘" sx={activityStyles.statIcon} />
            <Typography>{replyCount}개</Typography>
          </Box>
        </Box>

        {/* 찜한 레시피 목록 */}
        <Section title="레시피 찜목록" linkTo="/myPage/LikeLists">
          <Box sx={myPageGridStyles?.gridContainer ?? {}}>
            <Box sx={myPageGridStyles?.itemBox ?? {}}>
              <Typography>레시피 A</Typography>
            </Box>
            <Box sx={myPageGridStyles?.itemBox ?? {}}>
              <Typography>레시피 B</Typography>
            </Box>
          </Box>
        </Section>

        {/* 내가 쓴 게시글 목록 */}
        <Section title="내가 쓴 게시글" linkTo="/myPage/MyRecipes">
          <Box sx={myPageGridStyles?.gridContainer ?? {}}>
            <Box sx={myPageGridStyles?.itemBox ?? {}}>
              <Typography>게시글 A</Typography>
            </Box>
            <Box sx={myPageGridStyles?.itemBox ?? {}}>
              <Typography>게시글 B</Typography>
            </Box>
          </Box>
        </Section>

        {/* 내가 쓴 댓글 목록 */}
        <Section title="내가 쓴 댓글" linkTo="/myPage/MyReplys">
          <Box sx={myPageGridStyles?.gridContainer ?? {}}>
            <Box sx={myPageGridStyles?.itemBox ?? {}}>
              <Typography>댓글 A</Typography>
            </Box>
            <Box sx={myPageGridStyles?.itemBox ?? {}}>
              <Typography>댓글 B</Typography>
            </Box>
          </Box>
        </Section>
      </Box>
      </Wrapper>
  );
};

export default Activity;
