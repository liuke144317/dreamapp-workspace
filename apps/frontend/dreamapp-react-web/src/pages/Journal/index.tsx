// import { useEffect } from 'react';
import { useState, useEffect } from 'react';
import api from '@/services';
import { Image } from 'antd';
import { formatTime } from '@/utils/formatTime.ts';

const Journal = () => {
  interface ContentItem {
    list: {
      id: number;
      userImg: string;
      date: string;
      title: string;
      nickname: string;
      description: string;
      imageArr: imageType[];
      email: string;
      userid: string;
      topping: boolean;
    }[];
  }
  const [contentItemList, setContentItemList] = useState<ContentItem['list']>(
    [],
  );
  type imageType = {
    url: string;
  };
  useEffect(() => {
    // api.instance.get('/api/data').then((response) => {
    //   console.log('response', response);
    // });
    // api.get('/api/data').then((res) => {
    //   console.log('res', res);
    //   // setContentItemList(res.data.list);
    // });
    api
      .request<ContentItem>({
        url: '/api/data',
        method: 'GET',
      })
      .then((res) => {
        console.log('res', res.list);
        if (res.list) {
          setContentItemList(res.list);
        }
      });
  }, []);
  const userid = '';
  function isTopping(item: ContentItem['list'][0]): boolean {
    return userid === item.userid && item.topping;
  }
  const boxItem = contentItemList.map((item) => {
    return (
      <div className="mx-[20px] my-[30px]" key={item.id}>
        <div className="flex mb-[10ox] w-full">
          <div className="w-[40px] h-[40px] bg-black rounded-[5px] shrink-0 overflow-hidden">
            <Image className="w-full h-full" src={item.userImg} />
          </div>
          <div className="text-[12px] grow text-left ml-[10px]">
            <div>
              <span>
                {item.nickname + ' ' + formatTime(item.date, 'yyyy.MM.dd')}
              </span>
              {isTopping(item) ? <span className="hm-top">置顶</span> : null}
            </div>
            <div className="text-[15px] mt-[2px]">{item.title}</div>
          </div>
        </div>
      </div>
    );
  });
  return <div className="w-full h-full overflow-auto">{boxItem}</div>;
};
export default Journal;
