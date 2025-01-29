import { useNavigate, Outlet } from 'react-router-dom';
import MenuLeft from '@/components/MenuLeft';
import TopBar from '@/components/TopBar';
import { useState } from 'react';

function Home() {
  const navigate = useNavigate();
  const [expand, setExpand] = useState(true);
  const [menuList, setMenuList] = useState([
    {
      id: 1,
      name: '日记',
      svgIcon: 'menu-journal',
      selected: true,
      path: 'journal',
    },
    {
      id: 2,
      name: '大文件上传',
      svgIcon: 'menu-file',
      selected: false,
      path: 'file_sys',
    },
    {
      id: 3,
      name: '视频播放',
      svgIcon: 'menu-film',
      selected: false,
      path: 'film',
    },
    {
      id: 4,
      name: '监控播放',
      svgIcon: 'menu-film',
      selected: false,
      path: 'film',
    },
    {
      id: 5,
      name: 'Three.js',
      svgIcon: 'menu-film',
      selected: false,
      path: 'three_js',
    },
  ]);
  const [title, setTitle] = useState('日记');
  function handleExpand() {
    setExpand(!expand);
  }
  function handleMenuClick(data: API.MenuItem[], id: number) {
    const updateMenuList = data.map((item) =>
      item.id === id
        ? { ...item, selected: true }
        : { ...item, selected: false },
    );
    setMenuList(updateMenuList);
    const filerData = updateMenuList.find((item) => item.selected);
    if (filerData) {
      setTitle(filerData.name);
      navigate(filerData.path);
    }
  }
  return (
    <div className="w-full absolute bottom-0 left-0 top-0 right-0 flex flex-col">
      <TopBar onClick={handleExpand} title={title}></TopBar>
      <div className="grow flex flex-row min-h-0">
        <MenuLeft
          status={expand}
          data={menuList}
          onClick={handleMenuClick}
        ></MenuLeft>
        <div className="flex-grow h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Home;
