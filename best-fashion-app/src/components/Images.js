import { useEffect, useState } from 'react';
import { safeUrl } from '../product';

function Images({ data, alt }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [data]);
  const url = safeUrl(data);

  return (
    <div className="data-wrapper-img">
      {url && !failed
        ? <img src={url} alt={alt} loading="lazy" onError={() => setFailed(true)} />
        : <p className="image-placeholder">Image unavailable</p>}
    </div>
  );
}

export default Images;
