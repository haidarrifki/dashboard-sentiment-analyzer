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
    path: '/text-processing',
    name: 'Text Processing',
    icon: 'ni ni-single-copy-04 text-orange',
    layout: '/admin',
  },
  {
    path: '/klasifikasi',
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
