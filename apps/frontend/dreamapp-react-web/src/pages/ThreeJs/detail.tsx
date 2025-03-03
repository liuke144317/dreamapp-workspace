import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { lazy } from 'react';
// import Draft from './components/draft.tsx';
// import BuildGltf from './components/build_gltf.tsx';
// import ThreeDHouse from './components/3d_house.tsx';
const Draft = lazy(() => import('./components/draft.tsx'));
const BuildGltf = lazy(() => import('./components/build_gltf.tsx'));
const ThreeDHouse = lazy(() => import('./components/3d_house.tsx'));

export default function Detail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  console.log('searchParams', type);
  if (type) {
    return (
      <>
        <div className="h-full relative">
          <div
            id="info"
            className="absolute top-1 left-1 text-[#000] hover:cursor-pointer z-10"
            onClick={() => {
              navigate(-1);
            }}
          >
            返回
          </div>
          {type === 'draft' && <Draft></Draft>}
          {type === 'build_gltf' && <BuildGltf></BuildGltf>}
          {type === '3d_house' && <ThreeDHouse></ThreeDHouse>}
        </div>
      </>
    );
  } else {
    return <div>组件不存在</div>;
  }
}
