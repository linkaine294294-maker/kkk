import React, { useState } from 'react';
import { ImageOff, Sparkles } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  author?: string;
  license?: string;
  showCredit?: boolean;
  aspectRatioClass?: string;
  titleOverlay?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = '北歐風景',
  className = '',
  fallbackSrc = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Stortorget_2006.jpg/1280px-Stortorget_2006.jpg',
  author,
  license,
  showCredit = false,
  aspectRatioClass = 'aspect-video',
  titleOverlay,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleError = () => {
    if (!useFallback && fallbackSrc && src !== fallbackSrc) {
      setUseFallback(true);
    } else {
      setHasError(true);
    }
  };

  const imageSrc = useFallback ? fallbackSrc : (src || fallbackSrc);

  return (
    <div className={`relative overflow-hidden group select-none ${aspectRatioClass} bg-slate-900`}>
      {!hasError ? (
        <>
          <img
            src={imageSrc}
            alt={alt}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={handleError}
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ${
              loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } ${className}`}
            {...props}
          />
          {!loaded && (
            <div className="absolute inset-0 bg-slate-800/80 animate-pulse flex items-center justify-center">
              <span className="text-xs text-slate-400 font-sans tracking-wide">載入影像中...</span>
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 text-slate-300 border border-slate-800/50">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-slate-300 text-center max-w-[200px] line-clamp-2">
            {alt || '北歐冬日秘境'}
          </span>
          <span className="text-[10px] text-slate-500 mt-1 font-mono tracking-wider">
            NORDIC WINTER SCENE
          </span>
        </div>
      )}

      {/* Optional Title Overlay */}
      {titleOverlay && (
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent">
          <p className="text-sm font-semibold text-white drop-shadow-md">{titleOverlay}</p>
        </div>
      )}

      {/* Author and License Tag */}
      {showCredit && (author || license) && (
        <div className="absolute bottom-1 right-2 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] bg-slate-950/80 text-slate-300 px-1.5 py-0.5 rounded backdrop-blur-xs font-sans">
            📷 {author} {license ? `(${license})` : ''}
          </span>
        </div>
      )}
    </div>
  );
};
