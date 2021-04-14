import { useEffect, useRef } from 'react';

export const Comments = (): JSX.Element => {
  const commentBox = useRef<HTMLDivElement>();

  useEffect(() => {
    const script = document.createElement('script');

    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', 'true');
    script.setAttribute(
      'repo',
      'jeanlsilva/ignite-template-reactjs-criando-um-projeto-do-zero'
    );
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', 'github-dark');
    commentBox.current?.appendChild(script);
  }, []);

  return <div ref={commentBox} />;
};
