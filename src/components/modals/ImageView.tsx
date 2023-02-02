import React, { useState, useCallback } from "react";
import ImageViewer from "react-simple-image-viewer";
import { DocumentRow } from "../../../server/src/common/interfaces/document";

type Props = {
    images: string[],
    defaultIndex: number
}

export default function ImageView (props: Props) {
  const { images, defaultIndex } = props;

  const [currentImage, setCurrentImage] = useState<number>(defaultIndex);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(true);

  const openImageViewer = useCallback((index: number) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <div>
      {isViewerOpen && (
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