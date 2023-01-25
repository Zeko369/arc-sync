import { z } from "https://deno.land/x/zod@v3.20.2/mod.ts";

export const baseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),

  parentID: z.string().nullable(),
  childrenIds: z.array(z.string().uuid()),
});

export type TabSchema = z.infer<typeof tabSchema>;
export const tabSchema = baseSchema.extend({
  data: z.object({
    tab: z.object({
      savedTitle: z.string(),
      savedURL: z.string(),
      customInfo: z
        .object({
          iconType: z.union([
            z.object({ icon: z.string() }),
            z.object({ emoji: z.number(), emoji_v2: z.string() }),
          ]),
        })
        .optional(),
    }),
  }),
});

export const listSchema = baseSchema.extend({
  data: z.object({
    list: z.object({}),
  }),
});

export const itemContainerSchema = baseSchema.extend({
  data: z.object({
    itemContainer: z.object({
      containerType: z.object({
        spaceItems: z.object({
          _0: z.string(),
        }),
      }),
    }),
  }),
});

export const easleSchema = baseSchema.extend({
  data: z.object({
    easel: z.object({
      easelID: z.string(),
      title: z.string(),
      shareStatus: z.enum(["readOnly"]),
      creatorID: z.string(),
    }),
  }),
});

export const splitViewSchema = baseSchema.extend({
  data: z.object({
    splitView: z.object({}),
  }),
});

export type ArcNode = z.infer<typeof arcNodeSchema>;
export const arcNodeSchema = z.union([
  tabSchema,
  listSchema,
  itemContainerSchema,
  easleSchema,
  splitViewSchema,
]);
