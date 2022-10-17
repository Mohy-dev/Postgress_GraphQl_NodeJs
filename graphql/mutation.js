const tuyApiFun = require('../utils/tuyapi/sign.js');
const { generatePassword } = require('./concerns/crypto.js');
const {
  getToken,
  refreshToken,
  getLocalKey,
  getTempPassword,
  deleteAccessToken,
} = tuyApiFun;
const {
  findRemoteLockIdDb,
  createReservation,
  createAccessToken,
  findPassCodeId,
  getRecordReservationDb,
  getLastRecordReservation,
} = require('./concerns/dbFunctions.js');

exports.Mutation = {
  createReservation: async (parent, { input }, { prisma }) => {
    const { guestName, checkIn, checkOut, unitID } = input;

    // detection of there is lock submitted to the unit
    const deviceId = await findRemoteLockIdDb(unitID, prisma);
    if (!deviceId) {
      throw new Error('No lock found');
    }

    const tokenBody = await getToken(deviceId);

    if (tokenBody.success == false) {
      const errCode = tokenBody.code;
      throw new Error('No token found, error code: ' + errCode);
    }

    // const passCode = await generatePassword(tokenBody, deviceId);
    // if (!passCode) {
    //   throw new Error('passcode can't be generated')
    // }

    const passCode = '938fd1';
    const uid = tokenBody.result.uid;
    const lock = await prisma.lock.findUnique({
      where: {
        id: unitID,
      },
    });

    if (!lock) {
      throw new Error('No lock found');
    }
    if (!uid) {
      throw new Error('No uid found');
    }
    if (!passCode) {
      throw new Error('No passcode found');
    }

    if (tokenBody.success == true && passCode && passCode.length == 6) {
      const times1 = new Date(checkIn).toISOString();
      const times2 = new Date(checkOut).toISOString();
      const reservation = await createReservation(
        guestName,
        times1,
        times2,
        unitID,
        prisma,
      );

      if (!reservation) {
        throw new Error('Reservation entry not created, check inputs');
      }

      const accessToken = await createAccessToken(
        passCode,
        uid,
        reservation.id,
        lock.id,
        prisma,
      );

      if (!accessToken) {
        throw new Error('Access token entry not created, check inputs');
      }
      return reservation;
    }
  },
  updateReservation: async (parent, { input }, { prisma }) => {
    const { guestName, checkIn, checkOut, unitID, reservationId } = input;

    const reservationRecord = await getRecordReservationDb(
      reservationId,
      prisma,
    );

    if (!reservationRecord) {
      throw new Error('No reservation found accordingly');
    }

    // const deleteAccess = await deleteAccessToken(deviceId, passId);
    // if (!deleteAccess) {
    //   const errCode = deleteAccess.code;
    //   throw new Error('Access token not deleted yet, error code: ' + errCode);
    // }

    const deviceId = await findRemoteLockIdDb(unitID, prisma);
    if (!deviceId) {
      throw new Error('No lock found');
    }

    const tokenBody = await getToken(deviceId);
    if (!tokenBody.success) {
      const errCode = tokenBody.code;
      throw new Error('No token found, error code: ' + errCode);
    }

    // const passCode = await generatePassword(tokenBody, deviceId);
    // if (!passCode) {
    //   throw new Error('passcode can't be generated')
    // }

    const passCode = '938fd1';
    const uid = tokenBody.result.uid;
    const lock = await prisma.lock.findUnique({
      where: {
        id: unitID,
      },
    });

    if (!lock) {
      throw new Error('No lock found');
    }
    if (!uid) {
      throw new Error('No uid found');
    }
    if (!passCode) {
      throw new Error('No passcode found');
    }

    if (tokenBody.success == true && passCode && passCode.length == 6) {
      const times1 = new Date(checkIn).toISOString();
      const times2 = new Date(checkOut).toISOString();
      const reservation = await createReservation(
        guestName,
        times1,
        times2,
        unitID,
        prisma,
      );

      if (!reservation) {
        throw new Error('Reservation entry not created, check inputs');
      }

      const accessToken = await createAccessToken(
        reservationRecord.passcode,
        uid,
        reservation.id,
        reservationRecord.id,
        prisma,
      );

      if (!accessToken) {
        throw new Error('Access token entry not created, check inputs');
      }

      return reservation;
    }
  },
  cancelReservation: async (parent, { input }, { prisma }) => {
    const { guestName, checkIn, checkOut, unitID, reservationId } = input;

    const deviceId = await findRemoteLockIdDb(unitID, prisma);
    if (!deviceId) {
      throw new Error('No lock found');
    }

    const passId = await findPassCodeId(reservationId, prisma);
    if (!passId) {
      throw new Error('No passcode found');
    }

    // const deleteAccess = await deleteAccessToken(deviceId, passId);
    // if (!deleteAccess) {
    //   const errCode = deleteAccess.code;
    //   throw new Error('Access token not deleted yet, error code: ' + errCode);
    // }

    const updateCancelStatus = await prisma.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        is_canceled: true,
      },
    });

    if (!updateCancelStatus) {
      throw new Error('Reservation not cancelled yet');
    }

    return 'Reservation cancelled';
  },
};
