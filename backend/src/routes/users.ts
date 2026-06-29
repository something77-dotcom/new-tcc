import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body

    if (!name || !email) {
      return res.status(400).json({ error: 'name e email são obrigatórios' })
    }

    let user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      user = await prisma.user.create({ data: { name, email } })
    }

    res.json(user)
  } catch {
    res.status(500).json({ error: 'Erro ao criar/buscar usuário' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { gardens: true } } },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    res.json(user)
  } catch {
    res.status(500).json({ error: 'Erro ao buscar usuário' })
  }
})

export default router
