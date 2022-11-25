import { useState } from 'react';
import { motion } from 'framer-motion';
export default function NewsItem({
  title,
  url,
  urlToImage,
  description,
  publishedAt,
  index,
}) {
  const [showText, setShowText] = useState(false);

  return (
    <motion.article
      className="news-item"
      initial={{ x: '100vh' }}
      animate={{
        opacity: [0, 0.5, 1],
        x: [100, 0, 0],
      }}
      transition={{
        type: 'twin',
        duration: 0.5,
        delay: parseInt(index) * 0.14,
      }}
    >
      <h3 className="news-item__title">
        <a href={url}>{title}</a>
      </h3>
      <button onClick={() => setShowText(!showText)}>
        {showText ? 'Weniger anzeigen' : 'Mehr anzeigen'}
      </button>
      {showText && (
        <div className="news-item__content">
          <img className="news-item__image" src={urlToImage} alt={title} />
          <p className="news-item__description">{description}</p>
          <span>{new Date(publishedAt).toLocaleString()}</span>
        </div>
      )}
    </motion.article>
  );
}

/*
Mit Hilfe des useToggle-Hooks, den wir in der
Custom Hooks-Übung geschrieben haben, soll der Content-Bereich
ein- und ausgeblendet werden, der Text im Button soll entsprechend
wechseln. Anfangs soll der Content eingeklappt sein.
Das Bild nur anzeigen, wenn eine Bildquelle vorhanden
ist. Das alt-Attribut kann leer bleiben, weil es im Datensatz leider
nicht enthalten ist.
 
  <article className="news-item">
<h3 className="news-item__title">
  <a href="">Titel</a>
</h3>
<button>
 Weniger anzeigen / Mehr anzeigen
</button>
<div className="news-item__content">
<img className="news-item__image" src="" alt="" />
<p className="news-item__description">Nachrichtentext</p>
</div>
</article> */
