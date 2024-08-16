import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Avatar } from '@mui/material';
import { activityStyles, myPageGridStyles } from './myPageStyles';

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
    setLikeLists((prev) => [...prev, ...newLikes]);
    setPage(newPage);
  };

  return (
    <Box sx={activityStyles.container}>
      <Box sx={activityStyles.content}>
        <Box>
          <Typography variant="subtitle1">찜한 레시피 목록</Typography>
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
      </Box>
    </Box>
  );
};

export default LikeLists;
