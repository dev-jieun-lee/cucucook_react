import { useState } from "react";
import { Link } from "react-router-dom";
import { Col, LinkItem, MainMenu, SubMenu } from "../styles/MenuStyle";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthContext";

function Menu() {
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState(null);
  const { user } = useAuth(); //로그인 상태관리

  const handleMouseEnter = (index: any) => {
    setActiveMenu(index);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <MainMenu>
      <ul className="main-menu">
        <Col>
          <li
            className="main-menu-item"
            onMouseEnter={() => handleMouseEnter(0)}
            onMouseLeave={handleMouseLeave}
          >
            <div>
              <span
                className={`menu-title ${activeMenu === 0 ? "active" : ""}`}
              >
                {t("menu.recipe.original")}
              </span>
            </div>
            <SubMenu className="sub-menu">
              <ul>
                <li>
                  <LinkItem to="/recipe/all_recipe_list">
                    {t("menu.recipe.all")}
                  </LinkItem>
                </li>
                <li>
                  <LinkItem to="/recipe/public_recipe_list">
                    {t("menu.recipe.public")}
                  </LinkItem>
                </li>
                <li>
                  <LinkItem to="/recipe/member_recipe_list">
                    {t("menu.recipe.member")}
                  </LinkItem>
                </li>
              </ul>
            </SubMenu>
          </li>
          <li
            className="main-menu-item"
            onMouseEnter={() => handleMouseEnter(1)}
            onMouseLeave={handleMouseLeave}
          >
            <div>
              <span
                className={`menu-title ${activeMenu === 1 ? "active" : ""}`}
              >
                {t("menu.board.original")}
              </span>
            </div>
            <SubMenu className="sub-menu">
              <ul>
                <li>
                  <LinkItem to="/notice">{t("menu.board.notice")}</LinkItem>
                </li>
                <li>
                  <LinkItem to="/faq">{t("menu.board.FAQ")}</LinkItem>
                </li>
                <li>
                  <LinkItem to="/qna">{t("menu.board.QNA")}</LinkItem>
                </li>
              </ul>
            </SubMenu>
          </li>
          {user ? (
            <li
              className="main-menu-item"
              onMouseEnter={() => handleMouseEnter(2)}
              onMouseLeave={handleMouseLeave}
            >
              <div>
                <span
                  className={`menu-title ${activeMenu === 2 ? "active" : ""}`}
                >
                  {t("mypage.original")}
                </span>
              </div>
              <SubMenu className="sub-menu">
                <ul>
                  <li>
                    <LinkItem to="/mypage/profile">
                      {t("mypage.profile")}
                    </LinkItem>
                  </li>
                  <li>
                    <LinkItem to="/mypage/activity">
                      {t("mypage.activity")}
                    </LinkItem>
                  </li>
                </ul>
              </SubMenu>
            </li>
          ) : (
            <></>
          )}
          {user?.role === "0" || user?.role === "2" ? (
            <li
              className="main-menu-item"
              onMouseEnter={() => handleMouseEnter(3)}
              onMouseLeave={handleMouseLeave}
            >
              <div>
                <span
                  className={`menu-title ${activeMenu === 3 ? "active" : ""}`}
                >
                  {t("menu.admin.original")}
                </span>
              </div>
              <SubMenu className="sub-menu">
                <ul>
                  <li>
                    <LinkItem to="/admin/members">
                      {t("menu.admin.members")}
                    </LinkItem>
                  </li>
                  <li>
                    <LinkItem to="/admin/category/board">
                      {t("menu.admin.category_board")}
                    </LinkItem>
                  </li>
                  <li>
                    <LinkItem to="/admin/category/recipe">
                      {t("menu.admin.category_recipe")}
                    </LinkItem>
                  </li>
                </ul>
              </SubMenu>
            </li>
          ) : (
            <></>
          )}
        </Col>
      </ul>
    </MainMenu>
  );
}

export default Menu;
