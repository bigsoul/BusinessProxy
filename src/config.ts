const port = window.location.port;

let company: string;
let homepage: string;
let service: string;
let serviceLogin: string;
let servicePassword: string;

// четыре набора конфигурации, идентифицируются по номеру прота

if (port === "3000") {
  // для лакальной разработки
  company = "КОМПАНИЯ";
  homepage = "";
  service = "http://185.26.205.42:8087/app";
  serviceLogin = "http";
  servicePassword = "httpPassword";
} else if (port === "8087") {
  // для демонстрационного сервера
  company = "КОМПАНИЯ";
  homepage = "/web";
  service = "http://185.26.205.42:8087/app";
  serviceLogin = "http";
  servicePassword = "httpPassword";
} else if (port === "") {
  // для сервера разработки и тестирования
  /* { заполните порт и параметры подключения } */
  company = "";
  homepage = "";
  service = "";
  serviceLogin = "";
  servicePassword = "";
} else if (port === "") {
  // для продакшен версии
  /* { заполните порт и параметры подключения } */
  company = "";
  homepage = "";
  service = "";
  serviceLogin = "";
  servicePassword = "";
} else {
  throw Error(`Задана не верная конфигурация приложения.
  Пожалуйста, настройте файл config.ts в корне проекта.
  Так же, убедитесь что значение параметра homepage в файле config.ts идентично значению параметра homepage в файле packege.json.`);
}

const config = {
  company: company,
  homepage: homepage,
  serviceUrl: service + "/hs/business-proxy/",
  serviceLogin: serviceLogin,
  servicePassword: servicePassword,
};

export default config;
