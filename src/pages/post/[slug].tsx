import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  return (
    <>
      <Header />
      <div className={styles.banner}>
        <img src={post.data.banner.url} alt="Post" />
      </div>
      <main className={styles.container}>
        <h1 className={styles.title}>{post.data.title}</h1>
        <div className={styles.info}>
          <div>
            <FiCalendar size={20} color="#D7D7D7" />
            <span>{post.first_publication_date}</span>
          </div>
          <div>
            <FiUser size={20} color="#D7D7D7" />
            <span>{post.data.author}</span>
          </div>
        </div>
        {/* <span>* editado em {post.first_publication_date}</span> */}
        {post.data.content.map(content => (
          <div key={post.data.title} className={styles.content}>
            <h2 className={styles.heading}>{content.heading}</h2>
            {content.body.map(body => (
              <p>{RichText.asHtml(body.text)}</p>
            ))}
          </div>
        ))}
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.uid', 'post.content'],
      pageSize: 2,
    }
  );

  return {
    paths: posts.results.map(post => `/post/${post.uid}`),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'dd MMM uuuu',
      { locale: ptBR }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
  };
};
