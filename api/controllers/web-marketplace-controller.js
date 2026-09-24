import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const publicListingSelect = {
  id: true,
  title: true,
  description: true,
  price: true,
  condition: true,
  imageUrl: true,
  createdAt: true,
  categoryId: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const getWebMarketplaceCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
      },
    });

    res.status(200).json({ categories });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getWebMarketplaceListings = async (req, res, next) => {
  try {
    const categoryId = String(req.query.categoryId || '').trim();
    const listings = await prisma.listing.findMany({
      where: categoryId ? { categoryId } : {},
      orderBy: { createdAt: 'desc' },
      select: publicListingSelect,
    });

    res.status(200).json({
      message: 'Listings fetched successfully',
      listingData: listings,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
