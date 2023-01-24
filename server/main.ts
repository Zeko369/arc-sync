import fastify, { FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

const server = fastify().withTypeProvider<TypeBoxTypeProvider>();
const prisma = new PrismaClient();

server.get("/", (request, reply) => {
  reply.send("Hello there!");
});

server.post(
  "/login",
  { schema: { body: Type.Object({ email: Type.String(), password: Type.String() }) } },
  async (request, reply) => {
    const user = await prisma.user.findUnique({ where: { email: request.body.email } });
    if (!user) {
      return reply.code(401).send("User not found");
    }

    if (await compare(request.body.password, user?.hashedPassword)) {
      return reply.code(401).send("Invalid password");
    }

    return sign({ id: user.id }, process.env["SECRET"]!);
  }
);

const validateUser = (request: FastifyRequest) => {
  const token = request.headers?.authorization?.split(" ")?.[1];
  if (!token) {
    return [false, "Unauthorized"] as const;
  }

  try {
    const decoded = verify(token, process.env["SECRET"]!) as { id: string };
    // @ts-ignore
    if (decoded.id !== request.params.id) {
      return [false, "Wrong user"] as const;
    }
  } catch (err) {
    return [false, "Invalid token"] as const;
  }

  return [true, null] as const;
};

server.post(
  "/syncs/:id",
  { schema: { params: Type.Object({ id: Type.String() }) } },
  (request, reply) => {
    const [ok, error] = validateUser(request);
    if (!ok) {
      return reply.send(error);
    }

    return prisma.sync.create({
      data: {
        data: (request.body as any)["data"],
        user: {
          connect: {
            id: request.params.id,
          },
        },
      },
    });
  }
);

server.get(
  "/syncs/:id",
  { schema: { params: Type.Object({ id: Type.String() }) } },
  (request, reply) => {
    const [ok, error] = validateUser(request);
    if (!ok) {
      return reply.send(error);
    }

    return prisma.sync.findFirst({
      where: { userId: request.params.id },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
);

(async () => {
  let port = 3000;
  if (process.env["PORT"] && Number.isNaN(Number(process.env["PORT"]))) {
    port = Number(process.env["PORT"]);
  }

  try {
    const addr = await server.listen({ port, host: "0.0.0.0" });
    console.log(`Server listening on ${addr}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
