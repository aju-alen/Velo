import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
dotenv.config();
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const getSingleOrganisationData = async (req, res, next) => {
  try {
    const agentId = req.params.agentId;
    const organisationData = await prisma.organisation.findUnique({
      where: {
        organisationLeaderAgentId: agentId
      },
      select: {
        id: true,
        organisationName: true,
        organisationAddress: true,
        organisationWebsiteUrl: true,
        modeOfWork: true,
        superAdminApproval: true,
        organisationEmployeesCount: true,
        agents: true, // Include all agents associated with this organisation
      },
    });

    res.status(200).json(organisationData);
  }
  catch (err) {
    console.log(err);
    next(err);
  }
}

export const signupSubAgent = async (req, res, next) => {
  const { name,
    email,
    password,
    mobileCode,
    mobileNumber,
    orgId } = req.body;
    console.log(orgId,'--------_________________-------orgId');
    
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const agentData = await prisma.agent.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "SUB_AGENT",
        mobileCode,
        mobileNumber,
        firstTimeLogin: true,
        registerVerificationStatus: "LOGGED_IN",
        mobileCountry: "AE",
        organisationId:orgId,
        isOrganisationLeader: false,
      }
    })
    res.status(200).json({message:"Successfully created",agentData});
  }
  catch (err) {
    console.log(err);
    next(err);
  }
}

export const updatePricing = async (req, res, next) => {
  const {
    documentPricePerPiece,
    packagePricePerKg,
    packagePricePerPiece,
    shipmentTimeline,
  } =req.body;
  console.log(req.body,'-------------------save pricing');
  
  try{
   const updatePricing = await prisma.organisation.update({
      where:{
        organisationLeaderAgentId: req.verifyUserId,
      },
      data:{
        documentPricePerPiece: Number(documentPricePerPiece),
        packagePricePerKg: Number(packagePricePerKg),
        packagePricePerPiece: Number(packagePricePerPiece),
        deliveryTimeline : Number(shipmentTimeline),
      }
    });
    await prisma.$disconnect();
    res.status(200).json({message:"Pricing updated successfully"});
  }
  catch (err) {
    console.log(err);
    next(err);
  }
}

export const getPricingData = async (req, res, next) => {
  try{
    const pricingData = await prisma.organisation.findUnique({
      where:{
        organisationLeaderAgentId: req.verifyUserId
      },
      select:{
        documentPricePerPiece: true,
        packagePricePerKg: true,
        packagePricePerPiece: true,
        deliveryTimeline: true,
      }
    });
    await prisma.$disconnect();
    res.status(200).json(pricingData);
  }
  catch (err) {
    console.log(err);
    next(err);
  }
}

export const getAllOrganisationData = async (req, res, next) => {
  try{
    const allOrganisationData = await prisma.organisation.findMany();
    await prisma.$disconnect();
    res.status(200).json(allOrganisationData)
  }
  catch (err) {
    console.log(err);
    next(err);
  }
}


