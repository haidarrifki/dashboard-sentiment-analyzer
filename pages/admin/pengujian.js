import React from 'react';

// reactstrap components
import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Col,
  CardTitle,
  CardBody,
} from 'reactstrap';
// layout for this page
import Admin from 'layouts/Admin.js';
// core components
import Header from 'components/Headers/HeaderTable.js';

import fetchJson from '../../lib/fetchJson';

const Pengujian = (props) => {
  console.log('>>> Data');
  console.log(props.data);
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Data Pengujian</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Akurasi</th>
                    <th scope="col">Jumlah Data Uji</th>
                    <th scope="col">Data Terklasifikasi Benar</th>
                    <th scope="col">Data Terklasifikasi Salah</th>
                    <th scope="col">Perbandingan Data</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{props.data.acc}</td>
                    <td>1000</td>
                    <td>
                      {props.data.true_positive + props.data.true_negative}
                    </td>
                    <td>
                      {props.data.false_positive + props.data.false_negative}
                    </td>
                    <td>90:10</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
        <br />
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Confusion Matrix</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Predicted</th>
                    <th scope="col" className="bg-danger text-white">
                      Negatif
                    </th>
                    <th scope="col" className="bg-success text-white">
                      Positif
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="col" className="text-light" colSpan={3}>
                      Actual
                    </th>
                  </tr>
                  <tr>
                    <th scope="col" className="bg-danger text-white">
                      NEGATIF
                    </th>
                    <td>{props.data.true_positive}</td>
                    <td>{props.data.false_positive}</td>
                  </tr>
                  <tr>
                    <th scope="col" className="bg-success text-white">
                      POSITIF
                    </th>
                    <td>{props.data.false_negative}</td>
                    <td>{props.data.true_negative}</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

Pengujian.layout = Admin;

export async function getServerSideProps() {
  const data = await fetchJson(
    `http://localhost:3000/api/classifications/results`
  );
  return {
    props: { data }, // will be passed to the page component as props
  };
}

export default Pengujian;
