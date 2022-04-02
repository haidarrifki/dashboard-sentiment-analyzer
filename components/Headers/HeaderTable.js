import React from 'react';
// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from 'reactstrap';

function Header({ data }) {
  const formatRupiah = (numb) => {
    const format = numb.toString().split('').reverse().join('');
    const convert = format.match(/\d{1,3}/g);
    const rupiah = convert.join('.').split('').reverse().join('');
    return rupiah;
  };
  return (
    <>
      <div className="header bg-gradient-dark pb-7 pt-5 pt-md-8">
      </div>
    </>
  );
}

export default Header;
