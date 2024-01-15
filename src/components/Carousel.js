import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import useMediaQuery from "@mui/material/useMediaQuery";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, IconButton, Typography } from "@mui/material";

const Carousel = (props) => {
  const { featured, thumbnail, setShowNav, useStyles, endpoint, largeScreen } =
    props;
  //console.log(featured);
  //const [currentSlide, setCurrentSlide] = useState(0);
  //const [currentImageIndex, setCurrentImageIndex] = useState(0);
  //const [isFading, setIsFading] = useState(false);
  //const [showText, setShowText] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [carouselData, setCarouselData] = useState(null);

  //const [featuredUrl, setFeaturedUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const playerRef = useRef(null);

  const classes = useStyles();

  const sliderRef = useRef(null);

  const [activeSlide, setActiveSlide] = useState("");

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    //adaptiveHeight: true,
    centerPadding: "20%",
    slidesToShow: 1,
    speed: 500,
    focusOnSelect: true,
    //swipeToSlide: true,
    beforeChange: (current, next) => {
        if (carouselData && carouselData[next]) {
          const nextSlideName = carouselData[next].attributes.name || "";
          setActiveSlide(nextSlideName);
        }
      },
      afterChange: (current) => {
        if (carouselData && carouselData[current]) {
          const currentSlideName = carouselData[current].attributes.name || "";
          setActiveSlide(currentSlideName);
        }
        },
    //variableWidth: true, // Enable variable width slides
    responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
          }
        },
        {
          breakpoint: 600,
          settings: {
            focusOnSelect: false,
            swipeToSlide: true,
            centerPadding: "1%",
          }
        },
        ]
  };

  const handleProgress = (changeState) => {
    if (changeState.played === 1) {
      setPlaying(false);
    }
    if (!seeking) {
      setVideoDuration(changeState.played);
    }
  };

  const renderSlide = (slide) => {
    const isActiveSlide = slide.attributes.name === activeSlide;
    //console.log(slide.attributes.name);
    //console.log(activeSlide);
    //console.log(isActiveSlide);

    const slideStyle = isActiveSlide
      ? {
          transform: "scale(1.0)",
          opacity: 1,
          filter: "brightness(100%)",
          transition: "all 0.5s ease-in-out",
        }
      : {
          transform: "scale(0.8)",
          opacity: 0.5,
          filter: "brightness(50%)",
          transition: "all 0.5s ease-in-out",
        }; // Styles for the other slides

    let tempslide = slide.attributes.mime.includes("video") ? (
      <div
        key={slide.attributes.name}
        style={{...slideStyle}}
        className={
          classes.slide
        } /*id={"player-wrapper"} onClick={() => setPlaying(!playing)} onMouseEnter={() => playing && setShowOverlay(true)} onMouseLeave={() => playing && setShowOverlay(false)*/
      >
        <ReactPlayer
          onClick={() => setPlaying(!playing)}
          ref={playerRef}
          id="videoFrame"
          style={{
            ...slideStyle,
            //borderRadius: expanded ? "0px" : "20px",
            borderRadius: "20px",
            overflow: "hidden",
            //boxSizing: "border-box",
            //overflow: "visible",
            //position: "absolute",
            //top: 0,
            //left: 0,
            //alignContent: "center",
            //objectFit: "contain",
            maxHeight: "100%",
            maxWidth: "100%",
            //flexGrow: 1,
            //justifySelf: "center",
            //alignSelf: "center",
            margin:"0 auto",
          }}
          url={`http://${endpoint}${slide.attributes.url}`}
          //width={expanded ? "auto" : "100%"}
          //height={expanded ? "100%" : "auto"}
          playing={isActiveSlide && playing}
          volume={volume}
          playsinline
          controls={false}
          progressInterval={100}
          onProgress={handleProgress}
          onReady={() => setIsLoaded(true)}
        />
      </div>
    ) : (
      <div style={{display: "flex", justifyContent: "center", alignItems: "center"}} key={slide.attributes.name} className={classes.slide}>
        <img
          style={{
            ...slideStyle,
            borderRadius: "20px",
            maxHeight: "100%",
            maxWidth: "100%",
            margin:"0 auto",
            //objectFit: "contain",
            //justifySelf: "center",
            //alignSelf: "center",
            //flexGrow: 1,
          }}
          src={`http://${endpoint}${slide.attributes.url}`}
          alt={slide.attributes.name}
        />
      </div>
    );
    //console.log(`http://${endpoint}${slide.attributes.url}`);
    //console.log(slide.attributes.mime.substring(0, 5) === 'video');
    return tempslide;
  };

  useEffect(() => {
    if (!!featured && featured.data.length > 0) {
      const mappedData = featured.data.map((item) => ({
        ...item,
      }));
      setCarouselData(mappedData);
      setActiveSlide(mappedData[0]?.attributes?.name || "");
    }
  }, [featured]);

  useEffect(
    () => {
      //let item = slides[currentSlide];
      //let featUrl = item.attributes.url;
      let thumbUrl =
        thumbnail && thumbnail.data && thumbnail.data.attributes
          ? thumbnail.data.attributes.url
          : "";
      //setFeaturedUrl(featUrl);
      setThumbnailUrl(thumbUrl);
      /*if (item.attributes.mime.substring(0, 5) === 'video') {
      setPlaying(true);
    }*/
    },
    [
      /*currentSlide*/
    ]
  );

  useEffect(() => {
    if (!playing && isLoaded) {
      setShowOverlay(true);
    }
  }, [playing, isLoaded]);

  /*useEffect(() => {
    if (!largeScreen) {
      if (!expanded) {
        setShowOverlay(true);
        setPlaying(false);
      }
    }
  }, [expanded]);*/

  /*useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY < 0) {
        sliderRef.current.slickPrev();
      } else {
        sliderRef.current.slickNext();
      }
    };

    if (sliderRef.current) {
        const sliderNode = sliderRef.current.innerSlider.list;
    
        sliderNode.addEventListener('wheel', handleWheel);
    
        return () => {
          sliderNode.removeEventListener('wheel', handleWheel);
        };
      }
  }, []);*/

  /*useEffect(() => {
    let container = document.getElementById("container");
    //let player = document.getElementById("player-wrapper");
    let player = document.getElementById("");
    let root = document.getElementById("pageRoot");
    if (container && player) {
      if (expanded) {
        setShowNav(false);
        player.style.transition = ".25s";
        container.style.transition = "all 1s ease-in-out";
        player.style.transformOrigin = "0 50%";
        container.style.transformOrigin = "center";
        player.style.borderRadius = 0;
        container.style.height = "100vh";
        player.style.paddingTop = "56.25%";
        player.style.height = "auto";
        player.style.width = "100%";
        container.style.width = "100vw";
        container.style.position = "fixed";
        container.style.top = 0;
        container.style.left = 0;
        container.style.right = 0;
        container.style.bottom = 0;
        container.style.marginBottom = 0;
        container.style.borderRadius = 0;
        container.style.backgroundColor = "#1a1a1a";
      } else {
        setShowNav(true);
        container.style.transition = "0s";
        container.style.height = "60%";
        container.style.width = "100%";
        container.style.position = "relative";
        container.style.marginBottom = "24px";
        container.style.borderRadius = "20px";
        container.style.backgroundColor = "#FFFFFF";
        player.style.borderRadius = "20px";
        player.style.paddingTop = 0;
        player.style.height = "100%";
        player.style.width = "";
      }
    }
  }, [expanded]);*/

  return (
    <div>
      <Slider {...settings} ref={sliderRef}>
        {!!carouselData && carouselData.map((slide) => renderSlide(slide))}
        {/*!!carouselData ? console.log("here") : console.log("there")*/}
      </Slider>
    </div>
  );
};

