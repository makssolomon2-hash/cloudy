export function Icon({ name, size = 16, className = '' }) {
  const common = { stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }

  const icons = {
    cloud: (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M7 18H16.4A3.6 3.6 0 0 0 17 10.83 5.5 5.5 0 0 0 6.33 9.4 4 4 0 0 0 7 18Z" />
      </svg>
    ),
    chat: (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M6 18V7.5A2.5 2.5 0 0 1 8.5 5h7A2.5 2.5 0 0 1 18 7.5v6A2.5 2.5 0 0 1 15.5 16H9l-3 2Z" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M8.5 14a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M15.5 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path d="M4 18.5a4.5 4.5 0 0 1 9 0" />
        <path d="M13 18.5a4 4 0 0 1 7 0" />
      </svg>
    ),
    phone: (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M8 4.5h2.5l1.5 5-2 1.3a12.2 12.2 0 0 0 7.7 7.7l1.3-2 5 1.5V16a2 2 0 0 1-2 2A15.5 15.5 0 0 1 6 6.5a2 2 0 0 1 2-2Z" />
      </svg>
    ),
    contact: (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M7 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path d="M5 18.5a7 7 0 0 1 14 0" />
        <path d="M14.5 6.5c1.2.5 2.2 1.8 2.5 3.3" />
      </svg>
    ),
    bookmark: (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M7 5.5h10a1.5 1.5 0 0 1 1.5 1.5v12L12 17l-6.5 2V7A1.5 1.5 0 0 1 7 5.5Z" />
      </svg>
    ),
   
   gear: (
      <svg viewBox="0 0 24 24" {...common}>
        <path
          fillRule="evenodd"
          d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 5.99c-.52.15-1.014.36-1.474.62l-1.96-.8c-.87-.355-1.85.08-2.24.91l-1.25 2.65c-.39.83.08 1.82.91 2.24l1.96.8c-.02.26-.03.52-.03.79s.01.53.03.79l-1.96.8c-.83.42-1.3 1.41-.91 2.24l1.25 2.65c.39.83 1.37 1.265 2.24.91l1.96-.8c.46.26.954.47 1.474.62l.178 2.173c.151.904.933 1.567 1.85 1.567h2.844c.917 0 1.699-.663 1.85-1.567l.178-2.173c.52-.15 1.014-.36 1.474-.62l1.96.8c.87.355 1.85-.08 2.24-.91l1.25-2.65c.39-.83-.08-1.82-.91-2.24l-1.96-.8c.02-.26.03-.52.03-.79s-.01-.53-.03-.79l1.96-.8c.83-.42 1.3-1.41.91-2.24l-1.25-2.65c-.39-.83-1.37-1.265-2.24-.91l-1.96.8c-.46-.26-.954-.47-1.474-.62L15.772 3.817c-.151-.904-.933-1.567-1.85-1.567h-2.844ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
          clipRule="evenodd"
        />
      </svg>
    ),

    search: (
      <svg viewBox="0 0 24 24" {...common}>
        <circle cx="11" cy="11" r="5.5" />
        <path d="m16 16 4 4" />
      </svg>
    ),
    plus: (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
    more: (
      <svg viewBox="0 0 24 24" {...common}>
        <circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    ),
    send: (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M4 12.5 19 4l-3 15-5.5-5.5L4 12.5Z" />
        <path d="M11 13 19 4" />
      </svg>
    ),
    mic: (
      <svg viewBox="0 0 24 24" {...common}>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" />
      </svg>
    ),
    smile: (
      <svg viewBox="0 0 24 24" {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M8.5 14.5c1 1.5 2.1 2.3 3.5 2.3s2.5-.8 3.5-2.3" />
        <path d="M9 9.5h.01M15 9.5h.01" />
      </svg>
    ),
    bell: (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M15 17h5l-1.2-1.5A2.5 2.5 0 0 1 18 14V10a6 6 0 1 0-12 0v4a2.5 2.5 0 0 1-.8 1.5L4 17h5" />
        <path d="M10 20a2 2 0 0 0 4 0" />
      </svg>
    ),
    lock: (
      <svg viewBox="0 0 24 24" {...common}>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" />
      </svg>
    ),
    alert: (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M12 4.5 19 17a2 2 0 0 1-1.7 3H6.7A2 2 0 0 1 5 17l7-12.5Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ),
    photo: (
      <svg viewBox="0 0 24 24" {...common}>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <circle cx="9" cy="10" r="2" />
        <path d="m20 16-5-5-9 9" />
      </svg>
    ),
    video: (
      <svg viewBox="0 0 24 24" {...common}>
        <rect x="3.5" y="6" width="12.5" height="12" rx="2" />
        <path d="m16 10 4.5-2.5v9L16 14" />
      </svg>
    ),
    file: (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M7 3.5h6l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 6 20V5a1.5 1.5 0 0 1 1-1.5Z" />
        <path d="M13 3.5V8h4" />
      </svg>
    ),
    play: (
      <svg viewBox="0 0 24 24" {...common}><path d="m9 6 9 6-9 6V6Z" /></svg>
    ),
    pause: (
      <svg viewBox="0 0 24 24" {...common}><path d="M9 6v12M15 6v12" /></svg>
    ),
    logOut: (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10" />
        <path d="m14 8 4 4-4 4M18 12H9" />
      </svg>
    ),
    arrowLeft: (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M15 18 9 12l6-6" />
      </svg>
    ),
    arrowRight: (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="m9 18 6-6-6-6" />
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" {...common}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
    ),
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center align-middle [&>svg]:h-full [&>svg]:w-full ${className}`}
      style={{ width: size, height: size }}
    >
      {icons[name] || icons.chat}
    </span>
  )
}
