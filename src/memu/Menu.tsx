
import { Button } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, LinkItem, MainMenu, SubMenu } from './MenuStyle';

function Menu(){
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMouseEnter = (index : any) => {
    setActiveMenu(index);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <MainMenu>
      <ul className='main-menu'>
      <Col>
          <li 
            className="main-menu-item"
            onMouseEnter={() => handleMouseEnter(0)}
            onMouseLeave={handleMouseLeave}
          >
            <div>
              <span className={`menu-title ${activeMenu === 0 ? 'active' : ''}`} >레시피</span>
            </div>
            <SubMenu className='sub-menu'>
              <ul>
                <li>
                  <LinkItem to="/all_recipe">전체</LinkItem>
                </li>
                <li>
                  <LinkItem to="/existing_recipe">기존 레시피</LinkItem>
                </li>
                <li>
                  <LinkItem to="/member_recipe">회원 레시피</LinkItem>
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
              <span className={`menu-title ${activeMenu === 1 ? 'active' : ''}`}>보드</span>
            </div>
            <SubMenu className='sub-menu'>
              <ul>
                <li>
                  <LinkItem to="/notice">공지사항</LinkItem>
                </li>
                <li>
                  <LinkItem to="/faq">자주묻는질문</LinkItem>
                </li>
                <li>
                  <LinkItem to="/qna">질의응답</LinkItem>
                </li>
              </ul>
            </SubMenu>
          </li>
          <li 
            className="main-menu-item"
            onMouseEnter={() => handleMouseEnter(2)}
            onMouseLeave={handleMouseLeave} 
          >
            <div>
              <span className={`menu-title ${activeMenu === 2 ? 'active' : ''}`}>마이페이지</span>
            </div>
            <SubMenu className='sub-menu'>
              <ul>
                <li>
                  <LinkItem to="/profile">내 정보</LinkItem>
                </li>
                <li>
                  <LinkItem to="/activity">내 활동</LinkItem>
                </li>
              </ul>
            </SubMenu>
          </li>
        </Col>
      </ul>
    </MainMenu>
  );
};

export default Menu;