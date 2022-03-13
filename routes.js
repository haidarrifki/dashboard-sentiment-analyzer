var routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'ni ni-tv-2 text-primary',
    layout: '/admin',
  },
  {
    path: '/datasets?page=1&size=10',
    name: 'Dataset',
    icon: 'ni ni-folder-17 text-blue',
    layout: '/admin',
  },
  {
    path: '/text-processing?page=1&size=10',
    name: 'Text Processing',
    icon: 'ni ni-single-copy-04 text-orange',
    layout: '/admin',
  },
  {
    path: '/pembobotan?page=1&size=10',
    name: 'Pembobotan & Seleksi Fitur',
    icon: 'ni ni-chart-bar-32 text-green',
    layout: '/admin',
  },
  {
    path: '/klasifikasi?page=1&size=10',
    name: 'Klasifikasi',
    icon: 'ni ni-tag text-yellow',
    layout: '/admin',
  },
  {
    path: '/pengujian',
    name: 'Pengujian',
    icon: 'ni ni-atom text-red',
    layout: '/admin',
  },
];
export default routes;
