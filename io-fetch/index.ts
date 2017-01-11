import { IO, catchE, runIO, throwE, withEffectsP } from 'jabz/io';
import { fgo } from 'jabz/monad';
import 'isomorphic-fetch';

const testApiUrl = 'https://jsonplaceholder.typicode.com';

const fetchIO = withEffectsP(fetch);

const responseJson = withEffectsP((response: any) => response.json());

const fetchPostTitle = fgo(function*(postId) {
  const response = yield catchE(
    (err) => throwE(`Request failed: ${err}`),
    fetchIO(testApiUrl + '/posts/' + postId)
  );
  if (response.states === 404) {
    yield throwE('User does not exist');
  }
  const body: any = yield responseJson(response);
  if (body.title === undefined) {
    yield throwE('Post has no title');
  } else {
    return body.title;
  }
});

runIO(fetchPostTitle(1)).then(res => {
  console.log(res);
});