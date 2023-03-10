const getData = (res) => res.data;

class TestError extends Error {
  constructor(message: string) {
    super(message);
  }
  status: string;
  data: string;
}
const handleRequestFailure = ({ response: { status, data } }) => {
  const error = new TestError(`${status}: ${JSON.stringify(data)}`);
  // remove parts of the stack trace so the error message (codeframe) shows up
  // at the code where the actual problem is.
  error.stack = error.stack
    .split("\n")
    .filter(
      (line) =>
        !line.includes("at handleRequestFailure") &&
        !line.includes("at processTicksAndRejections"),
    )
    .join("\n");
  error.status = status;
  error.data = data;
  return Promise.reject(error);
};

const resolve = (e) => e;

export { getData, handleRequestFailure, resolve };
