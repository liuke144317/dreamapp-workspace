import React from 'react';
import SvgIcon from '@/components/SvgIcon';

type MenuProps = {
  status: boolean;
  data: API.MenuItem[];
  onClick: (data: API.MenuItem[], id: number) => void;
};
const MenuLeft: React.FC<MenuProps> = (props) => {
  function handleMenuItemClick(id: number) {
    props.onClick(props.data, id);
  }
  let menuItem = props.data.map((item) => (
    <div
      className="h-10 leading-10 flex items-center cursor-pointer group"
      key={item.id}
      onClick={() => handleMenuItemClick(item.id)}
    >
      <div
        className={`rounded-[50%] h-8 w-8 flex flex-row justify-center items-center mr-4 shrink-0 group-hover:bg-amber-200 ${item.selected ? 'bg-amber-200' : 'bg-[rgba(0,0,0,0.25)]'}`}
      >
        <SvgIcon name={item.svgIcon} size="18px" />
      </div>
      <div
        className={`shrink-0 group-hover:text-amber-200 ${item.selected ? 'text-amber-200' : ''}`}
      >
        {item.name}
      </div>
    </div>
  ));
  return (
    <div
      className={`transition-[width] ease-in-out delay-150  overflow-hidden ${
        props.status
          ? 'border-r px-3 py-2 w-[160px]'
          : 'border-r px-3 py-2 w-[60px]'
      }`}
    >
      {menuItem}
    </div>
  );
};
export default MenuLeft;
