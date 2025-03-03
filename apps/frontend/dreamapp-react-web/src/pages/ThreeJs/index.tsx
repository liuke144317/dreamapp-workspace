import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
const ThreeJs = () => {
  const navigate = useNavigate();
  const arr = [
    {
      name: '草稿1',
      des: '用于练习各种功能',
      path: 'draft',
    },
    {
      name: '建筑模型导入',
      des: '导入gltf格式的建筑模型，并在模型上标点，允许交互，有加载动画',
      path: 'build_gltf',
    },
    {
      name: '骨骼动画',
      des: '导入gltf格式的建筑模型',
      path: 'build_gltf',
    },
    {
      name: '关键帧动画',
      des: '导入gltf格式的建筑模型',
      path: 'build_gltf',
    },
    {
      name: '3D看房',
      des: '导入gltf格式的建筑模型',
      path: '3d_house',
    },
    {
      name: '贴图',
      des: '导入gltf格式的建筑模型',
      path: 'build_gltf',
    },
  ];
  const cardItems = arr.map((item, index) => {
    return (
      <Card
        title={item.name}
        bordered={false}
        style={{ width: '100%' }}
        className="mt-4 hover:cursor-pointer"
        onClick={() => toPage(item.path)}
        key={index}
      >
        <p>{item.des}</p>
      </Card>
    );
  });
  function toPage(path: string) {
    // navigate(path);
    console.log('path', path);
    navigate(`/three_js_detail?type=${path}`);
  }
  return <div className="grid grid-cols-6 gap-x-4 mx-4">{cardItems}</div>;
};
export default ThreeJs;
