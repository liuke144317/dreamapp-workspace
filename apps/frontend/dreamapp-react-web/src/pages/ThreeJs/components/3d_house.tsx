import { useRef, useEffect } from 'react';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';

const House = () => {
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
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
      scene.background = new THREE.Color(0xffffff);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(threeDiv.clientWidth, threeDiv.clientHeight);
      threeDiv.appendChild(renderer.domElement);
      const geometry = new THREE.SphereGeometry(2, 32, 16);
      // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      let sphere: THREE.Mesh | null = null;
      new RGBELoader().load(
        '3d/texture/warm_restaurant_night_4k.hdr',
        function (texture) {
          const material = new THREE.MeshBasicMaterial({
            map: texture,
          });
          sphere = new THREE.Mesh(geometry, material);
          sphere.geometry.scale(12, 12, -12);
          scene.add(sphere);
        },
      );
      // 创建点精灵
      const spriteTexture = new THREE.TextureLoader().load(
        '3d/texture/enter_icon.png',
      );
      const spriteMaterial = new THREE.SpriteMaterial({ map: spriteTexture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(2, 2, 1);
      sprite.position.set(16, 1, 10);
      scene.add(sprite);
      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      const caster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      // renderer.domElement.addEventListener('mousemove', (event) => {
      //   mouse.x = ((event.clientX - 160) / threeDiv.clientWidth) * 2 - 1;
      //   mouse.y = -((event.clientY - 60) / threeDiv.clientHeight) * 2 + 1;
      //   caster.setFromCamera(mouse, camera);
      //   const intersect = caster.intersectObject(sprite);
      //   console.log('intersect', intersect);
      // });
      enum rootTypeEnum {
        livingRoom,
        bedRoom,
        toilet,
        kitchen,
      }
      let rootType: rootTypeEnum = rootTypeEnum.livingRoom;
      renderer.domElement.addEventListener('mousedown', (event) => {
        mouse.x = ((event.clientX - 160) / threeDiv.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - 60) / threeDiv.clientHeight) * 2 + 1;
        caster.setFromCamera(mouse, camera);
        const intersect = caster.intersectObject(sprite);
        console.log('intersect', intersect);
        if (intersect.length) {
          if (rootType === rootTypeEnum.livingRoom) {
            new RGBELoader().load(
              '3d/texture/warm_restaurant_night_4k.hdr',
              function (texture) {
                const material = new THREE.MeshBasicMaterial({
                  map: texture,
                });
                if (sphere) {
                  sphere.material = material;
                  sprite.position.set(16, 1, 10);
                }
              },
            );
            rootType = rootTypeEnum.bedRoom;
          } else if (rootType === rootTypeEnum.bedRoom) {
            new RGBELoader().load(
              '3d/texture/brown_photostudio_02_2k.hdr',
              function (texture) {
                const material = new THREE.MeshBasicMaterial({
                  map: texture,
                });
                if (sphere) {
                  sphere.material = material;
                  sprite.position.set(-16, 1, -10);
                }
              },
            );
            rootType = rootTypeEnum.livingRoom;
          }
        }
      });
      function animate() {
        controls.update();
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
      animate();
    }
  }, []);
  return <div className="h-full" ref={threeDom}></div>;
};
export default House;
