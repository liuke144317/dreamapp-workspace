import * as THREE from 'three';
// @ts-expect-error 默认导入方式
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// @ts-expect-error 默认导入方式
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useEffect, useRef, useState } from 'react';

const BuildGltf = () => {
  const threeDom = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true); // 管理加载状态
  const [progress, setProgress] = useState(0); // 存储加载进度
  useEffect(() => {
    const threeDiv = threeDom.current;
    const threeDomCanvas = threeDom.current?.querySelector('canvas');
    if (threeDiv && !threeDomCanvas) {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);
      const camera = new THREE.PerspectiveCamera(
        75,
        threeDiv.clientWidth / threeDiv.clientHeight,
        0.1,
        1000,
      );
      // 计算随机数

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(threeDiv.clientWidth, threeDiv.clientHeight);
      threeDiv.appendChild(renderer.domElement);
      // 添加环境光
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);
      // 添加平行光
      const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
      directionalLight.position.set(1, 1, 1).normalize();
      scene.add(directionalLight);
      // 添加控制器
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 2;
      controls.maxDistance = 15;
      controls.maxPolarAngle = Math.PI / 2;
      // 加载模型
      const loader = new GLTFLoader();
      loader.load(
        '3d/file1/sketchfab_3d_editor_challenge_littlest_tokyo/scene.gltf',
        (gltf: { scene: THREE.Object3D<THREE.Object3DEventMap> }) => {
          //  ./scene.gltf  需换成自己的文件名
          console.log('gltf---', gltf);
          scene.add(gltf.scene);
          // 计算模型包围盒
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const size = new THREE.Vector3();
          box.getSize(size);
          const center = new THREE.Vector3();
          box.getCenter(center);
          const distance = Math.max(size.x, size.y, size.z);
          console.log('distance', distance);
          // 更新控制器的最小最大距离
          controls.minDistance = distance / 2;
          controls.maxDistance = distance * 3;
          camera.position.set(0, 0, distance);
          setLoading(false);
        },
        (xhr: { loaded: number; total: number }) => {
          // 在此处更新加载进度
          const progress = (xhr.loaded / xhr.total) * 100;
          setProgress(progress);
        },
        (error: Error) => {
          console.error('模型加载出错：', error);
          setLoading(false); // 如果加载失败，也要停止加载提示
        },
      );
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
      function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
      animate();
    }
  }, []);
  return (
    <div className="h-full relative" ref={threeDom}>
      {loading ? (
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          加载中：{progress}%
        </div>
      ) : null}
    </div>
  );
};
export default BuildGltf;
