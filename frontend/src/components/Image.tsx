import { ImgHTMLAttributes, forwardRef } from 'react';

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, alt, width, height, fill, className, style, ...props }, ref) => {
    const imgStyle: React.CSSProperties = {
      ...style,
    };

    if (fill) {
      Object.assign(imgStyle, {
        position: 'absolute',
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        objectFit: 'cover',
      });
    } else {
      if (width) imgStyle.width = typeof width === 'number' ? `${width}px` : width;
      if (height) imgStyle.height = typeof height === 'number' ? `${height}px` : height;
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={className}
        style={imgStyle}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';

export default Image;
