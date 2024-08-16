import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

// 더미 데이터 생성 함수
const fetchMyReplies = async (page: number, pageSize: number) => {
  // 실제 데이터 fetching 로직을 여기에 추가합니다.
  return Array.from({ length: pageSize }, (_, index) => ({
    id: page * pageSize + index + 1, // 1부터 시작하는 고유 ID
    content: `댓글 ${page * pageSize + index + 1}`
  }));
};

const MyReplys: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [myReplies, setMyReplies] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(4); // 한 페이지에 표시할 항목 수

  useEffect(() => {
    const loadReplies = async () => {
      const newReplies = await fetchMyReplies(page, pageSize);
      setMyReplies(newReplies);
    };

    loadReplies();
  }, [page, pageSize]);

  const handleNextPage = async () => {
    const newPage = page + 1;
    const newReplies = await fetchMyReplies(newPage, pageSize);
    setMyReplies(prev => [...prev, ...newReplies]);
    setPage(newPage);
  };

  return (
    <Box sx={{ display: 'flex', width: '92%'}}>
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
            <Typography variant="subtitle1">내가 쓴 댓글</Typography>
            <List
              sx={{
                width: '100%',
                overflowY: 'auto',
                maxHeight: 'calc(100% - 48px)', // +더보기 버튼 공간을 제외한 높이
              }}
            >
              {myReplies.map(reply => (
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
        </Box>
      </Box>
    </Box>
  );
};

export default MyReplys;
