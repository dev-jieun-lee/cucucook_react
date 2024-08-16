import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Avatar } from '@mui/material';
import { myPageGridStyles, activityStyles} from './myPageStyles';

// 더미 데이터 생성 함수
const fetchMyRecipes = async (page: number, pageSize: number) => {
  return Array.from({ length: pageSize }, (_, index) => ({
    id: page * pageSize + index + 1, // 1부터 시작하는 고유 ID
    title: `게시글 ${page * pageSize + index + 1}`,
  }));
};

const MyRecipes: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [myRecipes, setMyRecipes] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(4); // 한 페이지에 표시할 항목 수

  useEffect(() => {
    const loadRecipes = async () => {
      const newRecipes = await fetchMyRecipes(page, pageSize);
      setMyRecipes(newRecipes);
    };

    loadRecipes();
  }, [page, pageSize]);

  const handleNextPage = async () => {
    const newPage = page + 1;
    const newRecipes = await fetchMyRecipes(newPage, pageSize);
    setMyRecipes((prev) => [...prev, ...newRecipes]);
    setPage(newPage);
  };

  return (
    <Box sx={activityStyles.container}>
      <Box sx={activityStyles.content}>
        <Box>
          <Typography variant="subtitle1">내가 쓴 게시글</Typography>
          <Box sx={myPageGridStyles.gridContainer}>
            {myRecipes.map((recipe) => (
              <Box key={recipe.id} sx={myPageGridStyles.itemBox}>
                <Avatar sx={{ width: '100%', height: '100%', backgroundColor: '#ccc' }}>
                  {recipe.title.charAt(0)}
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

export default MyRecipes;
