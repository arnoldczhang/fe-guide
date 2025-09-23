const useFetch = (url, params = {}) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  let startTime = 0;
  const { delay = 1000, method = 'POST', body = '' } = params;

  const request = () => {
    if (Date.now() - startTime <= delay) return;
    startTime = Date.now();
    setLoading(true);
    fetch(url, {
      method,
      body,
    }).then((res) => {
      if (!res.ok) throw new Error('request failed');
      setResult(res.json());
      setError(null);
    }).catch((err) => {
      setResult(null);
      setError(err);
    }).finally(() => {
      setLoading(false);
    })
  };

  request();

  return {
    result,
    error,
    loading,
    retry: request,
  };
};

// test
const { result, error, retry } = useFetch('/api/login', {
  method: 'POST',
  body: JSON.stringify({
    username: 'admin',
    password: '123456',
  }),
});

if (!error) {
  console.log(result);
}

retry();
