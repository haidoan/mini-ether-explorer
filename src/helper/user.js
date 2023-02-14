const redisHelper = require('../controller/redis');

const userController = {
  getUsers: async (req, res) => {
    try {
      const allUser = await redisHelper.getAll('address');
      return res.status(200).send({ status: 'success', data: allUser });
    } catch (error) {
      res.status(500).send({ status: 'failed', message: error.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const address = req.params.address;
      const user = await redisHelper.get('address', address.toLowerCase());
      if (!user) {
        return res.status(400).send({ status: 'failed', message: 'USER_NOT_FOUND' });
      }

      return res.status(200).send({ address: user });
    } catch (error) {
      return res.status(500).send({ status: 'failed', message: error.message });
    }
  },
  addUser: async (req, res) => {
    try {
      const address = req.body.address;
      await redisHelper.set('address', address.toLowerCase(), true);
      return res
        .status(200)
        .send({ status: 'success' });
    } catch (error) {
      res.status(500).send({ status: 'failed', message: error.message });
    }
  },
  removeUser: async (req, res) => {
    try {
      const address = req.body.address;
      await redisHelper.delete('address', address);
      return res
        .status(200)
        .send({ status: 'success' });
    } catch (error) {
      res.status(500).send({ status: 'failed', message: error.message });
    }
  }
};

module.exports = userController;
