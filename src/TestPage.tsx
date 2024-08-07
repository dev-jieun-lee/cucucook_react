import { Typography } from '@mui/material';
import axios from 'axios';
import { error } from 'console';
import React, { useEffect, useState } from 'react';

const TestPage = () => {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/hello') // Spring Boot API URL
      .then(response => {
        setMessage(response.data); // API 응답 데이터 설정
        setError(null); // 성공 시 에러를 null로 설정
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
        setError('There was an error fetching the data.'); // 에러 메시지 설정
      });
  }, []);
  return (
    <div>
      <Typography variant="h5">
        API 호출 결과: {message}
      </Typography>
      {error && <Typography variant="h6" color="error">{error}</Typography>}
    </div>
  );
};

export default TestPage;