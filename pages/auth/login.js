import React from 'react';
import Router from 'next/router';
import { useSnackbar } from 'notistack';
import useUser from '../../lib/useUser';
import fetchJson from '../../lib/fetchJson';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from 'reactstrap';

// layout for this page
import Auth from 'layouts/Auth.js';

function Login() {
  const { enqueueSnackbar } = useSnackbar();
  // here we just check if user is already logged in and redirect to profile
  const { mutateUser } = useUser({
    redirectTo: '/admin/dashboard',
    redirectIfFound: true,
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    const body = { username, password };

    try {
      mutateUser(
        await fetchJson('/api/users/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      );

      enqueueSnackbar(`Welcome, ${username} have a nice day!`, {
        variant: 'success',
      });
    } catch (error) {
      console.error('An unexpected error happened:', error);
      enqueueSnackbar('Nama pengguna atau kata sandi salah', {
        variant: 'error',
      });
    }
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Form Login</small>
            </div>
            <Form onSubmit={onSubmit} role="form" method="POST">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-single-02" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="username"
                    placeholder="Nama Pengguna"
                    type="text"
                    autoComplete="new-email"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="password"
                    placeholder="Kata Sandi"
                    type="password"
                    autoComplete="new-password"
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Masuk
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}

Login.layout = Auth;

export default Login;
