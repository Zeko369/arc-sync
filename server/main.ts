import fastify, { FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

const server = fastify().withTypeProvider<TypeBoxTypeProvider>();
const prisma = new PrismaClient();

server.get("/", (request, reply) => {
  reply.send("Hello there!");
});

server.post(
  "/auth/signup",
  {
    schema: {
      body: Type.Object({
        email: Type.String(),
        password: Type.String(),
      }),
    },
  },
  async (request, reply) => {
    const user = await prisma.user.findUnique({ where: { email: request.body.email } });
    if (user) {
      return reply.code(401).send("User already exists");
    }

    const hashedPassword = await hash(request.body.password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: request.body.email,
        hashedPassword,
      },
    });

    return sign({ id: newUser.id }, process.env["SECRET"]!);
  }
);

server.post(
  "/auth/login",
  { schema: { body: Type.Object({ email: Type.String(), password: Type.String() }) } },
  async (request, reply) => {
    const user = await prisma.user.findUnique({ where: { email: request.body.email } });
    if (!user) {
      return reply.code(401).send("User not found");
    }

    if (!(await compare(request.body.password, user.hashedPassword))) {
      return reply.code(401).send("Invalid password");
    }

    return { id: user.id, token: sign({ id: user.id }, process.env["SECRET"]!) };
  }
);

const validateUser = async (request: FastifyRequest) => {
  const token = request.headers?.authorization?.split(" ")?.[1];
  if (!token) {
    return [false, "Unauthorized"] as const;
  }

  try {
    const decoded = verify(token, process.env["SECRET"]!) as { id: string };
    if (!decoded.id) {
      return [false, "Invalid token"] as const;
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return [false, "User not found"] as const;
    }

    return [true, user] as const;
  } catch (err) {
    return [false, "Invalid token"] as const;
  }
};

server.post("/sync", async (request, reply) => {
  const [ok, data] = await validateUser(request);
  if (!ok) {
    return reply.send(data);
  }

  return prisma.sync.create({
    data: {
      data: (request.body as any)["data"],
      user: {
        connect: {
          id: data.id,
        },
      },
    },
  });
});

server.get("/sync", async (request, reply) => {
  const [ok, data] = await validateUser(request);
  if (!ok) {
    return reply.send(data);
  }

  return prisma.sync.findFirst({
    where: { userId: data.id },
    orderBy: {
      createdAt: "desc",
    },
  });
});

(async () => {
  let port = 3000;
  if (process.env["PORT"] && !Number.isNaN(Number(process.env["PORT"]))) {
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
