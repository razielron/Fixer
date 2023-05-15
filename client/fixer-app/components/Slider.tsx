import Carousel from 'react-bootstrap/Carousel';

type Props =   {
  iamgeArray: string[]
}

const Slider: React.FC<Props> =(props) => {
  return (
    <Carousel>
      {props.iamgeArray.map((image : string) => (
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image}
            alt="First slide"
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default Slider;