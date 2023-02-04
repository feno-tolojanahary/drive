import React, { useState   } from "react";
import ImageViewer from "react-simple-image-viewer";

type Props = {
    images: string[],
    defaultIndex: number,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ImageView (props: Props) {
  const { 
    images, 
    defaultIndex, 
    isOpen, 
    setIsOpen 
  } = props;

  const [currentImage, setCurrentImage] = useState<number>(defaultIndex);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsOpen(false);
  };

  return (
    <div>
      {isOpen && (
        <ImageViewer
          src={images}
          currentIndex={currentImage}
          onClose={closeImageViewer}
          disableScroll={false}
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0.9)"
          }}
          closeOnClickOutside={true}
        />
      )}
    </div>
  );
}