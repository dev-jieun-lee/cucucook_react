import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, List, ListItem, ListItemText, Fab } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { activityStyles, scrollButtonStyles } from './myPageStyles';

// 더미 데이터 생성 함수
const fetchMyReplies = async (page: number, pageSize: number) => {
  return Array.from({ length: pageSize }, (_, index) => ({
    id: page * pageSize + index + 1, // 1부터 시작하는 고유 ID
    content: `댓글 ${page * pageSize + index + 1}`,
  }));
};

const MyReplys: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [myReplies, setMyReplies] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20); // 한 페이지에 표시할 항목 수
  const [showScrollButton, setShowScrollButton] = useState(false); // 스크롤 버튼 표시 여부
  const navigate = useNavigate();

  useEffect(() => {
    const loadReplies = async () => {
      const newReplies = await fetchMyReplies(page, pageSize);
      setMyReplies(newReplies);
    };

    loadReplies();
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
    const newReplies = await fetchMyReplies(newPage, pageSize);
    setMyReplies((prev) => [...prev, ...newReplies]);
    setPage(newPage);
  };

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <Box sx={activityStyles.container}>
      <Box sx={activityStyles.content}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">내가 쓴 댓글</Typography>
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
          {myReplies.map((reply) => (
            <ListItem key={reply.id} sx={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
              <ListItemText primary={reply.content} />
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
          sx={scrollButtonStyles}
          onClick={scrollToTop}
        >
          <KeyboardArrowUp />
        </Fab>
      )}
    </Box>
  );
};

export default MyReplys;
