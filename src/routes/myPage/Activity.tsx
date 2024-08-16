import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import MypageSideMenu from '../../memu/sideMenu/MypageSideMenu'; // 사이드 메뉴 컴포넌트
import { sideMenuStyles } from './myPageStyles'; // 공통 사이드 메뉴 스타일

type SectionProps = {
  title: string;
  linkTo: string;
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, linkTo, children }) => {
  return (
    <Box sx={{ flex: 1, padding: '16px', border: '1px solid', borderColor: 'divider', borderRadius: '8px', margin: '8px' }}>
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
  return (
    <Box sx={{ display: 'flex', width: '100%' }}>

      <Box sx={{ flexGrow: 1, padding: '20px' }}>
        {/* 찜한 레시피 목록 */}
        <Section title="레시피 찜목록" linkTo="/myPage/LikeLists">
          <Typography>1. 레시피 A</Typography>
          <Typography>2. 레시피 B</Typography>
          <Typography>3. 레시피 C</Typography>
          <Typography>4. 레시피 D</Typography>
          <Typography>5. 레시피 E</Typography>
        </Section>

        {/* 내가 쓴 게시글 목록 */}
        <Section title="내가 쓴 게시글" linkTo="/myPage/MyRecipes">
          <Typography>1. 게시글 A</Typography>
          <Typography>2. 게시글 B</Typography>
          <Typography>3. 게시글 C</Typography>
          <Typography>4. 게시글 D</Typography>
          <Typography>5. 게시글 E</Typography>
        </Section>

        {/* 내가 쓴 댓글 목록 */}
        <Section title="내가 쓴 댓글" linkTo="/myPage/MyReplys">
          <Typography>1. 댓글 A</Typography>
          <Typography>2. 댓글 B</Typography>
          <Typography>3. 댓글 C</Typography>
          <Typography>4. 댓글 D</Typography>
          <Typography>5. 댓글 E</Typography>
        </Section>
      </Box>
    </Box>
  );
};

export default Activity;
