  //引入threejs
    import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  // stats 性能监视器
  import Stats from 'three/addons/libs/stats.module.js';

  const stats = new Stats();
  stats.setMode(1); // 默认模式 0  ，1渲染周期，渲染一帧多长时间（单位毫秒ms）   
  document.body.appendChild(stats.domElement);
  //创建一个三维场景scene
  const scene = new THREE.Scene();
  //给三维场景添加物体
  //顶一个几何体长方体长宽高都是18阳
  // const geometry = new THREE.BoxGeometry(50, 50, 50);
  // //创建一个材质对象
  // const material = new THREE.MeshLambertMaterial({
  //   color: 0x00ffff, //材质颜色
  //   //  transparent: true, //是否透明
  //   //  opacity: 0.5 //透明度
  // });
  // //创建一个网格模型：表示生活中的物体
  // const mesh = new THREE.Mesh(geometry, material);
  // //  mesh.position.set(0, 10, 0);
  // //把mesh添加到场景中
  // scene.add(mesh);

  // 性能测试，创建多个立方体
  const num = 1000;
  for(let i = 0; i < num; i++) {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshLambertMaterial({
      color: 0x00ffff, 
    })
    const mesh = new THREE.Mesh(geometry, material);
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 200;
    mesh.position.set(x, y, z);
    scene.add(mesh);
  }
  // end 性能测试，创建多个立方体

  // 辅助观察的坐标系
  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);

  // 设置光源
  //  const pointLight = new THREE.PointLight(0xffffff, 1.0)
  //  // 点光源位置
  //  pointLight.position.set(400, 200, 300) // 偏移光源位置，观察渲染效果
  //  scene.add(pointLight) // 点光源添加到场景中
  // 环境光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  // 设置光源方向：通过光源 position 属性和目标指向对象的 position 属性计算
  directionalLight.position.set(100, 100, 100);
  // directionalLight.target = mesh
  scene.add(directionalLight);
  // 平行光
  // const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xff0000)
  // scene.add(dirLightHelper)

  const width = window.innerWidth;
  const height = window.innerHeight;
  // 创建一个透视投影相机对象， fov aspect宽高比 near近端面 far远端面
  // 参数： 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
  // 相机在Three.js三维坐标系中的位置
  camera.position.set(200, 300, 300);
  // 设置相机的朝向 观察目标点的坐标
  camera.lookAt(0, 0, 0);
  // camera.lookAt(mesh.position) // 设置网格模型 mesh 
  

  // 创建 webgl 渲染器
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height); // canvas 画布宽高对，渲染区域尺寸
  renderer.render(scene, camera); // 执行渲染(拍照)
  // 将拍照(渲染结果)添加到页面的画布上
  document.body.appendChild(renderer.domElement);

  // 动画（渲染循环），默认理想状态下美妙执行60次（具体看性能）
  const clock = new THREE.Clock(); // 创建时钟对象
  function render() {
    // const spt = clock.getDelta()*1000; // 毫秒 , 每秒约 60次 （FPS）左右
    stats.update();
    // mesh.rotateY(0.01); // 周期性旋转，每次宣传0.01弧度
    renderer.render(scene, camera); // 周期性执行相机渲染，更新画布内容
    requestAnimationFrame(render);
  }
  render();

  // 设置相机空间轨道控制器 OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.addEventListener('change', () => {
    renderer.render(scene, camera); // 执行渲染操作
  })

  window.onresize = function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    // 重置渲染器画布尺寸
    renderer.setSize(width, height);
    // 全平情况下： 设置观察范围长宽比 aspect 为窗口宽高比
    camera.aspect = width / height;
    // 渲染器执行 render 方法的时候会读取相机对象的矩阵属性 projectionMatrix
    // 不会渲染每一帧，就通过相机的属性计算投影矩阵（节约计算资源）
    // 如果相机的一些属性发生变化，需要执行 updateProjectionMatrix() 方法更新矩阵
    camera.updateProjectionMatrix();
  }