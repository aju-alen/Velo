import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const postListing = async (req, res, next) => {
  console.log(req.body, 'req.body');
  
    try {
        const {listingTitle, listingDescription, listingPrice, listingCategoryId,accountId} = req.body;
        const listing = await prisma.listing.create({
            data: {
                title: listingTitle,
                description: listingDescription,
                price: listingPrice,
                categoryId: listingCategoryId,
                agentId: accountId
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
        orderBy: {
          createdAt: 'desc',
        },
      });
      console.log(listings);
      
  
      res.status(200).json({
        message: 'Listings fetched successfully',
        listingData: listings
      });
    } catch (err) {
      console.log(err);
      next(err); // Pass the error to the next middleware (error handler)
    }
  };

  export const getSingleListing = async (req, res, next) => {
    try{
        const listingId = req.params.listingId;
        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId
            },
        });
        const similarListings = await prisma.listing.findMany({
            where: {
              categoryId: listing.categoryId,
              id: {
                not: listing.id, // Exclude the current listing
              },
            },
          });

        await prisma.$disconnect();
        res.status(200).json({
            message: 'Listing fetched successfully',
            listingData: listing,
            similarListings,
        });
        console.log(listing,'listing');
        

    }
    catch(err){
        console.log(err);
        next(err);
    }
  }


