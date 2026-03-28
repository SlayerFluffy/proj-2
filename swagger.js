const fs = require("fs/promises");
const swaggerAutogen = require("swagger-autogen")();

const characterSchema = {
  charName: "Arannis",
  charRace: "Elf",
  charClass: "Ranger",
  charLevel: 5,
  charAlignment: "Neutral Good",
  charBackground: "Outlander",
  charAge: 120,
  charHeight: 72,
  charWeight: 160,
  charEyes: "Green",
  charSkin: "Fair",
  charBonds: "Protect my homeland",
  charFlaws: "Too trusting",
  charIdeals: "Freedom",
  charPersonalityTraits: "Calm under pressure",
  hp: 42,
  ac: 16,
  str: 14,
  dex: 17,
  con: 13,
  int: 12,
  wis: 15,
  cha: 10,
};

const userSchema = {
  firstName: "Drew",
  lastName: "Jezek",
  email: "drew@example.com",
  password: "StrongPassword123",
};

const requiredCharacterFields = [
  "charName",
  "charRace",
  "charClass",
  "charLevel",
  "charAlignment",
  "charBackground",
  "hp",
  "ac",
  "str",
  "dex",
  "con",
  "int",
  "wis",
  "cha",
];

const requiredUserFields = ["firstName", "lastName", "email", "password"];

const toSwaggerProperty = (value) => {
  if (Number.isInteger(value)) {
    return {
      type: "integer",
      format: "int32",
      example: value,
      default: value,
    };
  }

  if (typeof value === "number") {
    return {
      type: "number",
      example: value,
      default: value,
    };
  }

  if (typeof value === "boolean") {
    return {
      type: "boolean",
      example: value,
      default: value,
    };
  }

  return {
    type: "string",
    example: value,
    default: value,
  };
};

const buildRequestSchema = (examplePayload, requiredFields) => ({
  type: "object",
  required: requiredFields,
  properties: Object.fromEntries(
    Object.entries(examplePayload).map(([key, value]) => [
      key,
      toSwaggerProperty(value),
    ]),
  ),
  example: examplePayload,
});

const ensureOperation = (spec, path, method) => {
  spec.paths ??= {};
  spec.paths[path] ??= {};
  spec.paths[path][method] ??= { responses: {} };
  return spec.paths[path][method];
};

const addTag = (operation, tag) => {
  const tags = new Set(operation.tags || []);
  tags.add(tag);
  operation.tags = [...tags];
};

const upsertBodyParameter = (operation, examplePayload, requiredFields) => {
  const parameters = Array.isArray(operation.parameters)
    ? operation.parameters
    : [];
  const otherParameters = parameters.filter(
    (parameter) => parameter.in !== "body",
  );
  const schema = buildRequestSchema(examplePayload, requiredFields);

  operation.parameters = [
    ...otherParameters,
    {
      name: "body",
      in: "body",
      required: true,
      schema,
      "x-example": examplePayload,
    },
  ];
  operation.consumes = ["application/json"];
};

const enrichSwaggerSpec = async () => {
  const rawSpec = await fs.readFile(outputFile, "utf8");
  const spec = JSON.parse(rawSpec);

  [
    ["/characters/", "get", "Characters"],
    ["/characters/", "post", "Characters"],
    ["/characters/{id}", "get", "Characters"],
    ["/characters/{id}", "put", "Characters"],
    ["/characters/{id}", "delete", "Characters"],
    ["/users/", "get", "Users"],
    ["/users/", "post", "Users"],
    ["/users/{id}", "get", "Users"],
    ["/users/{id}", "put", "Users"],
    ["/users/{id}", "delete", "Users"],
  ].forEach(([path, method, tag]) => {
    const operation = ensureOperation(spec, path, method);
    addTag(operation, tag);
  });

  upsertBodyParameter(
    ensureOperation(spec, "/characters/", "post"),
    characterSchema,
    requiredCharacterFields,
  );
  upsertBodyParameter(
    ensureOperation(spec, "/characters/{id}", "put"),
    characterSchema,
    requiredCharacterFields,
  );
  upsertBodyParameter(
    ensureOperation(spec, "/users/", "post"),
    userSchema,
    requiredUserFields,
  );
  upsertBodyParameter(
    ensureOperation(spec, "/users/{id}", "put"),
    userSchema,
    requiredUserFields,
  );

  await fs.writeFile(outputFile, JSON.stringify(spec, null, 2));
};

const doc = {
  info: {
    title: "DnD Characters API",
    description: "API for managing DnD Characters",
  },
  host: "localhost:3000",
  schemes: ["http", "https"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(async ({ success }) => {
  if (!success) {
    process.exitCode = 1;
    return;
  }

  await enrichSwaggerSpec();
});
