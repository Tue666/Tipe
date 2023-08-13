import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/logo.png" />
          {/* Style */}
          {/* Bootstrap Icons */}
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.0/font/bootstrap-icons.css"
          />
          {/* Google Font */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
