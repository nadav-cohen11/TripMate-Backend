import QRCode from 'qrcode';

export const generateUserQRCode = async (userId) => {
  const url = `${process.env.FRONTEND_URL}/profile/${userId}`;
  try {
    const qrDataURL = await QRCode.toDataURL(url);
    return qrDataURL;
  } catch (error) {
    throw error;
  }
};
