export type EventImage = {
  src: string;
  alt: string;
};

export type RegisterUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  displayPhoto?: string;
  eventId: string;
};
