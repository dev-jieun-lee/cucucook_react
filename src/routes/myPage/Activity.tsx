import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import MypageSideMenu from '../../memu/sideMenu/MypageSideMenu'; // 사이드 메뉴 컴포넌트
import { sideMenuStyles } from './myPageStyles'; // 공통 사이드 메뉴 스타일

const Activity: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 2,
          boxSizing: 'border-box',
        }}
      >
        {/* 찜한 레시피 목록 */}
        <Box
          sx={{
            flex: 1,
            mb: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="subtitle1">레시피 찜목록</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Link to="/myPage/LikeLists" style={{ textDecoration: 'none' }}>
              <Button variant="text">+더보기</Button>
            </Link>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 2,
              overflowY: 'auto',
            }}
          >
            <Typography>1. 레시피 A</Typography>
            <Typography>2. 레시피 B</Typography>
            <Typography>3. 레시피 C</Typography>
            <Typography>4. 레시피 D</Typography>
            <Typography>5. 레시피 E</Typography>
          </Box>
        </Box>

        {/* 내가 쓴 게시글 목록 */}
        <Box
          sx={{
            flex: 1,
            mb: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="subtitle1">내가 쓴 게시글</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Link to="/myPage/MyRecipes" style={{ textDecoration: 'none' }}>
              <Button variant="text">+더보기</Button>
            </Link>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 2,
              overflowY: 'auto',
            }}
          >
            <Typography>1. 게시글 A</Typography>
            <Typography>2. 게시글 B</Typography>
            <Typography>3. 게시글 C</Typography>
            <Typography>4. 게시글 D</Typography>
            <Typography>5. 게시글 E</Typography>
          </Box>
        </Box>

        {/* 내가 쓴 댓글 목록 */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="subtitle1">내가 쓴 댓글</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Link to="/myPage/MyReplys" style={{ textDecoration: 'none' }}>
              <Button variant="text">+더보기</Button>
            </Link>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 2,
              overflowY: 'auto',
            }}
          >
            <Typography>1. 댓글 A</Typography>
            <Typography>2. 댓글 B</Typography>
            <Typography>3. 댓글 C</Typography>
            <Typography>4. 댓글 D</Typography>
            <Typography>5. 댓글 E</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Activity;
