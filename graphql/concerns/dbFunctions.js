exports.findRemoteLockIdDb = async (unitID, prisma) => {
  const lock = await prisma.lock.findUnique({
    where: {
      id: unitID,
    },
  });
  return lock.remote_lock_id;
};

exports.createReservation = async (
  guestName,
  times1,
  times2,
  unitID,
  prisma,
) => {
  const unit = await prisma.reservation.create({
    data: {
      guest_name: guestName,
      check_in: times1,
      check_out: times2,
      is_canceled: false,
      unitId: unitID,
    },
  });
  return unit;
};

exports.createAccessToken = async (
  passCode,
  uid,
  reservationID,
  lockId,
  prisma,
) => {
  const accessToken = await prisma.access_code.create({
    data: {
      passcode: passCode,
      remote_passcode_id: uid,
      lockId: lockId,
      reservationId: reservationID,
    },
  });
  return accessToken;
};

exports.findPassCodeId = async (reservationId, prisma) => {
  const passCode = await prisma.access_code.findUnique({
    where: {
      id: reservationId,
    },
    select: {
      remote_passcode_id: true,
    },
  });
  return passCode;
};

exports.getLastRecordReservation = async (prisma) => {
  const lastRecord = await prisma.reservation.findMany({
    orderBy: {
      unitId: 'desc',
    },
    take: 1,
  });
  return lastRecord[0];
};

exports.getRecordReservationDb = async (reservationId, prisma) => {
  const passCode = await prisma.access_code.findUnique({
    where: {
      id: reservationId,
    },
  });
  return passCode;
};
