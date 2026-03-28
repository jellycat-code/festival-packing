function ExternalLinkIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M5 1.5H2C1.72 1.5 1.5 1.72 1.5 2V11C1.5 11.28 1.72 11.5 2 11.5H11C11.28 11.5 11.5 11.28 11.5 11V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M7.5 1.5H11.5V5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.5 1.5L6 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

export default ExternalLinkIcon
