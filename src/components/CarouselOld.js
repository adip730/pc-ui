import React, { useState, useEffect, useRef} from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useTransition, animated } from 'react-spring';
import Button from '@mui/material/Button';
import ReactPlayer from 'react-player';
import useMediaQuery from "@mui/material/useMediaQuery";
import { Swipeable } from 'react-swipeable';
import ScrollHorizontal from 'react-scroll-horizontal';

const endpoint = process.env.REACT_APP_STRAPIURL;

const Carousel = ({ slides, thumbnail, setShowNav, useStyles }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [showText, setShowText] = useState(true); 
  const [isLoaded, setIsLoaded] = useState(false);

  const [featuredUrl, setFeaturedUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const largeScreen = useMediaQuery("(min-width:800px)");
  const xlargeScreen = useMediaQuery("(min-width:1200px)");

  const playerRef = useRef(null);

  const classes = useStyles();

  console.log(slides);
  console.log(slides[0]);

  useEffect(() => {
    let item = slides[currentSlide];
    let featUrl = item.attributes.url;
    let thumbUrl =
      thumbnail && thumbnail.data && thumbnail.data.attributes
        ? thumbnail.data.attributes.url
        : "";
    setFeaturedUrl(featUrl); 
    setThumbnailUrl(thumbUrl);
    if (item.attributes.mime.substring(0, 5) === 'video') {
      setPlaying(true);
    }
  }, [currentSlide]);

  useEffect(() => {
    if (!playing && isLoaded) {
      setShowOverlay(true);
    }
  }, [playing, isLoaded]);


  /*useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slides[currentSlide].images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(imageTimer);
  }, [slides, currentSlide]);*/

  useEffect(() => {
    if (!largeScreen) {
      if (!expanded) {
        setShowOverlay(true);
        setPlaying(false);
      }
    }
  }, [expanded]);

  const goToNextSlide = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      setCurrentImageIndex(0); // Reset inner carousel for the new slide
      setIsFading(false);
    }, 500); // Match the fade duration
  };

  const transitions = useTransition(featuredUrl, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 500 } // Adjust the duration as needed
  });

  const handleProgress = (changeState) => {
    if (changeState.played === 1) {
      setPlaying(false);
    }
    if (!seeking) {
      setVideoDuration(changeState.played);
    }
  };

  useEffect(() => {
    let container = document.getElementById("container");
    let player = document.getElementById("player-wrapper");
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
  }, [expanded]);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '92vh',
        width: '100vw',
        marginTop: '8vh',
        //alignItems: slides[currentSlide].alignItems,
        //justifyContent: slides[currentSlide].justifyContent,
        padding: '0 64px 160px 64px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        scrollSnapAlign: 'start',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.5s',
      }}
    >
      {/* Render the animated background images */}
      {transitions((style, featuredUrl) => (
        slides[currentSlide].attributes.mime.substring(0,5) === 'image' ? (
          <animated.div
            style={{
              ...style,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${item})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              zIndex: -1
            }}
          />
        ) : (
          <ReactPlayer
            onClick={() => setPlaying(!playing)}
            ref={playerRef}
            id="videoFrame"
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              borderRadius: expanded ? "0px" : "20px",
              overflow: "hidden",
              position: "absolute",
              top: 0,
              left: 0,
              alignContent: "center",
            }}
            url={`http://${endpoint}${featuredUrl}`}
            width={expanded ? "auto" : "100%"}
            height={expanded ? "100%" : "auto"}
            playing={playing}
            volume={volume}
            playsinline
            controls={false}
            progressInterval={100}
            onProgress={handleProgress}
            onReady={() => setIsLoaded(true)}/>)))}
          {showOverlay && (
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
          )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          position: 'absolute',
          //bottom: slides[currentSlide].bottom,
          //left: slides[currentSlide].left,
          justifyContent: 'space-between',
          paddingRight: '64px', // Same as the padding you've set for the main Box
          marginX: '3vw',
          alignItems: 'flex-end',
        }}
      >
        <Box
          sx={{
            padding: '10px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 80%)', // Transparent dark grey gradient
            borderRadius: '5px',
            opacity: showText ? 1 : 0, // Fade in/out based on state
            transform: showText ? 'scaleY(1)' : 'scaleY(0)', // Vertical expand/shrink based on state
            transformOrigin: 'bottom', // Anchor point for the transform
            transition: 'opacity 0.5s, transform 0.5s', // Smooth transition
            width: `69%`,
          }}
        >
          {/*<Typography variant="h4" color="white" paddingLeft="3rem">
            {slides[currentSlide].text}
        </Typography>*/}
        </Box>
        <Button onClick={goToNextSlide} text={slides[currentSlide].id} alignSelf="flex-end" sx={{marginRight: "2vw", alignSelf: "flex-end"}}/>
      </Box>
      <IconButton 
        onClick={() => setShowText(!showText)} 
        sx={{
          position: 'absolute',
          //bottom: !showText ? slides[currentSlide].bottom:`calc(${slides[currentSlide].bottom} + 1vh)`, // Adjust this value to position the arrow correctly
          //left: `calc(${slides[currentSlide].left} + 4vw)`, // Adjust this value to position the arrow correctly
          color: 'white',
          transform: showText ? 'rotate(270deg)' : 'rotate(90deg)', // Flip arrow based on state
          transition: 'transform 0.3s',
        }}
        >
          ❮{/* Unicode arrow. You can replace this with an SVG icon if preferred. */}
      </IconButton>
    </Box>
  );
};

export default Carousel;