require('dotenv/config');

export default {
  host: 'smtp.mailtrap.io',
  port: '2525',
  secure: false,
  auth: {
    user: 'ca5a93b98b51b2',
    pass: '79da3fd128bfb9',
  },
  default: {
    from: 'Barber Shop Crew <noreply@barbershop.com>'
  }
};