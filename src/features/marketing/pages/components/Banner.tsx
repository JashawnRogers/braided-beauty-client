import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AutoScroll from "embla-carousel-auto-scroll";

import featuredPic1 from "@/assets/featured-work/featured-pic1.webp";
import featuredPic2 from "@/assets/featured-work/featured-pic2.webp";
import featuredPic3 from "@/assets/featured-work/featured-pic3.webp";
import featuredPic4 from "@/assets/featured-work/featured-pic4.webp";
import featuredPic5 from "@/assets/featured-work/featured-pic5.webp";

function Banner() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    const updateCarouselState = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
      setTotalItems(carouselApi.scrollSnapList().length);
    };

    updateCarouselState();
    carouselApi.on("select", updateCarouselState);

    return () => {
      carouselApi.off("select", updateCarouselState);
    };
  }, [carouselApi]);

  const scrollToIndex = (index: number) => {
    carouselApi?.scrollTo(index);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto px-5 lg:mt-3">
      <Carousel
        setApi={setCarouselApi}
        opts={{ loop: true }}
        plugins={[
          AutoScroll({
            startDelay: 2000,
          }),
        ]}
        className="w-full max-w-7xl max-h-[600px] z-10"
      >
        <CarouselContent>
          {[
            featuredPic1,
            featuredPic2,
            featuredPic3,
            featuredPic4,
            featuredPic5,
          ].map((src, index) => (
            <CarouselItem key={index} className="relative w-full h-[600px]">
              <Card className="w-full h-full overflow-hidden">
                <CardContent className="relative w-full h-full p-0">
                  <img
                    src={src}
                    loading="lazy"
                    alt={`Banner ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Arrows */}
      <div className="absolute top-1/2 left-0 right-0 z-20 flex items-center justify-between px-3 pointer-events-none -translate-y-1/2">
        <Button
          onClick={() => scrollToIndex(currentIndex - 1)}
          className="pointer-events-auto rounded-full w-32 h-32 p-0 bg-transparent shadow-none hover:bg-transparent"
        >
          <ChevronLeft className="size-32" strokeWidth={0.5} />
        </Button>
        <Button
          onClick={() => scrollToIndex(currentIndex + 1)}
          className="pointer-events-auto rounded-full w-32 h-32 p-0 bg-transparent shadow-none hover:bg-transparent"
        >
          <ChevronRight className="size-32" strokeWidth={0.5} />
        </Button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {Array.from({ length: totalItems }).map((_, index) => (
          <button
            type="button"
            title="Dot navigation buttons"
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Banner;
