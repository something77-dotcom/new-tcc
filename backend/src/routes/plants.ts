import { Router } from 'express'
import { PlantCategory, Season } from '@prisma/client'
import { prisma } from '../lib/prisma'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { search, category, season } = req.query

    const plants = await prisma.plant.findMany({
      where: {
        ...(search && {
          OR: [
            { name: { contains: String(search), mode: 'insensitive' } },
            { scientificName: { contains: String(search), mode: 'insensitive' } },
            { description: { contains: String(search), mode: 'insensitive' } },
          ],
        }),
        ...(category && { category: category as PlantCategory }),
        ...(season && { seasons: { has: season as Season } }),
      },
      orderBy: { name: 'asc' },
    })

    res.json(plants)
  } catch {
    res.status(500).json({ error: 'Erro ao buscar plantas' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const plant = await prisma.plant.findUnique({
      where: { id: req.params.id },
    })

    if (!plant) {
      return res.status(404).json({ error: 'Planta não encontrada' })
    }

    res.json(plant)
  } catch {
    res.status(500).json({ error: 'Erro ao buscar planta' })
  }
})

export default router
