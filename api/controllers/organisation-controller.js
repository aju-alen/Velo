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



