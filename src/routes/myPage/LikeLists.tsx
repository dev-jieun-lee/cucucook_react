import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import MypageSideMenu from '../../memu/sideMenu/MypageSideMenu'; // 사이드 메뉴 컴포넌트
import { sideMenuStyles } from './myPageStyles'; // 공통 사이드 메뉴 스타일

// 더미 데이터 생성 함수
const fetchLikeLists = async (page: number, pageSize: number) => {
  // 실제 데이터 fetching 로직을 여기에 추가합니다.
  return Array.from({ length: pageSize }, (_, index) => ({
    id: page * pageSize + index + 1, // 1부터 시작하는 고유 ID
    name: `찜한 레시피 ${page * pageSize + index + 1}`
  }));
};

const LikeLists: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [likeLists, setLikeLists] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(4); // 한 페이지에 표시할 항목 수

  useEffect(() => {
    const loadLikes = async () => {
      const newLikes = await fetchLikeLists(page, pageSize);
      setLikeLists(newLikes);
    };

    loadLikes();
  }, [page, pageSize]);

  const handleNextPage = async () => {
    const newPage = page + 1;
    const newLikes = await fetchLikeLists(newPage, pageSize);
    setLikeLists(prev => [...prev, ...newLikes]);
    setPage(newPage);
  };

  return (
    <Box sx={{ display: 'flex', width: '92%', margin: '140px auto' }}>
      <Box sx={sideMenuStyles}>
        <MypageSideMenu isDarkMode={isDarkMode} />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 2,
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
          }}
        >
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <Typography variant="subtitle1">찜한 레시피 목록</Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)', // 한 줄에 4개
                gap: 2,
                overflowY: 'auto',
                height: 'calc(100% - 48px)', // +더보기 버튼 공간을 제외한 높이
              }}
            >
              {likeLists.map(like => (
                <Box
                  key={like.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '8px',
                    padding: '8px',
                    height: '150px',
                    overflow: 'hidden',
                  }}
                >
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
        </Box>
      </Box>
    </Box>
  );
};

export default LikeLists;
