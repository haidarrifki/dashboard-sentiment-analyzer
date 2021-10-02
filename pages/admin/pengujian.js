import React from 'react';

// reactstrap components
import { Card, CardHeader, Table, Container, Row } from 'reactstrap';
// layout for this page
import Admin from 'layouts/Admin.js';
// core components
import Header from 'components/Headers/Header.js';

import fetchJson from '../../lib/fetchJson';

const Pengujian = (props) => {
  return (
    <>
      <Header data={props.statistic} />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Confusion Matrix</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">&nbsp;</th>
                    <th scope="col">Predicted True</th>
                    <th scope="col">Predicted False</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="col">Actual True</th>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <th scope="col">Actual False</th>
                    <td></td>
                    <td></td>
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
  const statistic = await fetchJson(`http://localhost:3000/api/statistics`);
  return {
    props: { statistic }, // will be passed to the page component as props
  };
}

export default Pengujian;
