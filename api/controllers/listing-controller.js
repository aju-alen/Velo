import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const postListing = async (req, res, next) => {
    try {
        const {listingTitle, listingDescription, listingPrice, listingCategoryId,agentId} = req.body;
        const listing = await prisma.listing.create({
            data: {
                title: listingTitle,
                description: listingDescription,
                price: listingPrice,
                categoryId: listingCategoryId,
                agentId: agentId
            }
        });
        await prisma.$disconnect();
        res.status(201).send('Listing created successfully');
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

export const getListingByCategory = async (req, res, next) => {
    try {
      console.log(req.params, 'req.params');
      const categoryId = req.params.categoryId;
      if (categoryId ) {
        console.log(true);
        
      }
      else {
        console.log(false);
      }
  
      // Define where clause based on categoryId existence
      const whereClause = categoryId !== 'undefined' ? {
        categoryId: categoryId
      } : {};
  
      const listings = await prisma.listing.findMany({
        where: whereClause,
      });
  
      res.status(200).json({
        message: 'Listings fetched successfully',
        listingData: listings
      });
    } catch (err) {
      console.log(err);
      next(err); // Pass the error to the next middleware (error handler)
    }
  };


