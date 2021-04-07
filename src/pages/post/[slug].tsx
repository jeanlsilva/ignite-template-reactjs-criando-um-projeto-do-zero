import Head from 'next/head';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { useRouter } from 'next/router';
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
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }
  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling </title>
      </Head>
      <Header />
      <div className={styles.banner}>
        <img src={post.data.banner.url} alt="Post" />
      </div>
      <main className={commonStyles.container}>
        <h1 className={styles.title}>{post.data.title}</h1>
        <div className={styles.info}>
          <div>
            <FiCalendar size={20} color="#D7D7D7" />
            <span>
              {format(new Date(post.first_publication_date), 'dd MMM uuuu', {
                locale: ptBR,
              })}
            </span>
          </div>
          <div>
            <FiUser size={20} color="#D7D7D7" />
            <span>{post.data.author}</span>
          </div>
          <div>
            <FiClock size={20} color="#D7D7D7" />
            <span>
              {Math.ceil(
                post.data.content.reduce((totalContent, item) => {
                  return (
                    totalContent +
                    item.body.reduce((total, paragraph) => {
                      return total + paragraph.text.split(' ').length;
                    }, 0)
                  );
                }, 0) / 200
              )}{' '}
              min
            </span>
          </div>
        </div>
        {/* <span>* editado em {post.first_publication_date}</span> */}
        {post.data.content.map(content => (
          <div
            key={`${content.heading}, ${Date.now()}`}
            className={styles.content}
          >
            <h2 className={styles.heading}>{content.heading}</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: RichText.asHtml(content.body),
              }}
            />
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
      fetch: [
        'post.uid',
        'post.title',
        'post.subtitle',
        'post.author',
        'post.banner',
        'post.content',
      ],
      pageSize: 3,
    }
  );

  return {
    paths: posts.results.map(post => {
      return {
        params: { slug: post.uid },
      };
    }),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
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
