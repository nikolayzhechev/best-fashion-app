import Images from './Images';
import { safeUrl } from '../product';

function formatPrice(price, currency) {
  if (price === null || price === undefined || price === '' || !Number.isFinite(Number(price))) return null;
  try {
    return new Intl.NumberFormat(undefined, currency
      ? { style: 'currency', currency }
      : { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(price));
  } catch {
    return Number(price).toFixed(2);
  }
}

function Data({ data }) {
  const productUrl = safeUrl(data.itemUrl);
  const price = formatPrice(data.price, data.currency);
  const originalPrice = data.originalPrice > data.price && price ? formatPrice(data.originalPrice, data.currency) : null;
  const title = data.title || 'Untitled product';
  const updatedAt = data.lastSeenAt ? new Date(data.lastSeenAt) : null;
  const hasUpdateTime = updatedAt && Number.isFinite(updatedAt.getTime());

  return (
    <article className="data-wrapper">
      <Images data={data.img?.mainImageUrl} alt={title} />
      <div className="data-wrapper-content">
        <p className="product-source">{data.brand ? `${data.brand} · ` : ''}{data.site}</p>
        <h3>{productUrl ? <a href={productUrl} target="_blank" rel="noopener noreferrer">{title}</a> : title}</h3>
        {data.description && <p className="product-description">{data.description}</p>}
        <div className="product-prices">
          <p className="content-price">{price || 'See store for price'}</p>
          {originalPrice && <p className="content-old-price"><span className="visually-hidden">Original price: </span>{originalPrice}</p>}
        </div>
        {productUrl && <a className="store-link" href={productUrl} target="_blank" rel="noopener noreferrer">View at store <span aria-hidden="true">↗</span></a>}
        {hasUpdateTime && <p className="product-updated">Updated <time dateTime={updatedAt.toISOString()}>{updatedAt.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</time></p>}
      </div>
    </article>
  );
}

export default Data;
