/**
 * idea:
 * all members have access to their conversation in server's channel,
 * but direct message doesn't.
 * so we also gonna check if DM with user X is ever exists before.
 */

import { db } from '@/lib/db'

// handle create / find (get)
export const generateConversation = async (memberOneId: string, memberTwoId: string) => {
  // check 2 ways
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) || (await findConversation(memberTwoId, memberOneId))

  // create if !conversation
  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId)
  }

  return conversation
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })
  } catch (error) {
    return null
  }
}

const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })
  } catch (error) {
    return null
  }
}
