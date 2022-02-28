import React from "React";
import { AiOutlineArrowDown, CgArrowDown, FaArrowCircleDown, FiArrowDownCircle } from "react-icons/all"
import { useRef } from "react"


export interface NextPageButtonProps {

  color?: "white" | "red";

}

export function NextPageButton(props: NextPageButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const callback = () => {
    var rect = ref?.current?.getBoundingClientRect();
    if (rect) {
      const bottom = document.documentElement.scrollTop + rect.bottom;
      window.scroll({ behavior: "smooth", left: 0, top: bottom })
    }
  }

  const colors = (props.color ?? "white") == "white" ? "text-white" : "text-red-600";

  return <div ref={ref} className={"flex content-center items-center p-4 hover:text-red-800 transition-colors cursor-pointer text-opacity-90 " + colors} onClick={callback}>
    <FiArrowDownCircle size="70px" className="m-auto" />
  </div>
}
