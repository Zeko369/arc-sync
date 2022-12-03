import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";

const server = fastify().withTypeProvider<TypeBoxTypeProvider>();
const prisma = new PrismaClient();

server.get("/", (request, reply) => {
  reply.send("Hello there!");
});

server.get("/users", (req, reply) => prisma.user.findMany());
server.post(
  "/users",
  { schema: { body: Type.Object({ email: Type.String() }) } },
  async (req, reply) => {
    const user = await prisma.user.create({ data: { email: req.body.email } });
    return user;
  }
);

server.post(
  "/data/:id",
  {
    schema: {
      body: Type.Object({ data: Type.String() }),
      params: Type.Object({ id: Type.String() }),
    },
  },
  (req, reply) => {
    return prisma.sync.create({
      data: {
        data: req.body.data,
        user: {
          connect: {
            id: req.params.id,
          },
        },
      },
    });
  }
);

server.get(
  "/data/:id",
  { schema: { params: Type.Object({ id: Type.String() }) } },
  (req, reply) => {
    return prisma.sync.findFirst({
      where: { userId: req.params.id },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
);

(async () => {
  try {
    const addr = await server.listen({ port: 3000 });
    console.log(`Server listening on ${addr}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
