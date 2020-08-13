console.log("start ...");

const err0 = {
  response: {
    data: {
      errorText: "",
    },
  },
};

const err1 = {
  response: {
    data: {
      errorText: "test",
    },
  },
};

const err2 = {
  response: {
    data: {},
  },
};

const err3 = {
  response: {},
};

const text = err2?.response?.data?.errorText;

console.log("result: " + text);
console.log("result type: " + typeof text);
