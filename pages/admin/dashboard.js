import React from 'react';
// node.js library that concatenates classes (strings)
import classnames from 'classnames';
// javascipt plugin for creating charts
import Chart from 'chart.js';
// react plugin used to create charts
import { Line, Bar } from 'react-chartjs-2';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from 'reactstrap';
// layout for this page
import Admin from 'layouts/Admin.js';
// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from 'variables/charts.js';

import Header from 'components/Headers/Header.js';

import fetchJson from '../../lib/fetchJson';

const Dashboard = (props) => {
  const [activeNav, setActiveNav] = React.useState(1);
  const [chartExample1Data, setChartExample1Data] = React.useState('data1');

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data('data' + index);
  };
  return (
    <>
      <Header data={props.statistic} />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Petunjuk Penggunaan</h3>
              </CardHeader>
              <CardBody>
                <ol>
                  <li>
                    Menyiapkan dataset berupa text dan sentimen dari text
                    tersebut bersifat positif atau negatif, kemudian menyimpan
                    data tersebut ke dalam file excel dengan row berjudul text
                    dan sentimen.
                  </li>
                  <li>
                    Import file excel yang berisi dataset tersebut pada halaman
                    dataset.
                  </li>
                  <li>
                    Selanjutnya proses text processing untuk menghilangkan
                    elemen yang tidak diperlukan pada teks dataset, tekan tombol
                    text processing kemudian data yang ada di database akan
                    dilakukan processing text.
                  </li>
                  <li>
                    Kemudian masuk ke halaman klasifikasi untuk menampilkan
                    hasil klasifikasi.
                  </li>
                  <li>
                    Lalu masuk ke halaman pengujian untuk melakukan uji akurasi
                    dengan menggunakan confusion matrix berdasarkan data uji
                    validasi.
                  </li>
                </ol>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

Dashboard.layout = Admin;

export async function getServerSideProps() {
  const statistic = await fetchJson(`${process.env.BASE_URL}/api/statistics`);
  return {
    props: { statistic }, // will be passed to the page component as props
  };
}

export default Dashboard;
