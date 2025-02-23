import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

/**
 * @description 用于练习各种功能的草稿
 */
const Draft = () => {
  const navigate = useNavigate();
  const threeDom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const threeDiv = threeDom.current;
    const threeDomCanvas = threeDom.current?.querySelector('canvas');
    if (threeDiv && !threeDomCanvas) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        threeDiv.clientWidth / threeDiv.clientHeight,
        0.1,
        1000,
      );
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(threeDiv.clientWidth, threeDiv.clientHeight);
      threeDiv.appendChild(renderer.domElement);
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);

      const points = [];
      points.push(new THREE.Vector3(-3, 0, 0));
      points.push(new THREE.Vector3(0, 3, 0));
      points.push(new THREE.Vector3(3, 0, 0));
      points.push(new THREE.Vector3(0, -3, 0));
      points.push(new THREE.Vector3(0, -3, 0));
      points.push(new THREE.Vector3(-3, 0, 0));
      const geometry1 = new THREE.BufferGeometry().setFromPoints(points);
      const material1 = new THREE.LineBasicMaterial({ color: 0x0000ff });
      const cube1 = new THREE.Line(geometry1, material1);
      // cube1.position.x = -3;
      // cube1.rotation.y = -10;
      scene.add(cube);
      scene.add(cube1);
      camera.position.z = 5;
      function animate() {
        requestAnimationFrame(animate);
        if (scene && camera) {
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
          cube1.rotation.x += 0.01;
          cube1.rotation.y += 0.01;
          renderer.render(scene, camera);
        }
      }
      animate();
    }
  }, []);
  return (
    <div className="h-full relative" ref={threeDom}>
      <div
        id="info"
        className="absolute top-1 left-1 text-[#fff] hover:cursor-pointer"
        onClick={() => {
          navigate(-1);
        }}
      >
        返回
      </div>
    </div>
  );
};
export default Draft;
