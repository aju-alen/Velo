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
  } = req.body;
  console.log(req.body, '-------------------save pricing');

  try {
    await prisma.organisation.update({
      where: {
        organisationLeaderAgentId: req.verifyUserId,
      },
      data: {
        documentPricePerPiece: Number(documentPricePerPiece),
        packagePricePerKg: Number(packagePricePerKg),
        packagePricePerPiece: Number(packagePricePerPiece),
        deliveryTimeline: Number(shipmentTimeline),
      },
    });
    res.status(200).json({ message: 'Pricing updated successfully' });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getPricingData = async (req, res, next) => {
  try {
    const pricingData = await prisma.organisation.findUnique({
      where: {
        organisationLeaderAgentId: req.verifyUserId,
      },
      select: {
        documentPricePerPiece: true,
        packagePricePerKg: true,
        packagePricePerPiece: true,
        deliveryTimeline: true,
      },
    });
    res.status(200).json(pricingData);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const VERBAL_FEE = 10;
const ADULT_FEE = 20;
const DIRECT_FEE = 20;

function computeOrgQuote(org, { itemType, pieces, weight, verbal, adult, direct }) {
  let basePrice = 0;
  if (itemType === 'DOCUMENT') {
    basePrice = (Number(org.documentPricePerPiece) || 0) * pieces;
  } else if (itemType === 'PACKAGE') {
    basePrice =
      (Number(org.packagePricePerKg) || 0) * weight +
      (Number(org.packagePricePerPiece) || 0) * pieces;
  }
  const collectionPrice = basePrice * 0.1;
  const extrasPrice =
    (verbal ? VERBAL_FEE : 0) + (adult ? ADULT_FEE : 0) + (direct ? DIRECT_FEE : 0);
  const totalPrice = basePrice + collectionPrice + extrasPrice;
  return { basePrice, collectionPrice, extrasPrice, totalPrice };
}

/**
 * Live carrier quotes for a sender's shipment inputs.
 * Prices are computed on the server from current Organisation rates — never from drafts.
 */
export const getShippingQuotes = async (req, res, next) => {
  try {
    const itemType = String(req.query.itemType || '').toUpperCase();
    const pieces = Math.max(0, Number(req.query.pieces) || 0);
    const weight = Math.max(0, Number(req.query.weight) || 0);
    const verbal = req.query.verbal === '1' || req.query.verbal === 'true';
    const adult = req.query.adult === '1' || req.query.adult === 'true';
    const direct = req.query.direct === '1' || req.query.direct === 'true';

    if (itemType !== 'DOCUMENT' && itemType !== 'PACKAGE') {
      return res.status(400).json({
        message: 'itemType must be DOCUMENT or PACKAGE',
        quotes: [],
      });
    }

    const organisations = await prisma.organisation.findMany({
      where:
        itemType === 'DOCUMENT'
          ? { documentPricePerPiece: { gt: 0 } }
          : {
              OR: [
                { packagePricePerKg: { gt: 0 } },
                { packagePricePerPiece: { gt: 0 } },
              ],
            },
      orderBy: { organisationName: 'asc' },
      select: {
        id: true,
        organisationName: true,
        organisationAddress: true,
        modeOfWork: true,
        superAdminApproval: true,
        documentPricePerPiece: true,
        packagePricePerKg: true,
        packagePricePerPiece: true,
        deliveryTimeline: true,
      },
    });

    const quotes = organisations.map((org) => {
      const amounts = computeOrgQuote(org, {
        itemType,
        pieces,
        weight,
        verbal,
        adult,
        direct,
      });
      return {
        ...org,
        ...amounts,
        currency: 'AED',
        itemType,
        pieces,
        weight,
      };
    });

    // Approved carriers first, then cheapest
    quotes.sort((a, b) => {
      if (a.superAdminApproval !== b.superAdminApproval) {
        return a.superAdminApproval ? -1 : 1;
      }
      return a.totalPrice - b.totalPrice;
    });

    res.status(200).json({
      quotes,
      meta: { itemType, pieces, weight, verbal, adult, direct, currency: 'AED' },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getAllOrganisationData = async (req, res, next) => {
  try {
    const allOrganisationData = await prisma.organisation.findMany({
      orderBy: { organisationName: 'asc' },
      select: {
        id: true,
        organisationName: true,
        organisationAddress: true,
        organisationWebsiteUrl: true,
        modeOfWork: true,
        superAdminApproval: true,
        documentPricePerPiece: true,
        packagePricePerKg: true,
        packagePricePerPiece: true,
        deliveryTimeline: true,
      },
    });
    res.status(200).json(allOrganisationData);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

