import SvgIcon from '@/components/SvgIcon';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Badge } from 'antd';
function TopBar({ onClick, title }) {
  return (
    <div className="w-full border-b h-[60px] flex items-center">
      <div className="w-[25%]">
        <SvgIcon
          name="expand"
          size="40px"
          className="cursor-pointer ml-2"
          onClick={onClick}
        />
      </div>
      <div className="w-[50%] h-full align-middle leading-[60px] font-sans text-lg font-bold">
        {title}
      </div>
      <div className="w-[25%] h-full leading-[60px] flex items-center justify-end p-[30px]">
        <Avatar size="large" icon={<UserOutlined />} className="mr-[10px]" />
        <div className="mr-[10px]">取名回忆的时光</div>
        <Badge count={5}>
          <Avatar shape="square" size="large" />
        </Badge>
      </div>
    </div>
  );
}

export default TopBar;
