import 'dotenv/config'

import { getPrismaClient } from '../src/lib/db/prisma'
import { hashPassword } from '../src/lib/auth/password'

const prisma = getPrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD?.trim()
  const adminName = process.env.ADMIN_NAME?.trim() || 'Administrador'

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL e ADMIN_PASSWORD são obrigatórios para rodar o seed.')
  }

  const passwordHash = await hashPassword(adminPassword)

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash,
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
