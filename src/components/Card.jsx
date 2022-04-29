export default function Card({
  id,
  title,
  price,
  image,
  description,
  handleClick,
}) {
  return (
    <div className="card">
      <img src={image} alt={id} />
      <div className="card--content">
        <h2>{title}</h2>
        <p className="desciption">{description}</p>
        <button className="buy" onClick={handleClick}>
          {price} Avax
        </button>
      </div>
    </div>
  );
}
