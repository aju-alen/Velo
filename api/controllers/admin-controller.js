import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const parsePaging = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(req.query.pageSize, 10) || 50, 1), 50);
  return { page, pageSize, skip: (page - 1) * pageSize };
};

export const getAdminStats = async (req, res, next) => {
  try {
    const [
      sendersJoined,
      agentsJoined,
      subAgentsJoined,
      organisations,
      shipmentsCreated,
      completedShipments,
      paidShipmentsActive,
      paidCompleted,
      shipmentDrafts,
      pendingAgentAppointments,
      contactInquiries,
      spendActive,
      spendCompleted,
      paymentPendingShipments,
      ordersInMarket,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.agent.count({ where: { role: 'AGENT' } }),
      prisma.agent.count({ where: { role: 'SUB_AGENT' } }),
      prisma.organisation.count(),
      prisma.shipment.count(),
      prisma.completedShipment.count(),
      prisma.shipment.count({ where: { paymentSuccess: true } }),
      prisma.completedShipment.count({ where: { paymentSuccess: true } }),
      prisma.shipmentDraft.count(),
      prisma.agent.count({ where: { registerVerificationStatus: 'APPOINTMENT_BOOKED' } }),
      prisma.contactInquiry.count(),
      prisma.shipment.aggregate({
        where: { paymentSuccess: true },
        _sum: { paymentAmount: true },
      }),
      prisma.completedShipment.aggregate({
        where: { paymentSuccess: true },
        _sum: { paymentAmount: true },
      }),
      prisma.shipment.count({ where: { shipmentStatus: 'PAYMENT_PENDING' } }),
      prisma.shipment.count({ where: { shipmentStatus: 'ORDER_IN_MARKET' } }),
    ]);

    const totalPurchaseAmount =
      (spendActive._sum.paymentAmount || 0) + (spendCompleted._sum.paymentAmount || 0);

    return res.status(200).json({
      sendersJoined,
      agentsJoined,
      subAgentsJoined,
      organisations,
      shipmentsCreated,
      completedShipments,
      paidPurchases: paidShipmentsActive + paidCompleted,
      totalPurchaseAmount,
      shipmentDrafts,
      pendingAgentAppointments,
      contactInquiries,
      paymentPendingShipments,
      ordersInMarket,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminSenders = async (req, res, next) => {
  try {
    const { page, pageSize, skip } = parsePaging(req);
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const where = {
      role: 'USER',
      ...(q
        ? {
            OR: [{ name: { contains: q } }, { email: { contains: q } }],
          }
        : {}),
    };

    const [total, senders] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          mobileNumber: true,
          registerVerificationStatus: true,
          createdAt: true,
          _count: { select: { shipments: true } },
        },
      }),
    ]);

    return res.status(200).json({
      page,
      pageSize,
      total,
      senders: senders.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        mobileNumber: s.mobileNumber,
        registerVerificationStatus: s.registerVerificationStatus,
        shipmentsCount: s._count.shipments,
        createdAt: s.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminAgents = async (req, res, next) => {
  try {
    const { page, pageSize, skip } = parsePaging(req);
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const where = {
      ...(q
        ? {
            OR: [{ name: { contains: q } }, { email: { contains: q } }],
          }
        : {}),
    };

    const [total, agents] = await Promise.all([
      prisma.agent.count({ where }),
      prisma.agent.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          registerVerificationStatus: true,
          isOrganisationLeader: true,
          appointmentDate: true,
          createdAt: true,
          organisation: { select: { organisationName: true, superAdminApproval: true } },
        },
      }),
    ]);

    return res.status(200).json({
      page,
      pageSize,
      total,
      agents: agents.map((a) => ({
        id: a.id,
        name: a.name,
        email: a.email,
        role: a.role,
        registerVerificationStatus: a.registerVerificationStatus,
        isOrganisationLeader: a.isOrganisationLeader,
        appointmentDate: a.appointmentDate,
        organisationName: a.organisation?.organisationName || null,
        superAdminApproval: a.organisation?.superAdminApproval ?? null,
        createdAt: a.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminShipments = async (req, res, next) => {
  try {
    const { page, pageSize, skip } = parsePaging(req);
    const status =
      typeof req.query.status === 'string' && req.query.status.trim()
        ? req.query.status.trim()
        : undefined;

    const where = status ? { shipmentStatus: status } : {};

    const [total, rows] = await Promise.all([
      prisma.shipment.count({ where }),
      prisma.shipment.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { shipmentDate: 'desc' },
        select: {
          id: true,
          shipmentId: true,
          shipmentStatus: true,
          shipmentDate: true,
          paymentSuccess: true,
          paymentAmount: true,
          paymentCurrency: true,
          senderName: true,
          senderEmail: true,
          receiverCity: true,
          receiverState: true,
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

    return res.status(200).json({
      page,
      pageSize,
      total,
      shipments: rows.map((row) => ({
        id: row.id,
        shipmentId: row.shipmentId,
        shipmentStatus: row.shipmentStatus,
        shipmentDate: row.shipmentDate,
        paymentSuccess: row.paymentSuccess,
        paymentAmount: row.paymentAmount,
        paymentCurrency: row.paymentCurrency,
        senderName: row.senderName,
        senderEmail: row.senderEmail,
        receiverLocation: [row.receiverCity, row.receiverState].filter(Boolean).join(', '),
        userName: row.user?.name || null,
        userEmail: row.user?.email || null,
      })),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminPurchases = async (req, res, next) => {
  try {
    const { page, pageSize, skip } = parsePaging(req);
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';

    const where = {
      paymentSuccess: true,
      ...(q
        ? {
            OR: [
              { senderEmail: { contains: q } },
              { senderName: { contains: q } },
              { shipmentId: { contains: q } },
            ],
          }
        : {}),
    };

    const [total, rows] = await Promise.all([
      prisma.shipment.count({ where }),
      prisma.shipment.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { shipmentDate: 'desc' },
        select: {
          id: true,
          shipmentId: true,
          shipmentDate: true,
          paymentAmount: true,
          paymentCurrency: true,
          recieptUrl: true,
          senderName: true,
          senderEmail: true,
          stripeId: true,
        },
      }),
    ]);

    return res.status(200).json({
      page,
      pageSize,
      total,
      purchases: rows.map((row) => ({
        id: row.id,
        shipmentId: row.shipmentId,
        purchaseDate: row.shipmentDate,
        paymentAmount: row.paymentAmount,
        paymentCurrency: row.paymentCurrency,
        receiptUrl: row.recieptUrl,
        senderName: row.senderName,
        senderEmail: row.senderEmail,
        stripeId: row.stripeId,
      })),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminContactInquiries = async (req, res, next) => {
  try {
    const { page, pageSize, skip } = parsePaging(req);
    const [total, inquiries] = await Promise.all([
      prisma.contactInquiry.count(),
      prisma.contactInquiry.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return res.status(200).json({ page, pageSize, total, inquiries });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
