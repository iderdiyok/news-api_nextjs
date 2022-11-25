import Layout from '@/components/Layout';
import Image from 'next/image';
import { useRouter } from 'next/router';

const graphQlPath = 'https://react.webworker.berlin/graphql';

export async function getStaticPaths() {
  let paths = [];

  const query = `{
    posts {
      nodes {
        slug
      }
    }
  }`;
  try {
    const response = await fetch(`${graphQlPath}?query=${query}`);

    if (!response.ok) {
      throw new Error('Fehler beinm Laden');
    }

    const posts = await response.json();

    paths = posts.data.posts.nodes.map(({ slug }) => ({ params: { slug } }));
  } catch (error) {
    console.log(error);
  }

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  // eslint-disable-next-line prefer-const
  let post = {};

  try {
    const query = `
  {
	post(id: "${params.slug}", idType: SLUG) {
  	featuredImage {
    	node {
      	altText
      	guid
      	mediaDetails {
        	width
        	height
      	}
    	}
  	}
  	title
  	content
	}
  }
  `;

    const response = await fetch(`${graphQlPath}?query=${query}`);

    if (!response.ok) {
      throw new Error('Fehler beim Laden');
    }

    const postData = await response.json();

    post = postData.data.post;
  } catch (error) {
    console.log(error);
  }

  return { props: { post }, revalidate: 3600 };
}

export default function BlogPost({ post }) {
  // https://nextjs.org/docs/basic-features/data-fetching#fallback-pages
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Layout>
        <strong>Wird geladen...</strong>
      </Layout>
    );
  }
  return (
    <Layout title={post.title}>
      {post.featuredImage && (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image
          loader={() => post.featuredImage.node.guid}
          alt={post.featuredImage.node.altText}
          src={post.featuredImage.node.guid}
          width={post.featuredImage.node.mediaDetails.width}
          height={post.featuredImage.node.mediaDetails.height}
          sizes="(max-width: 52rem) 90vw, 48rem"
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
    </Layout>
  );
}

//VERSION 1.0

// const apiPath = 'https://react.webworker.berlin/wp-json/wp/v2/';

// /* Wenn man einen dynamischen Pfad hat, muss man Next mitteilen,
// welche Pfade das System statisch generieren soll, hier also
// eine Liste der vorhanden Blog-Slugs übergeben.
// https://nextjs.org/docs/basic-features/data-fetching/get-static-paths
// */

// export async function getStaticPaths() {
//   let paths = [];

//   try {
//     const response = await fetch(`${apiPath}posts`);

//     if (!response.ok) {
//       throw new Error('Fehler beinm Laden');
//     }

//     const posts = await response.json();

//     /*
//   	Der Schlüsselname "params" ist vorgegeben. Der Schlüsselname
//   	"slug" entspricht dem Platzhalter [slug] im Dateinamen von [slug].jsx
//   	Die Einträge im paths-Array werden an getStaticProps übergeben,
//   	so dass für jeden Eintrag eine Seite generiert werden kann.
//   	https://nextjs.org/docs/api-reference/data-fetching/get-static-paths
//   	*/
//     paths = posts.map(({ slug }) => ({ params: { slug } }));
//   } catch (error) {
//     console.log(error);
//   }

//   return { paths, fallback: false };
// }

// export async function getStaticProps({ params }) {
//   /*
//   Hier wieder in Try-Catch Daten holen, und zwar die Daten zu einem Blogbeitrag
//   mit Hilfe des Slugs, welcher in params.slug steckt.
//   Der URL-Parameter lautet ?slug=slug
//   Achtung: Es kommt trotzdem ein Array zurück, allerding einer mit
//   nur einem Eintrag.

//   */

//   let post = {};

//   try {
//     const response = await fetch(`${apiPath}posts/?slug=${params.slug}`);

//     if (!response.ok) {
//       throw new Error('Fehler beim Laden');
//     }

//     const posts = await response.json();

//     /*
//   	Der Schlüsselname "params" ist vorgegeben. Der Schlüsselname
//   	"slug" entspricht dem Platzhalter [slug] im Dateinamen von [slug].jsx
//   	Die Einträge im paths-Array werden an getStaticProps übergeben,
//   	so dass für jeden Eintrag eine Seite generiert werden kann.
//   	https://nextjs.org/docs/api-reference/data-fetching/get-static-paths
//   	*/
//     post = posts[0];
//     if (post.featured_media > 0) {
//       post.titleImage = await getTitleImage(post.featured_media);
//     }
//     // console.log(post);
//   } catch (error) {
//     console.log(error);
//   }

//   /* 1. Prüft, ob featured_media in post vorhanden ist.
// 2. Wenn ja, ruft mit der ID getTitleImage auf und speichert
// die Antwort unter post.titleImage
// */

//   return { props: { post }, revalidate: 3600 };
// }

// async function getTitleImage(imageId) {
//   try {
//     const response = await fetch(`${apiPath}media/${imageId}`);

//     if (!response.ok) {
//       throw new Error('Fehler beim laden');
//     }

//     const imageData = await response.json();

//     return {
//       src: imageData.guid.rendered,
//       width: imageData.media_details.width,
//       height: imageData.media_details.height,
//       alt: imageData.alt_text,
//     };
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
/*
1. Holt mit Hilfe der ID die Daten für das entsprechende Bild.
2. Gebt ein Objekt zurück, welches nur ausgesuchte Daten enthält:
{
  src: "",
  width: "",
  height: "",
  alt: ""
}
*/
// }
