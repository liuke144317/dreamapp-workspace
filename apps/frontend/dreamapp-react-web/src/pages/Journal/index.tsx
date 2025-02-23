// import { useEffect } from 'react';
import { useState, useEffect } from 'react';
import api from '@/services';
import { Image } from 'antd';
import { formatTime } from '@/utils/formatTime.ts';

const Journal = () => {
  type ContentItem = {
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
  };
  const [contentItemList, setContentItemList] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  // let minIOShowPath = ''
  type imageType = {
    url: string;
  };
  // async function getMinIOShowPath() {
  //   return api.request<string>({
  //     url: '/MinIO/ShowPath',
  //     method: 'get',
  //   });
  // }
  useEffect(() => {
    // const loginApiRes = await getMinIOShowPath()
    // if (loginApiRes.status === 200) {
    //   minIOShowPath = loginApiRes.data
    // }
    // api.instance.get('/api/data').then((response) => {
    //   console.log('response', response);
    // });
    // api.get('/api/data').then((res) => {
    //   console.log('res', res);
    //   // setContentItemList(res.data.list);
    // });
    api
      .request<ContentItem[]>({
        url: '/BLogs/Home/showList',
        method: 'POST',
        data: {
          pageParams: {
            pageSize: 10,
            currentPage: 1,
          },
          params: {
            labelName: '',
            id: '',
            read_password: '',
            self: '',
            isDetail: false,
          },
        },
      })
      .then((res) => {
        console.log('res', res.data);
        setLoading(false);
        if (res.data) {
          setContentItemList(res.data);
        }
      });
  }, []);
  const userid = '';
  function isTopping(item: ContentItem): boolean {
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
        <div className="bg-[#f6f6f6] rounded-[10px] text-left overflow-hidden">
          <div
            className="mx-[10px] my-[15px]"
            style={{ width: 'calc(100% - 30px)' }}
            dangerouslySetInnerHTML={{ __html: item.description }}
          ></div>
        </div>
      </div>
    );
  });
  return (
    <div className="w-full h-full overflow-auto">
      {loading ? (
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          加载中...
        </div>
      ) : (
        boxItem
      )}
    </div>
  );
};
export default Journal;
