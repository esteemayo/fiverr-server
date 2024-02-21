export const createSendToken = (user, statusCode, res) => {
  const { password, role, ...rest } = user._doc;

  const details = {
    ...rest,
  };

  return res.status(statusCode).json({
    details,
    role,
  });
};
