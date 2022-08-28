import React, { Component } from 'react';
import Router from 'next/router';

export default function Index() {
  React.useEffect(() => {
    // Router.push('/klasifikasi');
    Router.push('/auth/login');
  });

  return <div />;
}
