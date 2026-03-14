const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Update datasource
schema = schema.replace(
  /datasource db \{[\s\S]*?\}/,
  `datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
  schemas   = ["public", "auth"]
}`
);

// 2. Update generator
schema = schema.replace(
  /generator client \{[\s\S]*?\}/,
  `generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["multiSchema"]
  engineType      = "library"
}`
);

// 3. Add @@schema("public") to all models
schema = schema.replace(/model (\w+) \{([\s\S]*?)\}/g, (match, name, content) => {
  if (content.includes('@@schema')) return match;
  return `model ${name} {${content}  @@schema("public")\n}`;
});

// 4. Add @@schema("public") to all enums
schema = schema.replace(/enum (\w+) \{([\s\S]*?)\}/g, (match, name, content) => {
  if (content.includes('@@schema')) return match;
  return `enum ${name} {${content}  @@schema("public")\n}`;
});

// 5. Add auth.users model
if (!schema.includes('model User')) {
  schema += `
model User {
  id    String @id @default(uuid())
  email String @unique

  @@map("users")
  @@schema("auth")
}
`;
}

fs.writeFileSync(schemaPath, schema);
console.log('Successfully updated schema.prisma with multiSchema support');
