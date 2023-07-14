import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

type Props =   {
  iamgeArray: string[]
}

const Slider: React.FC<Props> =(props) => {
  return (
   <>
    <Carousel>
      {props.iamgeArray.map((image : string) => (
        <Carousel.Item>
          <img
            key={Math.floor(Math.random() * 1000)}
            className="d-block w-100"
            src={image}
            alt="First slide"
          />
        </Carousel.Item>
      ))}
    </Carousel>
   </> 
  );
}

export default Slider;