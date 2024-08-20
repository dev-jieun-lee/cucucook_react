import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, List, ListItem, ListItemText, Fab } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { activityStyles, scrollButtonStyles } from './myPageStyles';

// 더미 데이터 생성 함수
const fetchMyWrites = async (page: number, pageSize: number) => {
  return Array.from({ length: pageSize }, (_, index) => ({
    id: page * pageSize + index + 1, // 1부터 시작하는 고유 ID
    title: `게시글 ${page * pageSize + index + 1}`,
  }));
};

const MyWrites: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [myWrites, setMyWrites] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20); // 한 페이지에 표시할 항목 수
  const [showScrollButton, setShowScrollButton] = useState(false); // 스크롤 버튼 표시 여부
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecipes = async () => {
      const newRecipes = await fetchMyWrites(page, pageSize);
      setMyWrites(newRecipes);
    };

    loadRecipes();
  }, [page, pageSize]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = async () => {
    const newPage = page + 1;
    const newRecipes = await fetchMyWrites(newPage, pageSize);
    setMyWrites((prev) => [...prev, ...newRecipes]);
    setPage(newPage);
  };

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <Box sx={activityStyles.container}>
      <Box sx={activityStyles.content}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">내가 쓴 게시글</Typography>
          <Button variant="outlined" onClick={handleGoBack}>
            뒤로 가기
          </Button>
        </Box>
        <List
          sx={{
            width: '100%',
            overflowY: 'auto',
            maxHeight: 'calc(100% - 48px)',
          }}
        >
          {myWrites.map((write) => (
            <ListItem key={write.id} sx={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
              <ListItemText primary={write.title} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" onClick={handleNextPage}>
            다음 페이지
          </Button>
        </Box>
      </Box>

      {/* 맨 위로 가기 버튼 */}
      {showScrollButton && (
        <Fab
          color="primary"
          size="small"
          sx={scrollButtonStyles} // 스타일을 적용
          onClick={scrollToTop}
        >
          <KeyboardArrowUp />
        </Fab>
      )}
    </Box>
  );
};

export default MyWrites;
