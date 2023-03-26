import { ReactNode } from "react";
import Slider, { Settings } from "react-slick";

//
import { defaultSettings } from "./settings";

interface CarouselProps {
  children: ReactNode;
  settings?: Settings;
}

const Carousel = ({ children, settings }: CarouselProps) => {
  return (
    <Slider {...defaultSettings} {...settings}>
      {children}
    </Slider>
  );
};

export default Carousel;
