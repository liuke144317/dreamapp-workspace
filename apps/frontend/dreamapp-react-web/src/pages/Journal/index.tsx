import { useState } from 'react';

const Journal = () => {
  const [contentItemList, setContentItemList] = useState([
    {
      userImg: '',
      date: '12年12月2日',
      title: '',
    },
  ]);

  return <div className="w-full h-full overflow-auto"></div>;
};
export default Journal;
