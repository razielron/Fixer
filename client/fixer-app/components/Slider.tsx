import Carousel from 'react-bootstrap/Carousel';

type Props =   {
  pictures: string[]

}

const Slider: React.FC<Props> =(props) => {
  return (
    <Carousel>
      {props.pictures.map((picture : string) => (
        <Carousel.Item>
        <img
          className="d-block w-100"
          src={picture}
          alt="First slide"
        />
      </Carousel.Item>))}

    </Carousel>
  );
}

export default Slider;