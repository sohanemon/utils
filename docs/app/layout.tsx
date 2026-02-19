import { Banner } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Layout, Navbar } from 'nextra-theme-docs';
import 'nextra-theme-docs/style.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Utils Doc',
};

const banner = (
  <Banner storageKey="some-key">@sohanemon/utils 6.3.7 is released 🎉</Banner>
);
const navbar = <Navbar logo={<b>Utils</b>} />;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/sohanemon/utils/tree/main/docs"
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
