export const metadata = {
  title: '学会抄録作成ツール',
  description: '医療職向け学会抄録サポートツール',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
