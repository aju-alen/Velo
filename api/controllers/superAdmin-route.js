
import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
import resend from "../utils/resend.js";
import { getVerificationApprovedEmail, getVerificationRejectedEmail } from "../utils/emailTemplates/verificationDecisionEmail.js";
dotenv.config();

const prisma = new PrismaClient();

export const createNewCountry = async (req, res,next) => {
    try{
        const {countryName,countryIsoCode,countryIso3Code,countryCallingCode,countryRegion,countrySubRegion,countryCurrencyCode,countryCurrencyName,countryCurrencySymbol,countryFlag} = req.body;
        const countryExists = await prisma.country.findUnique({
            where: {
                iso3Code:countryIso3Code
            }
        });
        if(countryExists){
            return res.status(400).json({ message: "This country already exists" });
        }
        const newCountry = await prisma.country.create({
            data: {
                name: countryName,
                isoCode: countryIsoCode,
                iso3Code: countryIso3Code,
                callingCode: countryCallingCode,
                region: countryRegion,
                subRegion: countrySubRegion,
                currencyCode: countryCurrencyCode,
                currencyName: countryCurrencyName,
                currencySymbol: countryCurrencySymbol,
                flag: countryFlag,
            }
        });
        await prisma.$disconnect();
        return res.status(200).json({ message: "Country created successfully" });
    }
    catch(err){
        console.log(err);
        next(err);
    }
}
export const createNewCategory = async (req, res,next) => {
    console.log(req.body);
    
    try{    
        const createCategory = await prisma.category.create({
            data: {
                name: req.body.categoryName,
                description: req.body.categoryDescription,
                categoryImgUrl: req.body.categoryImgUrl,
            }
        });
        await prisma.$disconnect();
        return res.status(200).json({ message: "Category created successfully" });

    }
    catch(err){
        console.log(err);
        next(err);

    }
}

export const getAllAppointmentRequest = async (req, res,next) => {
    try{
        const allAppointmentRequest = await prisma.agent.findMany({
            where: {
                registerVerificationStatus: "APPOINTMENT_BOOKED"
            },
            include: {
                leadsOrganisation: {
                    select: {
                        organisationName: true,
                        modeOfWork: true,
                    }
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const mapped = allAppointmentRequest.map((agent) => ({
            ...agent,
            organisation: agent.leadsOrganisation
                ? { organisationName: agent.leadsOrganisation.organisationName }
                : null,
        }));

        await prisma.$disconnect();
        return res.status(200).json({ message: "All appointment requests", allAppointmentRequest: mapped});
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

const sendVerificationDecisionEmail = async (name, email, approved) => {
    try {
        const emailData = approved
            ? getVerificationApprovedEmail(name, email)
            : getVerificationRejectedEmail(name, email);
        await resend.emails.send(emailData);
    } catch (err) {
        console.log('Err sending verification decision email', err);
    }
};

export const approveAgentAppointment = async (req, res,next) => {
    const {agentId} = req.params;
    try{
        const organisation = await prisma.organisation.findUnique({
            where:{
                organisationLeaderAgentId: agentId
            },
            select:{
                modeOfWork:true
            }
        });

        if (!organisation) {
            return res.status(404).json({ message: "Organisation not found for this agent" });
        }
        
        const modeOfWork = organisation.modeOfWork === 'SOLO' ? 1 : 5; 
        const updateOrgApproval = await prisma.organisation.update({
            where:{
                organisationLeaderAgentId: agentId
            },
            data:{
                superAdminApproval: true,
                organisationEmployeesCount: modeOfWork
            }
        })
        const updateAgentApproval = await prisma.agent.update({
            where:{
                id: agentId
            },
            data:{
                registerVerificationStatus: "LOGGED_IN",
                isOrganisationLeader: true,
                organisationId: updateOrgApproval.id
            }
        })

        await sendVerificationDecisionEmail(updateAgentApproval.name, updateAgentApproval.email, true);

        await prisma.$disconnect();
        return res.status(200).json({ message: "Appointment approved successfully", updateBool: true });
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

export const declineAgentAppointment = async (req, res, next) => {
    const { agentId } = req.params;
    try {
        const agent = await prisma.agent.findUnique({
            where: { id: agentId },
        });

        if (!agent) {
            return res.status(404).json({ message: "Agent not found" });
        }

        if (agent.registerVerificationStatus !== "APPOINTMENT_BOOKED") {
            return res.status(400).json({ message: "Agent is not awaiting verification" });
        }

        const updatedAgent = await prisma.agent.update({
            where: { id: agentId },
            data: {
                registerVerificationStatus: "REJECTED",
            },
        });

        await prisma.organisation.updateMany({
            where: { organisationLeaderAgentId: agentId },
            data: { superAdminApproval: false },
        });

        await sendVerificationDecisionEmail(updatedAgent.name, updatedAgent.email, false);

        await prisma.$disconnect();
        return res.status(200).json({ message: "Appointment declined successfully", updateBool: true });
    } catch (err) {
        console.log(err);
        next(err);
    }
};
