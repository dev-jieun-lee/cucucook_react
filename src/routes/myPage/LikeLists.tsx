import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Avatar, Fab } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 추가
import { activityStyles, myPageGridStyles, scrollButtonStyles } from './myPageStyles';

// 더미 데이터 생성 함수
const fetchLikeLists = async (page: number, pageSize: number) => {
  return Array.from({ length: pageSize }, (_, index) => ({
    id: page * pageSize + index + 1, // 1부터 시작하는 고유 ID
    name: `찜한 레시피 ${page * pageSize + index + 1}`,
  }));
};

const LikeLists: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [likeLists, setLikeLists] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20); // 한 페이지에 표시할 항목 수
  const [showScrollButton, setShowScrollButton] = useState(false); // 스크롤 버튼 표시 여부
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const loadLikes = async () => {
      const newLikes = await fetchLikeLists(page, pageSize);
      setLikeLists(newLikes);
    };

    loadLikes();
  }, [page, pageSize]);

  // 스크롤 이벤트 리스너
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

  // 페이지 맨 위로 이동하는 함수
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = async () => {
    const newPage = page + 1;
    const newLikes = await fetchLikeLists(newPage, pageSize);
    setLikeLists((prev) => [...prev, ...newLikes]);
    setPage(newPage);
  };

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <Box sx={activityStyles.container}>
      <Box sx={activityStyles.content}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">찜한 레시피 목록</Typography>
          <Button variant="outlined" onClick={handleGoBack}>
            뒤로 가기
          </Button>
        </Box>
        <Box sx={myPageGridStyles.gridContainer}>
          {likeLists.map((like) => (
            <Box key={like.id} sx={myPageGridStyles.itemBox}>
              <Avatar sx={{ width: '100%', height: '100%', backgroundColor: '#ccc' }}>
                {like.name.charAt(0)}
              </Avatar>
            </Box>
          ))}
        </Box>
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

export default LikeLists;
