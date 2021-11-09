import React, { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { useSnackbar } from 'notistack';
import useUser from '../../lib/useUser';
import fetchJson from '../../lib/fetchJson';

// reactstrap components
import {
  Alert,
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
  Table,
} from 'reactstrap';

// layout for this page
import Auth from 'layouts/Classification.js';

function Klasifikasi() {
  const [result, setResult] = useState(true);
  const [resultColor, setResultColor] = useState('dark');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (event) => {
    event.preventDefault();

    const text = event.target.text.value;

    enqueueSnackbar('Teks sedang diproses.', {
      variant: 'info',
    });

    setIsLoading(true);

    const response = await fetchJson('/api/classifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (response.classifyResult === 'positive') {
      setResultColor('success');
    } else {
      setResultColor('danger');
    }

    setResponse(response);
    setResult(true);

    enqueueSnackbar('Teks berhasil diproses', {
      variant: 'success',
    });

    setIsLoading(false);
  };

  return (
    <>
      <Col lg="7" md="7">
        {response ? (
          <>
            <div>
              <Alert color={resultColor} isOpen={result}>
                <h1 className="alert-heading text-center">
                  Sentiment {response.classifyResult}
                </h1>
              </Alert>
            </div>
            <Table bordered>
              <thead className="thead-light">
                <tr>
                  <th>Label</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: '#fff' }}>
                {response.classification.map((data, index) => (
                  <tr key={index}>
                    {Object.values(data).map((val, index) => (
                      <td key={index}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        ) : null}
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            {/* <div className="text-center text-muted mb-4">
              <small>Form Teks</small>
            </div> */}
            <Form onSubmit={onSubmit} role="form" method="POST">
              <FormGroup>
                <label htmlFor="exampleFormControlTextarea1">
                  Masukkan Teks
                </label>
                <Input
                  name="text"
                  id="exampleFormControlTextarea1"
                  rows="4"
                  type="textarea"
                ></Input>
              </FormGroup>
              <div className="text-center">
                <Button
                  className="my-4"
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  Analisis
                </Button>
              </div>
              <div className="text-center">
                {/* <Button color="primary" type="submit">
                  Masuk Dashboard
                </Button> */}
                <Link href="/auth/login">
                  <a>Masuk Dashboard</a>
                </Link>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}

Klasifikasi.layout = Auth;

export default Klasifikasi;
