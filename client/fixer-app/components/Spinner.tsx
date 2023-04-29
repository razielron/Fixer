import { ThreeDots } from "react-loader-spinner";
  
export default function Spinner() {
  return (
    <ThreeDots 
        height="80" 
        width="80" 
        radius="9"
        color="#ffc400" 
        ariaLabel="three-dots-loading"
        wrapperStyle={{top: '50%', left: '50%', position: 'fixed'}}
        visible={true}
    />
  )
}