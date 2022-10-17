const { gql } = require('apollo-server');

exports.typeDefs = gql`
  type Query {
    allUnitsOnly: [Units!]!
    allUnitsWithLock: [Lock!]!
  }

  type Units {
    unitName: String!
    createAt: String
  }

  type Lock {
    remote_lock_id: String!
    unitId: ID!
  }

  type Reservations {
    guestName: String!
    checkIn: String!
    checkOut: String!
    unitId: ID!
    reservationId: Int!
  }

  type access_token {
    passCode: String!
    remoteLockId: String!
    reservationID: [Reservations!]!
    unitId: [Units!]!
  }

  type Mutation {
    createReservation(input: createReservationInput!): Reservations!

    updateReservation(input: updateReservationInput!): Reservations!

    cancelReservation(input: cancelReservationInput): Reservations!
  }

  input createReservationInput {
    unitID: Int!
    guestName: String!
    checkIn: String!
    checkOut: String!
  }

  input updateReservationInput {
    reservationId: Int!
    unitID: Int!
    guestName: String!
    checkIn: String!
    checkOut: String!
  }

  input cancelReservationInput {
    reservationId: Int!
    unitID: Int!
    guestName: String!
    checkIn: String!
    checkOut: String!
  }
`;
