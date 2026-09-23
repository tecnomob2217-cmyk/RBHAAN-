import React from 'react';

/**
 * ErrorBoundary — يمنع انهيار التطبيق بالكامل إذا تعطل مكون
 * داخلي (مثل iframe شبكة العروض). يلتقط الخطأ ويعرض واجهة بديلة.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="p-4 text-center text-sm text-muted">
            حدث خطأ غير متوقع في عرض هذه الصفحة.
          </div>
        )
      );
    }
    return this.props.children;
  }
}
