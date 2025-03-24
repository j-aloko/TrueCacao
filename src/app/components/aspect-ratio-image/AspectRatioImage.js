import React, { forwardRef, useMemo } from 'react';

import Box from '@mui/material/Box';
import Image from 'next/image';

const AspectRatioImage = forwardRef(
  (
    {
      src,
      alt = '',
      aspectRatio = '16/9',
      priority = false,
      quality = 75,
      objectFit = 'cover',
      sx = {},
      containerProps = {},
      className = '',
      ...imageProps
    },
    ref
  ) => {
    const calculatedRatio = useMemo(() => {
      if (typeof aspectRatio === 'number') return aspectRatio;
      if (aspectRatio.includes('/')) {
        const [width, height] = aspectRatio.split('/').map(Number);
        return width / height;
      }
      return 16 / 9;
    }, [aspectRatio]);

    return (
      <Box
        ref={ref}
        {...containerProps}
        className={`aspect-ratio-image-container ${className}`}
        sx={{
          '& > span': {
            height: '100% !important',
            width: '100% !important',
          },
          aspectRatio: calculatedRatio,
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          ...sx,
        }}
      >
        <Box
          sx={{
            height: '100%',
            left: 0,
            position: 'absolute',
            top: 0,
            width: '100%',
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            quality={quality}
            style={{
              height: '100%',
              objectFit,
              width: '100%',
              ...imageProps.style,
            }}
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            {...imageProps}
          />
        </Box>
      </Box>
    );
  }
);

AspectRatioImage.displayName = 'AspectRatioImage';

export default AspectRatioImage;
