import { PropsWithChildren, ReactNode } from 'react';

function Layout({ children }: PropsWithChildren<ReactNode>) {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
}

export default Layout;
