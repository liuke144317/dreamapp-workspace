import React, { useState, useRef } from 'react';
// import React from 'react';
import { List, Avatar, Button } from 'antd';
import styled from 'styled-components';
import api from '@/services';

const Wrapper = styled.div`
  margin: 10px 20px;
  .file-upload {
    display: flex;
  }
`;

const FileSys: React.FC = () => {
  // 定义文件分片大小
  const CHUNK_SIZE = 5 * 1024 * 1024;
  const [file, setFile] = useState<File | null>(null); // 用于存储用户选择的文件
  const [progress, setProgress] = useState(0); // 上传进度
  const uploading = useRef(false); // 用于防止重复触发上传逻辑 -----> 为什么用useRef
  const data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
  ];
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setProgress(0);
    }
  }
  // 计算文件的唯一标识
  async function calculateFileHash(file: File) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const sparkMD5 = require('spark-md5');
        const hash = sparkMD5.ArrayBuffer.hash(e.target?.result);
        resolve(hash);
      };
      reader.readAsArrayBuffer(file);
    });
  }
  async function handleUpload() {
    if (!file || uploading.current) return; // 未选择文件或者正在上传
    uploading.current = true;
    const fileHash = await calculateFileHash(file);
    console.log('fileHash', fileHash);
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE); // 计算文件分片总数
    // 检查哪些分片已上传
    const { data: uploadedChunks } = await api.request<number[]>({
      url: '/BLogs/Home/showList',
      method: 'POST',
      data: {
        fileName: file.name,
        fileHash,
      },
    });
    // 上传未完成的分片
    for (let index = 0; index < totalChunks; index++) {
      if (uploadedChunks?.includes(index)) {
        console.log('跳过chunkIndex', index);
        setProgress(((index + 1) / totalChunks) * 100);
        continue;
      }
      console.log('上传chunkIndex', index);
      // 创建当前分片
      const start = index * CHUNK_SIZE; // 分片的起始字节
      const end = index * CHUNK_SIZE; // 分片的结束字节
      const chunk = file.slice(start, end);
      console.log('chunk', chunk);
      // 上传分片
      const formData = new FormData();
      formData.append('fileHash', uploadedChunks[index].toString());
    }
  }
  return (
    <Wrapper>
      <div className="file-upload">
        <input type="file" onChange={handleFileChange} />
        <Button type="primary" onChange={handleUpload}>
          上传
        </Button>
      </div>
      <div>{progress}</div>
      <div>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item actions={[<a key="list-loadmore-edit">删除</a>]}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                  />
                }
                title={<a href="https://ant.design">{item.title}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
            </List.Item>
          )}
        />
      </div>
    </Wrapper>
  );
};
export default FileSys;
