interface FlashSaleIconSvgProps {
  width?: number;
  height?: number;
  startColor?: string;
  endColor?: string;
}

const FlashSaleIconSvg = (props: FlashSaleIconSvgProps) => {
  const { width = 10, height = 16, startColor = '#EE4D2D', endColor = '#FF7337' } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 10 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.23077 0H4.23077L0 7.82222L3.5 9.14286V16L10 5.68889L6.53846 4.62222L9.23077 0Z"
        fill="url(#paint0_linear_2216_10611)"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_2216_10611"
          x1="0"
          y1="0"
          x2="0"
          y2="16"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={startColor}></stop>
          <stop offset="1" stopColor={endColor}></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

export default FlashSaleIconSvg;
