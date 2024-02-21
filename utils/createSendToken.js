export const createSendToken = (user, statusCode, res) => {
  const token = user.generateAuthToken();

  const { password, role, ...rest } = user._doc;

  const details = {
    token,
    ...rest,
  };

  return res.status(statusCode).json({
    details,
    role,
  });
};
