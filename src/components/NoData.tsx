import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

function NoData() {
  const { t } = useTranslation();
  return (
    <Box sx={{ width: '100%', margin : '30px auto' , textAlign : "center"}}>
      <span>{t("sentence.no_data")}</span>
    </Box>
  );
}

export default NoData;