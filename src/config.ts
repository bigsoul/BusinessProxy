const origin = window.location.origin;
const homepage = "/business_proxy";

const config = {
  root: origin + homepage,
  origin: origin,
  homepage: homepage,
  serviceUrl: "http://185.26.205.42:8086/do_demo/hs/BusinessProxy/",
  serviceLogin: "exchange",
  servicePassword: "exchange2016",
};

export default config;
