import { useEffect, useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import Loading from "../../../components/Loading";
import {
  CustomPagination,
  SearchArea,
  TitleCenter,
  Wrapper,
} from "../../../styles/CommonStyles";
import {
  Box,
  IconButton,
  InputAdornment,
  List,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ContentsArea } from "../../../styles/BoardStyle";
import { getMemberList } from "../../../apis/memberApi";
import { AdminHeaderListItem, AdminRowListItem } from "../../../styles/AdminStyle";
import dayjs from "dayjs";

function MembersManage() {
  const { user } = useAuth(); //로그인 상태관리
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(""); //검색어
  const [searchType, setSearchType] = useState("all"); // 검색 유형
  const [triggerSearch, setTriggerSearch] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalCount, setTotalCount] = useState(0); // 총 게시물 수
  const { t } = useTranslation();
  const navigate = useNavigate();

  const display = 10; // 한 페이지에 표시할 게시물 수

  // 검색 파라미터 URL 업데이트
  useEffect(() => {
    setSearchParams({
      search: search,
      searchType: searchType,
      currentPage: currentPage.toString(),
    });
  }, [search, searchType, currentPage, setSearchParams]);

  // 데이터를 불러오는 API 호출 함수
  const getMemberListApi = async () => {
    const params = {
      search: search,
      searchType: searchType,
      currentPage: currentPage, // 페이지 번호
      display: display, //페이지당 표시할 갯수
    };
    const response = await getMemberList(params);
    setTotalCount(response.data.length);
    return response;
  };

  // 데이터 가져오기 시 로딩 상태 추가
  const getMemberListWithDelay = async () => {
    setLoading(true); // 로딩 상태 시작

    // 인위적인 지연 시간 추가
    await new Promise((resolve) => setTimeout(resolve, 50));

    const memberList = await getMemberListApi(); // 데이터 불러오기
    setLoading(false);
    return memberList.data;
  };

  const {
    data: memberList,
    isLoading: memberListLoading,
    refetch,
  } = useQuery("memberList", getMemberListWithDelay, {
    enabled: triggerSearch, // 검색 트리거 활성화 시 쿼리 실행
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  // 트리거 변경 시 데이터 초기화 및 로딩 처리
  useEffect(() => {
    if (triggerSearch) {
      refetch(); // 데이터 가져오기
      setTriggerSearch(false); // 트리거를 false로 초기화
    }
  }, [triggerSearch, refetch]);

  // 검색 버튼 클릭 핸들러
  const handleSearchClick = () => {
    setCurrentPage(1);
    setTriggerSearch(true); // 검색 트리거를 true로 설정하여 검색 실행
    refetch(); // refetch를 호출해 쿼리를 수동으로 실행
  };

  // 엔터 키로 검색 실행 핸들러
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  // 검색 유형 select 변경 이벤트
  const handleSearchTypeChange = (e: any) => {
    setSearchType(e.target.value);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (event: any, page: any) => {

    setCurrentPage(page);
    setTriggerSearch(true); // 페이지 변경 시 검색 트리거 활성화
    refetch();
  };

  //상세 페이지로 이동
  const onClickDetail = (memberId: string) => {
    navigate(`/admin/members/${memberId}`);
  };

  //로딩
  if (loading || memberListLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <TitleCenter>{t("menu.admin.members")}</TitleCenter>
      <SearchArea>
        <Select
          className="select-category"
          variant="standard"
          labelId="select-category"
          value={searchType}
          onChange={handleSearchTypeChange}
        >
          <MenuItem value="all">{t("text.all")}</MenuItem>
          <MenuItem value="name">{t("text.name")}</MenuItem>
          <MenuItem value="userId">{t("text.user_id")}</MenuItem>
        </Select>
        <TextField
          className="search-input"
          variant="standard"
          placeholder={t("sentence.searching")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown} // 엔터 키로 검색
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  // color="primary"
                  aria-label="toggle password visibility"
                  onClick={handleSearchClick}
                  edge="end"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </SearchArea>
      <ContentsArea>
        <List>
          <AdminHeaderListItem className="list-item header">
            <Box className="no">
              <span>No.</span>
            </Box>
            <Box className = "name-area">
              <Box className="user-id">
                <span>{t("text.user_id")}</span>
              </Box>
              <Box className="user-name">
                <span>{t("text.name")}</span>
              </Box>
            </Box>
            <Box className="date">
              <span>{t("text.subscription_data")}</span>
            </Box>
            <Box className="role">
              <span>{t("text.role")}</span>
            </Box>
          </AdminHeaderListItem>
          {memberList && memberList.length > 0 ? (
            memberList
            ?.slice(10 * (currentPage - 1), 10 * (currentPage - 1) + 10)
            .map((item : any, index : any) => (
              <AdminRowListItem
                className="list-item"
                key={item.memberId}
                onClick={() => onClickDetail(item.memberId)}
              >
                <Box className="no">
                  {(currentPage - 1) * display + index + 1}
                </Box>
                <Box className="name-area">
                  <Box className="user-id">
                    <span>{item.userId}</span>
                  </Box>
                  <Box className="user-name">
                    <span>{item.name}</span>
                  </Box>
                </Box>
                <Box className="date">
                  <span>{dayjs(item.regDt).format("YYYY-MM-DD HH:mm")}</span>
                </Box>
                <Box className="role">
                  <span>
                    {item.role === "0" ? (
                      t("text.admin")
                    ) : item.role === "1" ? (
                      t("text.member")
                    ) : item.role === "2" ? (
                      t("text.super_admin")
                    ) : (
                      <></>
                    )}
                  </span>
                </Box>
              </AdminRowListItem>
            ))
          ) : (
            <Typography>{t("sentence.no_data")}</Typography>
          )}
        </List>
        <CustomPagination className="pagination" spacing={2}>
          <Pagination
            className="pagination-btn"
            count={Math.ceil(totalCount / display)} // 총 페이지 수 계산
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </CustomPagination>
      </ContentsArea>
    </Wrapper>
  );
}

export default MembersManage;