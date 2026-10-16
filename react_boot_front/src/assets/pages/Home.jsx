import Carousel from "react-bootstrap/Carousel"

function Home() {
    return (
        <>
            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/src/assets/bannerImage/banner-1.png"
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        <h3>첫 번째 슬라이드</h3>
                        <p>이미지와 텍스트를 추가할 수 있습니다.</p>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/src/assets/bannerImage/banner-2.png"
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                        <h3>두 번째 슬라이드</h3>
                        <p>다양한 콘텐츠를 넣을 수 있어요.</p>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/src/assets/bannerImage/banner-3.png"
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                        <h3>세 번째 슬라이드</h3>
                        <p>자동으로 넘어가는 슬라이드입니다.</p>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/src/assets/bannerImage/banner-4.png"
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                        <h3>세 번째 슬라이드</h3>
                        <p>자동으로 넘어가는 슬라이드입니다.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </>
    )
}

export default Home