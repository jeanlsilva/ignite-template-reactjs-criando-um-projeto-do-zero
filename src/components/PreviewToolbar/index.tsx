import { useEffect, useRef } from 'react';

export const PreviewToolbar = (): JSX.Element => {
  const toolbar = useRef<HTMLScriptElement>();

  useEffect(() => {
    // const script = document.createElement('script');
    // script.async = true;
    // script.defer = true;
    // script.src =
    //   'https://static.cdn.prismic.io/prismic.js?new=true&repo=bobbalous';
    // toolbar.current.appendChild(script);
    toolbar.current.setAttribute('async', 'true');
    toolbar.current.setAttribute('defer', 'true');
    toolbar.current.src =
      'https://static.cdn.prismic.io/prismic.js?new=true&repo=bobbalous';
  }, []);

  return <script ref={toolbar} />;
};
