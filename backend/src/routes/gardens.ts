import { Router } from 'express'
import { PlantStatus } from '@prisma/client'
import { prisma } from '../lib/prisma'

const router = Router()

const gardenInclude = {
  plants: {
    include: { plant: true },
    orderBy: { createdAt: 'desc' as const },
  },
}

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' })
    }

    const gardens = await prisma.garden.findMany({
      where: { userId: String(userId) },
      include: gardenInclude,
      orderBy: { createdAt: 'desc' },
    })

    res.json(gardens)
  } catch {
    res.status(500).json({ error: 'Erro ao buscar hortas' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const garden = await prisma.garden.findUnique({
      where: { id: req.params.id },
      include: gardenInclude,
    })

    if (!garden) {
      return res.status(404).json({ error: 'Horta não encontrada' })
    }

    res.json(garden)
  } catch {
    res.status(500).json({ error: 'Erro ao buscar horta' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, description, userId } = req.body

    if (!name || !userId) {
      return res.status(400).json({ error: 'name e userId são obrigatórios' })
    }

    const garden = await prisma.garden.create({
      data: { name, description, userId },
      include: gardenInclude,
    })

    res.status(201).json(garden)
  } catch {
    res.status(500).json({ error: 'Erro ao criar horta' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await prisma.garden.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Erro ao deletar horta' })
  }
})

router.post('/:id/plants', async (req, res) => {
  try {
    const { plantId, quantity = 1, notes } = req.body
    const gardenId = req.params.id

    if (!plantId) {
      return res.status(400).json({ error: 'plantId é obrigatório' })
    }

    const gardenPlant = await prisma.gardenPlant.create({
      data: { gardenId, plantId, quantity: Number(quantity), notes },
      include: { plant: true },
    })

    res.status(201).json(gardenPlant)
  } catch {
    res.status(500).json({ error: 'Erro ao adicionar planta à horta' })
  }
})

router.patch('/:id/plants/:gardenPlantId', async (req, res) => {
  try {
    const { status, notes } = req.body
    const { gardenPlantId } = req.params

    const data: Record<string, unknown> = {}
    if (status) data.status = status as PlantStatus
    if (notes !== undefined) data.notes = notes
    if (status === 'COLHIDA') data.harvestedAt = new Date()

    const gardenPlant = await prisma.gardenPlant.update({
      where: { id: gardenPlantId },
      data,
      include: { plant: true },
    })

    res.json(gardenPlant)
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar planta' })
  }
})

router.delete('/:id/plants/:gardenPlantId', async (req, res) => {
  try {
    await prisma.gardenPlant.delete({ where: { id: req.params.gardenPlantId } })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Erro ao remover planta da horta' })
  }
})

export default router
