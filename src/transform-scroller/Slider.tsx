import React from "react";
import { SliderContext } from "./SliderContext";
import { throttle } from "./helper";

export interface ISlide {
  className: string;
  children: React.ReactElement;
  offset: any;
  props?: {
    offset: any;
  };
}

export interface ISlider {
  className?: string;
  children?: any;
  interval?: number;
  direction?: "x" | "y";
  sliderStyle?: object;
  style?: object;
}

type Point = {
  x: number;
  y: number;
};

export const Slider: React.FC<React.PropsWithChildren<ISlider>> = (
  props: ISlider
) => {
  // for tracking the pointer down event
  const [startPos, setStartPos] = React.useState<Point>({ x: 0, y: 0 });
  const [endPos, setEndPos] = React.useState<Point>({ x: 0, y: 0 });

  const [currOffset, setCurrOffset] = React.useState<number>(0);
  const [index, setIndex] = React.useState(0);

  const getValidChildren = () => {
    const validChildren: ISlide[] = [];

    React.Children.forEach(props.children, (c) => {
      if (c.type.name !== undefined || c.type.name === "Slide") {
        validChildren.push(c);
      }
    });
    return validChildren;
  };

  const children = getValidChildren();

  // track offset
  React.useEffect(() => {
    const currSlide: ISlide = children[index];
    if (currSlide.props !== undefined){
      setCurrOffset(currSlide.props.offset);
    }
    
  }, [index]);



  const next = () => {
    setIndex((index) => {
      const maxIndex = children.length - 1;
      if (index + 1 > maxIndex) {
        return index;
      } else {
        return index + 1;
      }
    });
  };

  const prev = () => {
    setIndex((index) => {
      if (index - 1 < 0) {
        return 0;
      } else {
        return index - 1;
      }
    });
  };

  const slideTo = (index: number) => {
    setIndex(index);
  };

  // for handling the wheel events function (fix this on touch events)
  const changeSlideByWheel = (e: React.WheelEvent) => {
    console.log(e.deltaY);
    if (e.deltaY < 0) {
      prev();
    } else if (e.deltaY >= 1) {
      next();
    }
  };

  // for handling the touch events
  const changeSlideByPointer = (startPos: Point, endPos: Point) => {
    const minimum = 50;
    if (endPos.y === null || endPos.x === null) return;


    if (startPos.y - endPos.y > minimum) {
      next();
    } else if (startPos.y - endPos.y < -minimum) {
      prev();
    }
  };

  // for throttling wheel events
  const throttledWheelSlide = React.useRef(
    throttle((e: React.WheelEvent) => {
      changeSlideByWheel(e);
    }, props.interval)
  );

  const throttledPointerSlide = React.useRef(
    throttle((startPos: Point, endPos: Point) => {
      changeSlideByPointer(startPos, endPos);
    }, props.interval)
  );

  // Event handlers
  const handleWheelEvent = (e: React.WheelEvent<HTMLDivElement>) => {
    console.log(e);
    throttledWheelSlide.current(e);
  };

  const handlePointerDownEvent = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "touch") return;
    setEndPos({ x: 0, y: 0 });
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMoveEvent = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "touch") return;
    setEndPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerLeaveEvent = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "touch") return;
    throttledPointerSlide.current(startPos, endPos);
  };

  // helpers

  return (
    <SliderContext.Provider
      value={{ index: index, prev: prev, next: next, slideTo: slideTo }}
    >
      <div
        className={props.className}
        onWheel={handleWheelEvent}
        onPointerMove={handlePointerMoveEvent}
        onPointerDown={handlePointerDownEvent}
        onPointerLeave={handlePointerLeaveEvent}
        style={{ overflow: "hidden", ...props.style, touchAction: "none" }}
      >
        <div
          style={{
            display: "grid",
            transform:
              props.direction === "y"
                ? `translateY(${currOffset}vh)`
                : `translateX(${currOffset}vw)`,
            ...props.sliderStyle,
          }}
        >
          {props.children}
        </div>
      </div>
    </SliderContext.Provider>
  );
};
// TODO
// - add support for direction
