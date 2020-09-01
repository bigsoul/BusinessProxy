const port = window.location.port;

let homepage: string;
let service: string;

// три набора конфигурации, идентифицируются по номеру прота

if (port === "3000") {
  // для лакальной разработки
  homepage = "";
  service = "http://10.10.10.10:8888/your-dev-base-name";
} else if (port === "8085") {
  // для продакшен версии
  homepage = "/business-proxy";
  service = "http://10.10.10.10:7777/your-prod-base-name";
} else if (port === "8888" || port === "9999") {
  // для сервера разработки и тестирования
  homepage = "/business-proxy";
  service = "http://10.10.10.10:" + port + "/your-dev-base-name";
} else {
  throw Error("Задана не верная конфигурация приложения.");
}

const config = {
  homepage: homepage,
  serviceUrl: service + "/hs/BusinessProxy/",
  serviceLogin: "your-login",
  servicePassword: "your-password",
};

export default config;
