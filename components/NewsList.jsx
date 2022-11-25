import NewsItem from './NewsItem';

export default function NewsList({ title, newsList }) {
  return (
    <section className="news-list">
      {/* Optionale h2 für title */}
      {title && <h2>{title}</h2>}
      {/* Für jeden Eintrag in news ein NewsItem */}
      {newsList.map((news, index) => (
        <NewsItem {...news} key={index} index={index} />
      ))}
    </section>
  );
}
