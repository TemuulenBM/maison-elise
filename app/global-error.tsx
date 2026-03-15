"use client"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <head>
        <title>Error | Maison Élise</title>
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- global-error replaces root layout, font must be inline */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Montserrat:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F0F0F",
          color: "#FAFAF5",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.3em",
              color: "#C9A96E",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            Error
          </p>
          <h1
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "2.5rem",
              fontWeight: 300,
              marginBottom: "1rem",
            }}
          >
            Something Went Wrong
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#888",
              maxWidth: "400px",
              margin: "0 auto 3rem",
              lineHeight: 1.6,
            }}
          >
            We apologize for the inconvenience. Please try refreshing the page.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#C9A96E",
              backgroundColor: "transparent",
              border: "1px solid #C9A96E",
              padding: "12px 32px",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}
