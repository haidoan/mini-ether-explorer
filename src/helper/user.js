const redisHelper = require('../controller/redis');

const userController = {
  getUsers: async (req, res) => {
    try {
      const allUser = await redisHelper.getAll('address');
      res.status(200).send({ status: 'success', data: allUser });
    } catch (error) {
      console.log('error happen at loadAllTokens ', error);
      res.status(500).send({ status: 'failed', error });
    }
  },

  getUser: async (req, res) => {
    try {
      const address = req.params.address;
      console.log('address ', address);
      const user = await redisHelper.get('address', address.toLowerCase());
      if (user) res.status(200).send({ address: user });
      else res.status(200).send('NOT FOUND');
    } catch (error) {
      res.status(500).send({ error: error });
    }
  },
  addUser: async (req, res) => {
    try {
      const address = req.body.address;
      console.log('address ', address);

      await redisHelper.set('address', address.toLowerCase(), true);
      res
        .status(200)
        .send({ status: 'success', message: 'success save user to db!' });
    } catch (error) {
      res.status(500).send({ error: error });
    }
  },
  removeUser: async (req, res) => {
    try {
      const address = req.body.address;
      console.log('address ', address);

      await redisHelper.delete('address', address);
      res
        .status(200)
        .send({ status: 'success', message: 'success remove user from db!' });
    } catch (error) {
      res.status(500).send({ error: error });
    }
  }
};

module.exports = userController;
