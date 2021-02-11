import React, { useEffect } from 'react';

import { makeStyles } from '@material-ui/core';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import useCollectionData from './utils/useCollectionData';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    // paritialVisibilityGutter: 60,
    slidesToSlide: 2
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    // paritialVisibilityGutter: 50,
    slidesToSlide: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    // paritialVisibilityGutter: 30,
    slidesToSlide: 1
  }
};

const ButtonGroup = ({ next, previous, goToSlide, ...rest }: any) => {
  const {
    carouselState: { currentSlide }
  } = rest;

  const classes = useStyles();

  const CUSTOM_MAX = 2;

  return (
    <div className={classes.arrows}>
      {currentSlide === 0 ? null : (
        <button
          aria-label="Go to previous slide"
          onClick={() => previous()}
          className="react-multiple-carousel__arrow react-multiple-carousel__arrow--left"
          type="button"
        ></button>
      )}

      {currentSlide === CUSTOM_MAX ? null : (
        <button
          onClick={() => next()}
          aria-label="Go to next slide"
          className="react-multiple-carousel__arrow react-multiple-carousel__arrow--right"
          type="button"
        ></button>
      )}
    </div>
  );
};

const CarouselSlider = () => {
  const classes = useStyles();

  const [commissions, setCommissions] = React.useState<any>([]);
  const { loading: loadingCollections, art } = useCollectionData();

  useEffect(() => {
    if (!loadingCollections) {
      const arts = art
        .filter((x: any) => !x.hidden)
        .filter((x: any) => {
          return x && x?.tags && x.tags.includes('commissions');
        });

      setCommissions(arts || []);
    }
    // eslint-disable-next-line
  }, [loadingCollections, art]);

  return (
    <Carousel
      swipeable={false}
      className={classes.carousel}
      ssr
      arrows={false}
      draggable={false}
      responsive={responsive}
      infinite={false}
      autoPlay={false}
      centerMode={true}
      containerClass="carousel-container"
      renderButtonGroupOutside={true}
      customButtonGroup={<ButtonGroup />}
    >
      {commissions.map((art: any) => {
        const { name, path } = art;
        return <img className={classes.sliderImage} alt={name} src={path} />;
      })}
    </Carousel>
  );
};

export default CarouselSlider;

const useStyles = makeStyles(theme => ({
  sliderImage: {
    height: '200px',
    width: 'auto'
  },
  imageContainer: {
    position: 'relative'
  },
  arrows: {
    position: 'relative',
    top: '-57%'
  },
  carousel: {
    width: 875, // TODO change on mobile
    margin: 'auto',
    '& .react-multi-carousel-item': {
      width: `auto !important`,
      paddingLeft: 5,
      paddingRight: 5
    }
  }
}));
