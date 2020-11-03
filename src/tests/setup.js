const suppressConsoleMessage = (method, message) => {
  // eslint-disable-next-line no-console
  const nativeConsoleMethod = console[method];
  // eslint-disable-next-line no-console
  console[method] = (nativeMessage) => {
    if (!RegExp(message, 'gi').test(nativeMessage)) {
      nativeConsoleMethod(nativeMessage);
    }
  };
};

suppressConsoleMessage('error', 'useLayoutEffect does nothing on the server');

const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });
