const port = window.location.port;

let homepage: string;
let service: string;

// три набора конфигурации, идентифицируются по номеру прота

if (port === "3000") {
  // для лакальной разработки
  homepage = "";
  service = "http://185.26.205.42:8086/do_demo";
} else if (port === "8085") {
  // для продакшен версии
  homepage = "/business_proxy";
  service = "http://185.26.205.42:8085/do";
} else if (port === "8086" || port === "8087") {
  // для сервера разработки и тестирования
  homepage = "/business_proxy";
  service = "http://185.26.205.42:" + port + "/do_demo";
} else {
  throw Error("Задана не верная конфигурация приложения.");
}

const config = {
  homepage: homepage,
  serviceUrl: service + "/hs/BusinessProxy/",
  serviceLogin: "exchange",
  servicePassword: "exchange2016",
};

export default config;
