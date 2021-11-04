import React from 'react';

export function withAnalyticsCategory(BaseComponent, analyticsCategory) {
  return function UpdatedSelectedFilter(props) {
    return <BaseComponent analyticsCategory={analyticsCategory} {...props} />;
  };
}
