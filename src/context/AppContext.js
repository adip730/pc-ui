import React, { createContext, useEffect, useRef, useState } from "react";
import { getProjects, getConfig, getHdri } from "../api/api";

import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [projects, setProjects] = useState([]);
  const [projectRoutes, setProjectRoutes] = useState([]);
  const [config, setConfig] = useState([]);
  const [test_hdri, setTestHdri] = useState(null);

  const [showNav, setShowNav] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [loadedVids, setLoadedVids] = useState([]);

  const [videoMap, setVideoMap] = useState({});

  const [loaded, setLoaded] = useState(false);
  const [loadedHdr, setLoadedHdr] = useState(false);

  const [gltf, setGltf] = useState(null);
  const [texture, setTexture] = useState(null);

  const doHdrLoad = async () => {
    if (!loadedHdr && !texture) {
      const hdrLoader = new THREE.TextureLoader();

      await hdrLoader.load(
        "/Textures/tex (1)/Ultimate_Skies_4k_0058.jpg",
        function (texture) {
          console.log("texture id in AppContext: ", texture.uuid);

          setLoadedHdr(true);
          setTexture(texture);

          let hdrtime = Date.now().toLocaleString("en-us", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            fractionalSecondDigits: 3,
          });
          console.log("time to finish hdr load: ", hdrtime);
        }
      );
    }
  };

  const doLoad = async () => {
    if (!loaded && !gltf) {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("decoder/draco/");

      const loader = new GLTFLoader();
      // loader.setDRACOLoader(dracoLoader);
      return new Promise((resolve, reject) => {
        loader.load(
          "/glTF/About Us_v3_Avatars Only.glb",
          function (gltf) {
            resolve(gltf);
          },
          undefined,
          function (error) {
            reject(error);
          }
        );
      });
    }
  };

  const invokeGetProjects = async () => {
    await getProjects()
      .then((res) => {
        let proj = res.data.data;
        let temp = [];
        let tempRoutes = [];
        proj.forEach((el) => {
          temp.push(el.attributes);
          tempRoutes.push({
            routeName: el.attributes.name,
            data: el.attributes,
          });
        });
        setProjects([...temp]);
        setProjectRoutes([...tempRoutes]);
      })
      .catch(() => {
        console.log("couldnt fetch projects");
      });
  };

  const invokeGetConfig = async () => {
    await getConfig()
      .then((res) => {
        let ret = [];
        if (res && res.data && res.data.data) {
          let conf = res.data.data.attributes.featuredIds;
          let arr = conf.split(",");
          arr.forEach((el) => ret.push(el.trim()));
        }
        setConfig([...ret]);
      })
      .catch(() => {
        console.log("couldnt fetch config");
        setConfig([]);
      });
  };

  const invokeGetHdri = async () => {
    return await getHdri()
      .then((res) => {
        if (res && res.data && res.data.data) {
          let ret = res.data.data.attributes.testHdri.data.attributes.url;
          // setTestHdri(ret);
          return ret;
        }
      })
      .catch(() => {
        console.log("couldnt fetch hdri");
        return "default"
        // setTestHdri("default");
      });
  };

  const handleHdri = async () => {
    return await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject("default");
        setTestHdri("default");
      }, 4000) // wait 10 sec
    
      invokeGetHdri().then(value => {
        clearTimeout(timeoutId)
        resolve(value)
        setTestHdri(value);
      })
    })
  }

  // useEffect(() => {
  //   if (
  //     config &&
  //     config?.length > 0 &&
  //     config?.length === loadedVids?.length &&
  //     !test_hdri
  //   ) {
  //     setTestHdri("default")
  //     setShowLoading(false);
  //     console.log("in app context useeffect");
  //   }
  //   // } else {
  //   //   setShowLoading(false);
  // }, [config, loadedVids, test_hdri]);

  const invokeStart = () => {
    invokeGetProjects();
    invokeGetConfig();
    handleHdri();
  };

  const state = {
    projects: projects,
    projectRoutes: projectRoutes,
    config: config,
    showNav: showNav,
    showLogo: showLogo,
    showLoading: showLoading,
    loadedVids: loadedVids,
    videoMap: videoMap,
    loaded: loaded,
    loadedHdr: loadedHdr,
    gltf: gltf,
    texture: texture,
    test_hdri: test_hdri,
  };
  const api = {
    invokeStart: invokeStart,
    setShowLoading: setShowLoading,
    setShowNav: setShowNav,
    setShowLogo: setShowLogo,
    setVideoMap: setVideoMap,
    setLoadedVids: setLoadedVids,
    doLoad: doLoad,
    setLoaded: setLoaded,
    setGltf: setGltf,
    setTestHdri: setTestHdri,
  };
  return (
    <AppContext.Provider value={{ state, api }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContext;
