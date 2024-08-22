import { Box, Snackbar, Alert, AlertColor } from '@mui/material';

function SnackbarCustom({
  open,
  message,
  onClose,
  severity,
}: {
  open: boolean;
  message: string;
  onClose: () => void;
  severity: AlertColor;
}) {
  const vertical: 'top' | 'bottom' = 'top';
  const horizontal: 'left' | 'center' | 'right' = 'right';

  return (
    <Box sx={{ width: '100%' }}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={onClose}
        autoHideDuration={3000} // 3초 후 자동으로 닫힘
        onClick={onClose} // 클릭 시 닫히게 설정
      >
        <Alert
          onClose={onClose}
          severity={severity} // 'success' or 'error'
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SnackbarCustom;