export default Carousel;

/*{!!carouselData && <div className={classes.slide}>
            <img src={`http://${endpoint}${carouselData[1].attributes.url}`} objectFit="scale-down" height="100px" width="100px" />
            </div>}*/

/*<div
        className={classes.carouselWrapper}
        id="container"
        // onMouseEnter={() => expanded && setShowControls(true)}
        // onMouseLeave={() => expanded && setShowControls(false)}
        onMouseEnter={() => playing && setShowOverlay(true)}
        onMouseLeave={() => playing && setShowOverlay(false)}
      >
        <Slider ref={sliderRef} {...settings}>
            {data.map(renderSlide)}
  </Slider>
  
       /*<Slider ref={sliderRef} {...settings}>
            {renderSlide(data[2])}
            {/*data.map(renderSlide)}
            /*</Slider>*/
/*{showOverlay && (
            <>
                <div className={classes.overlay}>
                <IconButton
                    size="large"
                    style={{ color: "#FFFFFF" }}
                    onClick={() => {
                    setShowOverlay(!showOverlay);
                    setPlaying(!playing);
                    }}
                >
                    <Typography
                    sx={{
                        fontFamily: "Square721",
                        fontSize: "1rem",
                    }}
                    >
                    {playing ? "PAUSE" : "PLAY"}
                    </Typography>
                </IconButton>
                </div>
                {thumbnailUrl !== "" && (
                <img
                    className={classes.thumbnail}
                    src={`http://${endpoint}${thumbnailUrl}`}
                />
                )}
            </>
                )}*/
// </div>/*
